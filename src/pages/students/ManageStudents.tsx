import React from "react";
import DashboardCard from "../../components/layout/DashboardCard";
import { useManageStudents } from "../../hooks/useManageStudents";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: "bold",
  color: "#475569",
  marginBottom: "4px",
  textTransform: "uppercase"
};

export default function ManageStudents() {
  const {
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
  } = useManageStudents();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      
      <DashboardCard>
        <h2 style={{ color: "#2aa7ff", margin: "0 0 8px 0" }}>Manage Students</h2>
        <p className="user-email" style={{ marginBottom: "20px" }}>Register a new student profile below.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
          <div>
            <label style={labelStyle}>Student Full Name</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="John Pork" value={newStudent.name} onChange={(e) => updateNewStudentField("name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Grade</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="Grade Level" value={newStudent.grade} onChange={(e) => updateNewStudentField("grade", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Special Need</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="Need" value={newStudent.need} onChange={(e) => updateNewStudentField("need", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Home Address</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="Address" value={newStudent.address} onChange={(e) => updateNewStudentField("address", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Guardian Name</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="John Wick" value={newStudent.guardian} onChange={(e) => updateNewStudentField("guardian", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input className="student-input" style={{ width: "100%" }} placeholder="09123456789" value={newStudent.contact} maxLength={11} onChange={(e) => updateNewStudentField("contact", e.target.value)} />
          </div>

          <button onClick={handleAddStudent} className="btn-primary" style={{ gridColumn: "span 2", marginTop: "8px", height: "42px" }}>
            + Create Student Profile
          </button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <h3 className="sidebar-title" style={{ width: "100%", marginBottom: "20px" }}>Current Students</h3>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          {students.map((student) => (
            <div key={student.id} style={{ width: "100%", padding: "20px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
              {editingId === student.id ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%" }}>
                  <div><label style={labelStyle}>Name</label><input className="student-input" style={{ width: "100%" }} value={editFormData?.name} onChange={(e) => updateEditField("name", e.target.value)} /></div>
                  <div><label style={labelStyle}>Grade</label><input className="student-input" style={{ width: "100%" }} value={editFormData?.grade} onChange={(e) => updateEditField("grade", e.target.value)} /></div>
                  <div><label style={labelStyle}>Need</label><input className="student-input" style={{ width: "100%" }} value={editFormData?.need} onChange={(e) => updateEditField("need", e.target.value)} /></div>
                  <div><label style={labelStyle}>Address</label><input className="student-input" style={{ width: "100%" }} value={editFormData?.address} onChange={(e) => updateEditField("address", e.target.value)} /></div>
                  <div><label style={labelStyle}>Guardian</label><input className="student-input" style={{ width: "100%" }} value={editFormData?.guardian} onChange={(e) => updateEditField("guardian", e.target.value)} /></div>
                  <div><label style={labelStyle}>Contact</label><input className="student-input" style={{ width: "100%" }} maxLength={11} value={editFormData?.contact} onChange={(e) => updateEditField("contact", e.target.value)} /></div>
                  
                  <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button onClick={saveEdit} className="btn-primary" style={{ flex: 1, background: "#10b981" }}>Save</button>
                    <button onClick={cancelEdit} className="logout-btn" style={{ flex: 1, background: "#64748b" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="user-info">
                    <span className="user-name" style={{ fontSize: "1.2rem", display: "block" }}>{student.name}</span>
                    <span className="user-email" style={{ fontSize: "0.9rem", display: "block" }}>Grade {student.grade} • {student.need}</span>
                    <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "#64748b" }}>
                      <strong>Guardian:</strong> {student.guardian} | <strong>Contact:</strong> {student.contact}<br/>
                      <strong>Address:</strong> {student.address}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", zIndex: 10 }}>
                     <button onClick={() => startEdit(student)} className="btn-primary" style={{ background: "#3b82f6", width: 'auto', padding: '8px 20px' }}>Edit</button>
                     <button onClick={() => removeStudent(student.id)} className="logout-btn" style={{ width: "auto", padding: '8px 20px' }}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}