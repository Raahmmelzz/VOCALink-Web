import React from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Avatar, StatusDot, Divider } from "../components/ui";
import { STUDENTS } from "../data/mockData";

const Students: React.FC = () => (
  <Card>
    <CardTitle>All students — SNED-A</CardTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
      {STUDENTS.map(s => (
        <div key={s.id} style={{
          background: C.gray, borderRadius: Radius.md,
          padding: 14, border: `1px solid ${C.gray2}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar name={s.name} bg={s.bg} color={s.color} size={36} />
            <div>
              <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>{s.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <StatusDot status={s.status} />
                <span style={{ fontSize: FontSize.xs, color: C.text3 }}>{s.status}</span>
              </div>
            </div>
          </div>
          <Divider style={{ margin: "8px 0" }} />
          <div style={{ fontSize: FontSize.sm, color: C.text3 }}>Last message</div>
          <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{s.lastMsg}</div>
          <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>{s.time}</div>
        </div>
      ))}
    </div>
  </Card>
);

export default Students;