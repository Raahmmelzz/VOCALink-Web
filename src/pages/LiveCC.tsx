import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Badge, Button } from "../components/ui";
import api from "../services/api";

interface LogLine {
  id: number;
  time: string;
  speaker: string;
  text: string;
  isCC: boolean;
}

const LiveCC: React.FC = () => {
  const [lines, setLines]     = useState<LogLine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      // Fetch teacher broadcasts + student icon taps in parallel
      const [broadcastRes, studentRes] = await Promise.all([
        api.get("/cc/messages/"),
        api.get("/teacher/logs/"),
      ]);

      const broadcasts: LogLine[] = (broadcastRes.data || []).map((m: any) => ({
        id:       m.id * 10000,
        time:     m.time,
        speaker:  "Teacher (CC)",
        text:     m.text,
        isCC:     true,
      }));

      const studentLogs: LogLine[] = (studentRes.data || []).map((l: any) => ({
        id:       l.id,
        time:     l.tapped_at?.slice(11, 16) || "",
        speaker:  `Student #${l.user_id}`,
        text:     l.message || l.icon_label,
        isCC:     false,
      }));

      // Merge and sort by id
      const merged = [...broadcasts, ...studentLogs]
        .sort((a, b) => a.id - b.id);

      setLines(merged);
    } catch (e) {
      console.error("LiveCC fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Refresh every 4 seconds
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <CardTitle>Live CC Session Log</CardTitle>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge color="teal">Live</Badge>
          <Button size="sm" variant="outline" onClick={fetchLogs}>↻ Refresh</Button>
        </div>
      </div>

      <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 16, lineHeight: 1.6 }}>
        Full transcript of all STT broadcasts and student icon taps for this session.
      </p>

      {loading && (
        <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "24px 0" }}>
          Loading session log...
        </div>
      )}

      {!loading && lines.length === 0 && (
        <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "24px 0" }}>
          No activity yet. Start broadcasting or wait for students to tap icons.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.map((line) => (
          <div
            key={line.id}
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
};

export default LiveCC;
