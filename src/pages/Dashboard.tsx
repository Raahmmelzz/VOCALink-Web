import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Avatar, StatusDot, Badge, Button } from "../components/ui";
import type { NavPage, Student } from "../types";
import api from '../services/api';

interface DashboardProps {
  setActive: (page: NavPage) => void;
  setSelectedStudent: (student: Student) => void;
}

// ── Types (Must match Students.tsx) ──
type RealStudent = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
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

const StatCard: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div style={{
    background: C.white, border: `1px solid ${C.gray2}`,
    borderRadius: Radius.md, padding: "12px 16px", flex: 1,
  }}>
    <div style={{ fontSize: 28, fontWeight: 600, color, lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontSize: FontSize.sm, color: C.text3, marginTop: 2 }}>{label}</div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setActive, setSelectedStudent }) => {
  // ── State for real students ──
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch students on mount ──
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/teacher/students/');
        const data = response.data;
        const realData = Array.isArray(data) ? data : [];
        
        // Format the database students into the UI structure
        const formattedStudents: Student[] = realData.map(s => {
          const av = avatarColor(s.id);
          return {
            id: s.id.toString(), // Student type usually expects string ID
            name: displayName(s),
            username: s.username,
            status: "idle", // Default to idle until WebSocket support is added
            lastMsg: "No recent messages",
            time: "",
            bg: av.bg,
            color: av.color,
            unread: 0, 
          };
        });

        setMyStudents(formattedStudents);
      } catch (error) {
        console.error("Dashboard failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Calculate live stats based on fetched data
  const online   = myStudents.filter(s => s.status === "online").length;
  const requests = myStudents.filter(s => s.status === "request" || s.status === "urgent").length;
  const idle     = myStudents.filter(s => s.status === "idle").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stat row */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard value={myStudents.length} label="Total students" color={C.text}    />
        <StatCard value={online}            label="Online now"     color={C.teal}   />
        <StatCard value={requests}          label="Requests"       color={C.amber}  />
        <StatCard value={idle}              label="Idle"           color={C.gray3}  />
      </div>

      <div style={{ display: "flex", gap: 16 }}>

        {/* Student list */}
        <Card style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <CardTitle>Active students</CardTitle>
            <Button size="sm" onClick={() => setActive("broadcast")}>
              Start broadcast
            </Button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: C.text3, fontSize: FontSize.sm }}>
              Loading your students...
            </div>
          ) : myStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: C.text3, fontSize: FontSize.sm }}>
              You have no students assigned. Add them from the Students tab.
            </div>
          ) : (
            myStudents.map(s => (
              <div
                key={s.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: Radius.md, cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.gray}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                onClick={() => { setSelectedStudent(s); setActive("messages"); }}
              >
                <Avatar name={s.name} bg={s.bg} color={s.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>{s.name}</div>
                  <div style={{ fontSize: FontSize.sm, color: C.text3, marginTop: 1 }}>{s.lastMsg}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <StatusDot status={s.status} />
                    <span style={{ fontSize: FontSize.xs, color: s.status === "request" || s.status === "urgent" ? C.amber : C.text3 }}>
                      {s.status}
                    </span>
                  </div>
                  {s.unread > 0 && (
                    <Badge color="amber" style={{ fontSize: FontSize.xs }}>{s.unread} new</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </Card>

        {/* Right column */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Quick actions */}
          <Card>
            <CardTitle>Quick actions</CardTitle>
            {([
              { label: "Start STT Broadcast", page: "broadcast" as NavPage, dot: C.teal   },
              { label: "View all messages",   page: "messages"  as NavPage, dot: C.purple },
              { label: "Live CC log",         page: "livecc"    as NavPage, dot: C.blue   },
            ]).map((a, i) => (
              <Button
                key={i}
                onClick={() => setActive(a.page)}
                style={{ width: "100%", marginBottom: 6, justifyContent: "flex-start" }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.dot }} />
                {a.label}
              </Button>
            ))}
          </Card>

          {/* Session info */}
          <Card>
            <CardTitle>Session info</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: FontSize.sm, color: C.text3 }}>Class</span>
                  <span style={{ fontSize: FontSize.sm, fontWeight: 500, color: C.text }}>Active</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: FontSize.sm, color: C.text3 }}>Duration</span>
                  <span style={{ fontSize: FontSize.sm, fontWeight: 500, color: C.text }}>00:00</span>
                </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;