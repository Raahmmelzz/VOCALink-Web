import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius, Shadow } from "../styles/tokens";
import { Avatar, Badge, Button, Divider } from "../components/ui";
import api from "../services/api";

type RealStudent = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
};

type AllStudent = RealStudent & { assigned: boolean };

const AVATAR_PALETTE = [
  { bg: "#E0F6FD", color: "#0E8DB8" },
  { bg: "#FEF3C7", color: "#B45309" },
  { bg: "#FCE7F3", color: "#9D174D" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#D1FAE5", color: "#065F46" },
];

function avatarColor(id: number) {
  return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

function displayName(s: RealStudent) {
  return (s.first_name || s.last_name)
    ? `${s.first_name} ${s.last_name}`.trim()
    : s.username;
}

const Students: React.FC = () => {
  const [myStudents,  setMyStudents]  = useState<RealStudent[]>([]);
  const [allStudents, setAllStudents] = useState<AllStudent[]>([]);
  const [loadingReal, setLoadingReal] = useState(true);
  const [loadingAll,  setLoadingAll]  = useState(true);
  const [loadError,   setLoadError]   = useState("");
  const [removing,    setRemoving]    = useState<number | null>(null);
  const [searchRoster,  setSearchRoster]  = useState("");
  const [searchSystem,  setSearchSystem]  = useState("");

  const fetchMyStudents = async () => {
    setLoadingReal(true);
    setLoadError("");
    try {
      const res = await api.get("/teacher/students/");
      setMyStudents(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setLoadError(e.response?.data?.detail || e.message || "Could not reach server");
      setMyStudents([]);
    } finally {
      setLoadingReal(false);
    }
  };

  const fetchAllStudents = async () => {
    setLoadingAll(true);
    try {
      const res = await api.get("/users/all-students/");
      setAllStudents(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAllStudents([]);
    } finally {
      setLoadingAll(false);
    }
  };

  const addStudent = async (userId: number) => {
    try {
      await api.post(`/teacher/students/${userId}`);
      await Promise.all([fetchMyStudents(), fetchAllStudents()]);
    } catch {}
  };

  const removeStudent = async (userId: number) => {
    if (!confirm("Remove this student from your class?")) return;
    setRemoving(userId);
    try {
      await api.delete(`/teacher/students/${userId}`);
      await Promise.all([fetchMyStudents(), fetchAllStudents()]);
    } catch {}
    setRemoving(null);
  };

  useEffect(() => {
    fetchMyStudents();
    fetchAllStudents();
  }, []);

  const filteredSystem = allStudents.filter(s => {
    const name = displayName(s);
    return name.toLowerCase().includes(searchSystem.toLowerCase()) ||
      s.username.toLowerCase().includes(searchSystem.toLowerCase());
  });

  const filteredRoster = myStudents.filter(s => {
    const name = displayName(s);
    return name.toLowerCase().includes(searchRoster.toLowerCase()) ||
      s.username.toLowerCase().includes(searchRoster.toLowerCase());
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "10px 14px", borderRadius: Radius.md,
    border: `1.5px solid ${C.gray2}`, background: C.gray,
    fontSize: FontSize.base, color: C.text,
    marginBottom: 16, fontFamily: "inherit", outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── All System Students ── */}
      <div style={{ background: C.white, borderRadius: Radius.lg, border: `1px solid ${C.gray2}`, boxShadow: Shadow.sm, overflow: "hidden" }}>
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.gray2}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(to right, #FAFAFA, #F8FAFC)",
        }}>
          <div>
            <div style={{ fontSize: FontSize.md, fontWeight: 700, color: C.text }}>All System Students</div>
            <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>
              {loadingAll ? "Loading..." : `${allStudents.length} registered students in the system`}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { fetchMyStudents(); fetchAllStudents(); }}>
            ↻ Refresh
          </Button>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <input
            placeholder="Search students to add..."
            value={searchSystem}
            onChange={e => setSearchSystem(e.target.value)}
            style={inputStyle}
          />

          {!loadingAll && filteredSystem.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: C.text3, fontSize: FontSize.sm }}>
              No students found.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredSystem.map(s => {
              const av = avatarColor(s.id);
              const name = displayName(s);
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: Radius.md,
                  border: `1px solid ${C.gray2}`, background: C.gray,
                  transition: "box-shadow 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: av.bg, color: av.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700,
                    }}>
                      {name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: FontSize.base, fontWeight: 600, color: C.text }}>{name}</div>
                      <div style={{ fontSize: FontSize.xs, color: C.text3 }}>@{s.username}</div>
                    </div>
                  </div>
                  {s.assigned ? (
                    <Badge color="teal">✓ Assigned</Badge>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => addStudent(s.id)}>
                      + Add to Class
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Class Roster ── */}
      <div style={{ background: C.white, borderRadius: Radius.lg, border: `1px solid ${C.gray2}`, boxShadow: Shadow.sm, overflow: "hidden" }}>
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.gray2}`,
          background: "linear-gradient(to right, #FAFAFA, #F8FAFC)",
        }}>
          <div style={{ fontSize: FontSize.md, fontWeight: 700, color: C.text }}>Class Roster</div>
          <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>
            {loadError ? "⚠ Could not reach server" : `${myStudents.length} student(s) in your class`}
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {loadError && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: Radius.md, background: "#FEF2F2", border: "1px solid #FCA5A5", color: C.red, fontSize: FontSize.sm }}>
              ⚠ {loadError}
            </div>
          )}

          <input
            placeholder="Search your roster..."
            value={searchRoster}
            onChange={e => setSearchRoster(e.target.value)}
            style={inputStyle}
          />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {filteredRoster.map(s => {
              const av = avatarColor(s.id);
              const name = displayName(s);
              return (
                <div key={s.id} style={{
                  background: C.gray, borderRadius: Radius.lg,
                  padding: 16, border: `1px solid ${C.gray2}`, boxShadow: Shadow.sm,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: av.bg, color: av.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, flexShrink: 0,
                    }}>
                      {name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: FontSize.base, fontWeight: 600, color: C.text }}>{name}</div>
                      <div style={{ fontSize: FontSize.xs, color: C.text3 }}>@{s.username}</div>
                    </div>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <Button variant="outline" size="sm" style={{ flex: 1 }}>Edit</Button>
                    <Button
                      variant="danger" size="sm"
                      disabled={removing === s.id}
                      onClick={() => removeStudent(s.id)}
                      style={{ flex: 1 }}
                    >
                      {removing === s.id ? "..." : "Remove"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loadingReal && filteredRoster.length === 0 && (
            <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "32px 0" }}>
              {myStudents.length === 0
                ? "Your class is empty. Add students from the list above."
                : `No students match "${searchRoster}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
