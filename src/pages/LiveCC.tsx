import React from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Badge } from "../components/ui";
import { CC_LOG } from "../data/mockData";

const LiveCC: React.FC = () => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <CardTitle>Live CC Session Log</CardTitle>
      <Badge color="teal">Session active</Badge>
    </div>

    <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 16, lineHeight: 1.6 }}>
      Full transcript of all STT broadcasts and student messages for this classroom session.
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {CC_LOG.map((line, i) => (
        <div
          key={i}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "10px 12px", borderRadius: Radius.md,
            background: line.isCC ? C.tealLight : C.gray,
          }}
        >
          <div style={{ fontSize: FontSize.sm, color: C.text3, whiteSpace: "nowrap", paddingTop: 1, minWidth: 38 }}>
            {line.time}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: line.isCC ? C.teal : C.text3, marginBottom: 2 }}>
              {line.speaker}
            </div>
            <div style={{ fontSize: 13, color: line.isCC ? "#085041" : C.text2, lineHeight: 1.5 }}>
              {line.text}
            </div>
          </div>
          {line.isCC && <Badge color="teal">CC</Badge>}
        </div>
      ))}
    </div>
  </Card>
);

export default LiveCC;