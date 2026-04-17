import React from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Avatar, StatusDot, Badge, Button } from "../components/ui";
import { STUDENTS, SESSION_INFO } from "../data/mockData";
import type { NavPage } from "../types";
import type { Student } from "../types";

interface DashboardProps {
  setActive: (page: NavPage) => void;
  setSelectedStudent: (student: Student) => void;
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
  const online   = STUDENTS.filter(s => s.status === "online").length;
  const requests = STUDENTS.filter(s => s.status === "request" || s.status === "urgent").length;
  const idle     = STUDENTS.filter(s => s.status === "idle").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stat row */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard value={STUDENTS.length} label="Total students" color={C.text}    />
        <StatCard value={online}           label="Online now"     color={C.teal}   />
        <StatCard value={requests}         label="Requests"       color={C.amber}  />
        <StatCard value={idle}             label="Idle"           color={C.gray3}  />
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

          {STUDENTS.map(s => (
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
          ))}
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
              {Object.entries(SESSION_INFO).map(([key, val]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: FontSize.sm, color: C.text3, textTransform: "capitalize" }}>{key}</span>
                  <span style={{ fontSize: FontSize.sm, fontWeight: 500, color: C.text }}>{val}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;