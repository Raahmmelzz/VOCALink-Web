import { useState, useEffect } from "react";

export interface Student {
  id: string;
  name: string;
  grade: string;
  need: string;
  address: string;
  guardian: string;
  contact: string;
}

export const useManageStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedData = localStorage.getItem("vocalink_students");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [newStudent, setNewStudent] = useState({
    name: "", grade: "", need: "", address: "", guardian: "", contact: ""
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Student | null>(null);

  useEffect(() => {
    localStorage.setItem("vocalink_students", JSON.stringify(students));
  }, [students]);

  // Helper for capitalization
  const formatText = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddStudent = () => {
    const isFormIncomplete = Object.values(newStudent).some(val => val.trim() === "");
    if (isFormIncomplete) {
      alert("Please fill up all fields before creating a profile.");
      return;
    }

    if (newStudent.contact.length !== 11) {
      alert("Contact number must be exactly 11 digits.");
      return;
    }

    const studentToAdd: Student = { 
      id: crypto.randomUUID(), 
      ...newStudent,
      name: formatText(newStudent.name),
      guardian: formatText(newStudent.guardian)
    };

    setStudents([...students, studentToAdd]);
    setNewStudent({ name: "", grade: "", need: "", address: "", guardian: "", contact: "" });
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditFormData({ ...student });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const saveEdit = () => {
    if (!editFormData) return;
    
    const isEditIncomplete = Object.values(editFormData).some(val => val.trim() === "");
    if (isEditIncomplete || editFormData.contact.length !== 11) {
      alert("All fields must be filled and contact must be 11 digits.");
      return;
    }

    setStudents(students.map(s => s.id === editingId ? {
      ...editFormData,
      name: formatText(editFormData.name),
      guardian: formatText(editFormData.guardian)
    } : s));
    
    cancelEdit();
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateNewStudentField = (field: keyof typeof newStudent, value: string) => {
    // Basic numeric check for contact
    const val = field === "contact" ? value.replace(/\D/g, "") : value;
    setNewStudent(prev => ({ ...prev, [field]: val }));
  };

  const updateEditField = (field: keyof Student, value: string) => {
    if (!editFormData) return;
    const val = field === "contact" ? value.replace(/\D/g, "") : value;
    setEditFormData({ ...editFormData, [field]: val });
  };

  return {
    students,
    newStudent,
    editingId,
    editFormData,
    handleAddStudent,
    startEdit,
    saveEdit,
    cancelEdit,
    removeStudent,
    updateNewStudentField,
    updateEditField
  };
};