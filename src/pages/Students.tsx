import React, { useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Avatar, StatusDot, Badge, Button, Divider } from "../components/ui";
import { STUDENTS } from "../data/mockData";
import type { Student, StudentStatus } from "../types";

const AVATAR_COLORS = [
  { bg: C.tealLight,   color: C.teal   },
  { bg: C.amberLight,  color: C.amber  },
  { bg: C.redLight,    color: C.red    },
  { bg: C.purpleLight, color: C.purple },
  { bg: C.blueLight,   color: C.blue   },
];

const STATUS_OPTIONS: StudentStatus[] = ["online", "idle", "request", "urgent"];

const STATUS_BADGE_COLOR: Record<StudentStatus, "teal" | "gray" | "amber" | "red"> = {
  online:  "teal",
  idle:    "gray",
  request: "amber",
  urgent:  "red",
};

// ─── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
interface StudentModalProps {
  student: Partial<Student> | null;
  onSave: (data: { name: string; status: StudentStatus }) => void;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onSave, onClose }) => {
  const [name,   setName]   = useState(student?.name   ?? "");
  const [status, setStatus] = useState<StudentStatus>(student?.status ?? "online");
  const [error,  setError]  = useState("");

  const handleSave = () => {
    if (!name.trim()) { setError("Name is required."); return; }
    onSave({ name: name.trim(), status });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.32)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.white, borderRadius: Radius.lg,
          padding: 24, width: 380,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 18 }}>
          {student?.id ? "Edit Student" : "Add Student"}
        </div>

        {/* Name field */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 4 }}>Full name</div>
          <input
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            placeholder="Enter student name"
            style={{
              width: "100%", fontSize: FontSize.sm, color: C.text,
              background: C.white, border: `1px solid ${error ? C.red : "#E2E0DC"}`,
              borderRadius: Radius.md, padding: "8px 10px", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
          {error && (
            <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>
          )}
        </div>

        {/* Status picker */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 8 }}>Status</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUS_OPTIONS.map(s => (
              <div
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: Radius.full,
                  border: `1.5px solid ${status === s ? C.teal : "#E2E0DC"}`,
                  background: status === s ? C.tealLight : C.white,
                  cursor: "pointer", fontSize: FontSize.sm, color: C.text,
                  transition: "all 0.15s",
                }}
              >
                <StatusDot status={s} />
                <span style={{ textTransform: "capitalize" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {student?.id ? "Save changes" : "Add student"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── DELETE CONFIRMATION MODAL ────────────────────────────────────────────────
const DeleteModal: React.FC<{
  student: Student;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ student, onConfirm, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.32)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200,
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: C.white, borderRadius: Radius.lg,
        padding: 24, width: 360,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 8 }}>
        Remove student?
      </div>
      <div style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 20 }}>
        <strong style={{ color: C.text }}>{student.name}</strong> will be removed from your
        class roster. This cannot be undone.
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          style={{ background: C.red, border: `1px solid ${C.red}` }}
        >
          Remove student
        </Button>
      </div>
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const Students: React.FC = () => {
  const [students,      setStudents]      = useState<Student[]>(STUDENTS);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState<StudentStatus | "all">("all");
  const [addModal,      setAddModal]      = useState(false);
  const [editStudent,   setEditStudent]   = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = ({ name, status }: { name: string; status: StudentStatus }) => {
    const colorIdx   = students.length % AVATAR_COLORS.length;
    const newStudent: Student = {
      id:      Date.now(),
      name,
      status,
      lastMsg: "—",
      time:    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      bg:      AVATAR_COLORS[colorIdx].bg,
      color:   AVATAR_COLORS[colorIdx].color,
      unread:  0,
    };
    setStudents(prev => [...prev, newStudent]);
    setAddModal(false);
  };

  const handleEdit = ({ name, status }: { name: string; status: StudentStatus }) => {
    if (!editStudent) return;
    setStudents(prev => prev.map(s =>
      s.id === editStudent.id ? { ...s, name, status } : s
    ));
    setEditStudent(null);
  };

  const handleDelete = () => {
    if (!deleteStudent) return;
    setStudents(prev => prev.filter(s => s.id !== deleteStudent.id));
    setDeleteStudent(null);
  };

  const counts: Record<StudentStatus, number> = {
    online:  students.filter(s => s.status === "online").length,
    idle:    students.filter(s => s.status === "idle").length,
    request: students.filter(s => s.status === "request").length,
    urgent:  students.filter(s => s.status === "urgent").length,
  };

  return (
    <>
      {addModal && (
        <StudentModal student={{}} onSave={handleAdd} onClose={() => setAddModal(false)} />
      )}
      {editStudent && (
        <StudentModal student={editStudent} onSave={handleEdit} onClose={() => setEditStudent(null)} />
      )}
      {deleteStudent && (
        <DeleteModal student={deleteStudent} onConfirm={handleDelete} onClose={() => setDeleteStudent(null)} />
      )}

      <Card>
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <CardTitle>Manage Students</CardTitle>
            <div style={{ fontSize: FontSize.sm, color: C.text3, marginTop: -8 }}>
              {students.length} students in SNED-A
            </div>
          </div>
          <Button variant="primary" onClick={() => setAddModal(true)}>+ Add Student</Button>
        </div>

        {/* ── Status filter pills ── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {(["all", ...STATUS_OPTIONS] as const).map(s => {
            const count    = s === "all" ? students.length : counts[s];
            const isActive = filterStatus === s;
            return (
              <div
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "4px 12px", borderRadius: Radius.full,
                  border: `1.5px solid ${isActive ? C.teal : "#E2E0DC"}`,
                  background: isActive ? C.tealLight : C.white,
                  cursor: "pointer", fontSize: FontSize.sm,
                  color: isActive ? C.teal : C.text2,
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {s !== "all" && <StatusDot status={s} />}
                <span style={{ textTransform: "capitalize" }}>{s}</span>
                <span style={{ fontWeight: 700 }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* ── Search ── */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students by name…"
            style={{
              width: "100%", maxWidth: 320,
              fontSize: FontSize.sm, color: C.text,
              background: C.gray, border: `1px solid ${C.gray2}`,
              borderRadius: Radius.md, padding: "7px 12px", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>

        <Divider style={{ margin: "0 0 16px" }} />

        {/* ── Student grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.text3, fontSize: FontSize.sm }}>
            No students found.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {filtered.map(s => (
              <div
                key={s.id}
                style={{
                  background: C.gray, borderRadius: Radius.md,
                  padding: 14, border: `1px solid ${C.gray2}`,
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                {/* Student header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={s.name} bg={s.bg} color={s.color} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: FontSize.base, fontWeight: 500, color: C.text,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {s.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <StatusDot status={s.status} />
                      <Badge color={STATUS_BADGE_COLOR[s.status]} style={{ fontSize: 10, padding: "1px 6px" }}>
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Last message */}
                <div>
                  <div style={{ fontSize: FontSize.xs, color: C.text3 }}>Last message</div>
                  <div style={{
                    fontSize: 12, color: C.text2, marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {s.lastMsg}
                  </div>
                  <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>{s.time}</div>
                </div>

                <Divider style={{ margin: "2px 0" }} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <Button size="sm" style={{ flex: 1 }} onClick={() => setEditStudent(s)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    style={{ flex: 1, color: C.red, borderColor: "#F7D4D4" }}
                    onClick={() => setDeleteStudent(s)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default Students;
