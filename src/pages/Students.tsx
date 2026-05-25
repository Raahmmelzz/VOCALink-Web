import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Avatar, StatusDot, Divider, Button } from "../components/ui";
import type { StudentStatus } from "../types";
import api from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────────
type RealStudent = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
};

type AllStudent = RealStudent & { assigned: boolean };

const STATUS_FILTERS = ["All", "Online", "Idle", "Request", "Urgent"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  online:  { bg: C.tealLight,   color: C.teal   },
  idle:    { bg: C.gray,        color: C.text3  },
  request: { bg: C.amberLight,  color: C.amber  },
  urgent:  { bg: C.redLight,    color: C.red    },
};

const AVATAR_PALETTE = [
  { bg: C.tealLight,   color: C.teal   },
  { bg: C.blueLight,   color: C.blue   },
  { bg: C.purpleLight, color: C.purple },
  { bg: C.amberLight,  color: C.amber  },
  { bg: C.redLight,    color: C.red    },
];

function avatarColor(id: number) {
  return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

function displayName(s: RealStudent) {
  return (s.first_name || s.last_name)
    ? `${s.first_name} ${s.last_name}`.trim()
    : s.username;
}

// ── Main Component ─────────────────────────────────────────────────────────────
const Students: React.FC = () => {

  // Manage Students state (Assigned to teacher)
  const [myStudents,   setMyStudents]   = useState<RealStudent[]>([]);
  const [loadError,    setLoadError]    = useState("");
  const [loadingReal,  setLoadingReal]  = useState(true);
  const [removing,     setRemoving]     = useState<number | null>(null);

  // All Students state (From DB)
  const [allStudents, setAllStudents] = useState<AllStudent[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);

  // Class Roster filter/search state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [searchSystem, setSearchSystem] = useState("");
  const [searchRoster, setSearchRoster] = useState("");

  // ── API calls ────────────────────────────────────────────────────────────────
  const fetchMyStudents = async () => {
    setLoadingReal(true);
    setLoadError("");
    try {
      const response = await api.get('/teacher/students/'); 
      const data = response.data;
      setMyStudents(Array.isArray(data) ? data : []); 
    } catch (e: any) {
      console.error("My Students Error:", e);
      setLoadError(e.response?.data?.detail || e.message || "Could not reach server");
      setMyStudents([]);
    } finally {
      setLoadingReal(false);
    }
  };

  const fetchAllStudents = async () => {
    setLoadingAll(true);
    try {
      const response = await api.get('/users/all-students/');
      const data = response.data;
      setAllStudents(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Error fetching all students:", e);
      setAllStudents([]);
    } finally {
      setLoadingAll(false);
    }
  };

  const removeStudent = async (userId: number) => {
    if (!confirm("Remove this student from your class?")) return;
    setRemoving(userId);
    try {
      await api.delete(`/teacher/students/${userId}`);
      // Refresh both lists
      await fetchMyStudents();
      await fetchAllStudents();
    } catch (e) {
      console.error("Error removing student:", e);
    } finally {
      setRemoving(null);
    }
  };

  const addStudent = async (userId: number) => {
    try {
      await api.post(`/teacher/students/${userId}`);
      // Refresh both lists
      await fetchMyStudents();
      await fetchAllStudents();
    } catch (e) {
      console.error("Error adding student:", e);
    }
  };

  useEffect(() => { 
    fetchMyStudents(); 
    fetchAllStudents();
  }, []);

  // ── Formatting DB data for UI ────────────────────────────────────────────────
  
  // Format My Students (Roster) for the Grid layout
  const formattedRoster = myStudents.map(s => {
    const name = displayName(s);
    const av = avatarColor(s.id);
    return {
        id: s.id,
        name: name,
        username: s.username,
        status: "idle", // Defaulting to idle until WS statuses are saved to DB
        lastMsg: "No recent messages",
        time: "",
        bg: av.bg,
        color: av.color,
    };
  });

  // Filter My Students (Roster)
  const filteredRoster = formattedRoster.filter(s => {
    const matchStatus = statusFilter === "All" || s.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(searchRoster.toLowerCase()) || 
                        s.username.toLowerCase().includes(searchRoster.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts: Record<StatusFilter, number> = {
    All:     formattedRoster.length,
    Online:  formattedRoster.filter(s => s.status === "online").length,
    Idle:    formattedRoster.filter(s => s.status === "idle").length,
    Request: formattedRoster.filter(s => s.status === "request").length,
    Urgent:  formattedRoster.filter(s => s.status === "urgent").length,
  };

  // Filter All System Students (Add Students List)
  const filteredSystem = allStudents.filter(s => {
    const name = displayName(s);
    return name.toLowerCase().includes(searchSystem.toLowerCase()) || 
           s.username.toLowerCase().includes(searchSystem.toLowerCase());
  });

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ══ SECTION 1: All System Students (LIST LAYOUT - Add Buttons) ══════════════════════════════ */}
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <CardTitle>All System Students</CardTitle>
            <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: -8 }}>
              {loadingAll ? "Loading..." : `${allStudents.length} registered students in the system`}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { fetchMyStudents(); fetchAllStudents(); }}>
            ↻ Refresh
          </Button>
        </div>

        <input
          placeholder="Search all students to add..."
          value={searchSystem}
          onChange={e => setSearchSystem(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "8px 12px", borderRadius: Radius.md,
            border: `1px solid ${C.gray2}`, background: C.gray,
            fontSize: FontSize.sm, color: C.text,
            marginBottom: 14, outline: "none", fontFamily: "inherit",
          }}
        />

        {!loadingAll && filteredSystem.length === 0 && (
          <div style={{ textAlign: "center", padding: "28px 0", color: C.text3, fontSize: FontSize.sm }}>
            No system students found.
          </div>
        )}

        {filteredSystem.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredSystem.map(s => {
              const av = avatarColor(s.id);
              const name = displayName(s);
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: Radius.md,
                  border: `1px solid ${C.gray2}`, background: C.gray,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={name} bg={av.bg} color={av.color} size={34} />
                    <div>
                      <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>
                        {name}
                      </div>
                      <div style={{ fontSize: FontSize.xs, color: C.text3 }}>
                        @{s.username}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {s.assigned ? (
                      <Button variant="outline" size="sm" style={{ color: C.teal, borderColor: C.tealLight }} disabled>
                        Assigned
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => addStudent(s.id)}>
                        + Add to Class
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>


      {/* ══ SECTION 2: Class Roster (GRID LAYOUT - Remove Buttons & Messages) ═════════════════════ */}
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <CardTitle>Class Roster</CardTitle>
            <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: -8 }}>
               {loadError ? "Could not reach server" : `${myStudents.length} student(s) currently in your class`}
            </div>
          </div>
        </div>

        {loadError && (
          <div style={{ background: C.redLight, border: `1px solid #F5C4C4`, borderRadius: Radius.md, padding: "10px 14px", color: C.red, fontSize: FontSize.sm, marginBottom: 12 }}>
            ⚠ {loadError}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(f => {
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: "4px 14px", borderRadius: Radius.full, cursor: "pointer",
                  border: `1px solid ${active ? C.teal : C.gray2}`,
                  background: active ? C.teal : "transparent",
                  color: active ? C.white : C.text2,
                  fontSize: FontSize.sm, fontWeight: active ? 600 : 400,
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
              >
                {f} {counts[f]}
              </button>
            );
          })}
        </div>

        <input
          placeholder="Search your roster by name or username..."
          value={searchRoster}
          onChange={e => setSearchRoster(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "8px 12px", borderRadius: Radius.md,
            border: `1px solid ${C.gray2}`, background: C.gray,
            fontSize: FontSize.sm, color: C.text,
            marginBottom: 14, outline: "none", fontFamily: "inherit",
          }}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}>
          {filteredRoster.map(s => {
            const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.idle;
            return (
              <div key={s.id} style={{
                background: C.gray, borderRadius: Radius.md,
                padding: 14, border: `1px solid ${C.gray2}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Avatar name={s.name} bg={s.bg} color={s.color} size={36} />
                  <div>
                    <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>
                      {s.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <StatusDot status={s.status as StudentStatus} />
                      <span style={{ fontSize: FontSize.xs, fontWeight: 600, color: badge.color }}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <div style={{ fontSize: FontSize.sm, color: C.text3 }}>@{s.username}</div>
                <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{s.lastMsg}</div>

                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <Button variant="outline" size="sm" style={{ flex: 1 }}>Edit</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={removing === s.id}
                    onClick={() => removeStudent(s.id)}
                    style={{ flex: 1, color: C.red, borderColor: "#F5C4C4" }}
                  >
                    {removing === s.id ? "..." : "Remove"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {!loadingReal && filteredRoster.length === 0 && (
          <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "24px 0" }}>
            {myStudents.length === 0 ? "Your class is empty. Add students from the list above." : `No students match "${searchRoster}"`}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Students;