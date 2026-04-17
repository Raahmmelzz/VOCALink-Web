import React, { useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Button, ProgressBar, Divider, StatusDot } from "../components/ui";
import Icon from "../components/ui/Icon";
import { STUDENTS, TRANSCRIPT_LINES } from "../data/mockData";

const Broadcast: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [lines, setLines]         = useState<string[]>([TRANSCRIPT_LINES[0]]);
  const [sent, setSent]           = useState(false);

  const handleToggle = () => {
    if (!recording) {
      setRecording(true);
      setSent(false);
      setTimeout(() => setLines([TRANSCRIPT_LINES[0], TRANSCRIPT_LINES[1]]), 1500);
      setTimeout(() => setLines([...TRANSCRIPT_LINES]), 3000);
    } else {
      setRecording(false);
      setSent(true);
    }
  };

  const activeStudents = STUDENTS.filter(s => s.status !== "idle");
  const idleCount      = STUDENTS.filter(s => s.status === "idle").length;

  return (
    <div style={{ display: "flex", gap: 16 }}>

      {/* Main panel */}
      <Card style={{ flex: 1 }}>
        <CardTitle>Speech-to-Text Broadcast</CardTitle>
        <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 20, lineHeight: 1.6 }}>
          Speak naturally. Your voice is transcribed in real time and broadcast
          as Live Closed Captions to all connected student devices.
        </p>

        {/* Mic button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
          <button
            onClick={handleToggle}
            style={{
              width: 72, height: 72, borderRadius: "50%", border: "none",
              background: recording ? C.redDark : C.teal, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: recording
                ? `0 0 0 10px rgba(226,75,74,0.12)`
                : `0 0 0 8px ${C.tealLight}`,
              transition: "all 0.2s",
            }}
          >
            {recording
              ? <Icon name="stop" size={24} color={C.white} />
              : <Icon name="mic"  size={24} color={C.white} />
            }
          </button>

          <div style={{ fontSize: FontSize.base, fontWeight: 500, color: recording ? C.redDark : C.text2 }}>
            {recording ? "Recording — tap to stop & broadcast" : "Tap to start recording"}
          </div>

          {recording && (
            <div style={{ width: "60%" }}>
              <ProgressBar value={65} color={C.tealMid} />
            </div>
          )}
        </div>

        {/* Transcript */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: C.text3, marginBottom: 8 }}>
            Live transcript
          </div>
          <div style={{
            background: C.gray, borderRadius: Radius.md,
            padding: "10px 14px", minHeight: 72,
            fontSize: 13, lineHeight: 1.7, color: C.text2,
          }}>
            {lines.map((line, i) => (
              <div key={i} style={{ color: i === lines.length - 1 ? C.text : C.text2 }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Success banner */}
        {sent && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 14, padding: "10px 14px",
            background: C.tealLight, borderRadius: Radius.md,
          }}>
            <Icon name="check" size={14} color={C.teal} />
            <span style={{ fontSize: FontSize.sm, color: C.teal, fontWeight: 500 }}>
              Broadcast sent to all {STUDENTS.length} students
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Button variant="primary" onClick={handleToggle} style={{ flex: 1 }}>
            {recording ? "Stop & broadcast" : "Start recording"}
          </Button>
          {!recording && (
            <Button onClick={() => {}} style={{ flex: 1 }}>
              Review transcript
            </Button>
          )}
        </div>
      </Card>

      {/* Broadcasting to */}
      <div style={{ width: 230 }}>
        <Card>
          <CardTitle>Broadcasting to</CardTitle>
          {activeStudents.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
              <StatusDot status={s.status} />
              <span style={{ fontSize: 12, color: C.text }}>{s.name}</span>
            </div>
          ))}
          {idleCount > 0 && (
            <>
              <Divider />
              <div style={{ fontSize: FontSize.sm, color: C.text3 }}>
                {idleCount} student(s) idle — CC will still be delivered
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Broadcast;