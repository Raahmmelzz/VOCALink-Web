import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius, Shadow } from "../styles/tokens";
import { Badge, Button } from "../components/ui";
import api from "../services/api";

interface LogLine {
  id: number;
  time: string;
  speaker: string;
  text: string;
  isCC: boolean;
}

const LiveCC: React.FC = () => {
  const [lines, setLines]           = useState<LogLine[]>([]);
  const [loading, setLoading]       = useState(true);
  const [sessionActive, setSession] = useState(false);

  const fetchLogs = async () => {
    try {
      // Check session + fetch broadcasts in parallel
      const [sessionRes, broadcastRes] = await Promise.all([
        api.get("/sessions/teacher").catch(() => ({ data: { active: false } })),
        api.get("/cc/messages/").catch(() => ({ data: [] })),
      ]);

      const isActive = sessionRes.data.active;
      setSession(isActive);

      const broadcasts: LogLine[] = (broadcastRes.data || []).map((m: any, i: number) => ({
        id:      i * 100000,
        time:    m.time || m.sent_at?.slice(11, 16) || "",
        speaker: "👩‍🏫 Teacher",
        text:    m.text,
        isCC:    true,
      }));

      let sessionLogs: LogLine[] = [];
      if (isActive) {
        const logsRes = await api.get("/sessions/logs/").catch(() => ({ data: [] }));
        sessionLogs = (logsRes.data || []).map((l: any) => ({
          id:      l.id,
          time:    l.tapped_at?.slice(11, 16) || "",
          speaker: `🎓 ${l.student_name || "Student"}`,
          text:    l.icon_label,
          isCC:    false,
        }));
      }

      const merged = [...broadcasts, ...sessionLogs].sort((a, b) => a.id - b.id);
      setLines(merged);
    } catch (e) {
      console.error("LiveCC fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header card */}
      <div style={{
        borderRadius: 14, padding: "20px 24px",
        background: "linear-gradient(135deg, #0F172A, #1E293B, #0E8DB8)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: Shadow.lg,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
            Live CC Session Log
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
            {sessionActive
              ? "✅ Session active — student icon taps appear here in real time"
              : "⚠ No active session — start one from STT Broadcast"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: sessionActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${sessionActive ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 999, padding: "5px 12px",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: sessionActive ? "#22C55E" : C.gray3 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: sessionActive ? "#22C55E" : "rgba(255,255,255,0.5)" }}>
              {sessionActive ? "Live" : "Idle"}
            </span>
          </div>
          <button
            onClick={fetchLogs}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600,
              padding: "6px 12px", cursor: "pointer",
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Log feed */}
      <div style={{
        background: C.white, borderRadius: 14,
        border: `1px solid ${C.gray2}`, boxShadow: Shadow.sm,
        minHeight: 400, overflow: "hidden",
      }}>
        {loading && (
          <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "32px 0" }}>
            Loading session log...
          </div>
        )}

        {!loading && lines.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: FontSize.base, fontWeight: 600, color: C.text2 }}>
              {sessionActive ? "Waiting for activity..." : "No active session"}
            </div>
            <div style={{ fontSize: FontSize.sm, color: C.text3, marginTop: 4 }}>
              {sessionActive
                ? "Student icon taps and teacher broadcasts will appear here"
                : "Go to STT Broadcast and click ▶ Start Session"}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {lines.map((line, i) => (
            <div
              key={line.id}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "14px 20px",
                borderBottom: i < lines.length - 1 ? `1px solid ${C.gray}` : "none",
                background: line.isCC ? "rgba(26,173,220,0.04)" : "transparent",
              }}
            >
              {/* Time */}
              <div style={{
                fontSize: FontSize.xs, color: C.text3,
                whiteSpace: "nowrap", paddingTop: 2, minWidth: 42,
              }}>
                {line.time}
              </div>

              {/* Icon type indicator */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: line.isCC ? C.tealLight : C.purpleLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>
                {line.isCC ? "🎙" : "👆"}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: FontSize.xs, fontWeight: 700,
                  color: line.isCC ? C.teal : C.purple,
                  marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {line.speaker}
                </div>
                <div style={{ fontSize: FontSize.base, color: C.text, lineHeight: 1.5 }}>
                  {line.text}
                </div>
              </div>

              {/* Badge */}
              <Badge color={line.isCC ? "teal" : "purple"}>
                {line.isCC ? "CC" : "AAC"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCC;
