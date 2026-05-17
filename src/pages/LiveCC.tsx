import React, { useEffect, useRef, useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Badge, Button } from "../components/ui";
import api from "../services/api";

interface SessionMeta {
  id: number;
  session_code: string;
  started_at: string;
  is_active: boolean;
}

interface LogEntry {
  id: string;
  type: "cc" | "aac" | "reply";
  sort_key: string;
  time: string;
  speaker: string;
  text: string;
  icon_id?: string;
}

interface SessionLog {
  session_id: number;
  session_code: string;
  started_at: string;
  is_active: boolean;
  entries: LogEntry[];
}

const LiveCC: React.FC = () => {
  const [sessions,     setSessions]     = useState<SessionMeta[]>([]);
  const [selectedId,   setSelectedId]   = useState<number | null>(null);
  const [sessionLog,   setSessionLog]   = useState<SessionLog | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [sessLoading,  setSessLoading]  = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // ── Fetch session list once (and when it might change) ─────────────────────
  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions/all/");
      const list: SessionMeta[] = res.data || [];
      setSessions(list);
      // Auto-select: prefer the currently active session, else the most recent
      if (list.length > 0 && selectedId === null) {
        const active = list.find(s => s.is_active);
        setSelectedId((active ?? list[0]).id);
      }
    } catch {}
  };

  // ── Fetch log for the selected session ─────────────────────────────────────
  const fetchLog = async (id: number) => {
    try {
      const res = await api.get(`/sessions/${id}/log/`);
      setSessionLog(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  // Poll every 3 s when a session is selected
  useEffect(() => {
    if (selectedId === null) return;
    setLoading(true);
    setSessLoading(true);
    fetchLog(selectedId).finally(() => setSessLoading(false));
    const iv = setInterval(() => fetchLog(selectedId), 3000);
    return () => clearInterval(iv);
  }, [selectedId]);

  // Auto-scroll to bottom when new entries arrive
  const prevCount = useRef(0);
  useEffect(() => {
    const count = sessionLog?.entries?.length ?? 0;
    if (count > prevCount.current && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
    prevCount.current = count;
  }, [sessionLog?.entries?.length]);

  const activeSession = sessions.find(s => s.is_active);

  return (
    <Card>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <CardTitle>CC Session Log</CardTitle>
          <p style={{ fontSize: FontSize.sm, color: C.text3, margin: "4px 0 0", lineHeight: 1.5 }}>
            Full transcript — teacher broadcasts &amp; student icon taps per session.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {sessionLog?.is_active && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)" }} />
              <span style={{ fontSize: FontSize.xs, color: "#15803D", fontWeight: 600 }}>Live</span>
            </div>
          )}
          <Button size="sm" variant="outline" onClick={() => selectedId && fetchLog(selectedId)}>↻ Refresh</Button>
        </div>
      </div>

      {/* ── Session selector ── */}
      {sessions.length === 0 ? (
        <div style={{ padding: "10px 14px", borderRadius: Radius.md, background: C.gray, fontSize: FontSize.sm, color: C.text3, marginBottom: 16 }}>
          No sessions yet. Start a class from the Broadcast page.
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: FontSize.xs, fontWeight: 600, color: C.text3, display: "block", marginBottom: 6 }}>
            Select Session
          </label>
          <select
            value={selectedId ?? ""}
            onChange={e => { setSelectedId(Number(e.target.value)); setSessionLog(null); setLoading(true); }}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: Radius.md,
              border: `1px solid ${C.gray2}`, background: C.white,
              fontSize: FontSize.sm, color: C.text, cursor: "pointer",
              outline: "none", fontFamily: "inherit",
            }}
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.session_code}
                {s.is_active ? " ● Live" : ""}
                {"  —  "}
                {s.started_at ? s.started_at.slice(0, 10) + " " + s.started_at.slice(11, 16) : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Session meta bar ── */}
      {sessionLog && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          padding: "8px 12px", borderRadius: Radius.md,
          background: sessionLog.is_active ? "rgba(34,197,94,0.06)" : C.gray,
          border: `1px solid ${sessionLog.is_active ? "rgba(34,197,94,0.25)" : C.gray2}`,
          marginBottom: 14, fontSize: FontSize.sm,
        }}>
          <Badge color={sessionLog.is_active ? "teal" : "gray"}>
            {sessionLog.is_active ? "● Live" : "Ended"}
          </Badge>
          <span style={{ fontWeight: 700, color: C.text }}>
            Code: <span style={{ color: sessionLog.is_active ? "#15803D" : C.text2, fontFamily: "monospace", fontSize: 15 }}>{sessionLog.session_code}</span>
          </span>
          <span style={{ color: C.text3 }}>
            Started: {sessionLog.started_at?.slice(0, 16).replace("T", " ")}
          </span>
          <span style={{ color: C.text3, marginLeft: "auto" }}>
            {sessionLog.entries.length} {sessionLog.entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      )}

      {/* ── Log entries ── */}
      {loading && (
        <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "32px 0" }}>
          Loading session log…
        </div>
      )}

      {!loading && sessionLog && sessionLog.entries.length === 0 && (
        <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "32px 0" }}>
          No activity yet in this session. Start broadcasting or wait for students to tap icons.
        </div>
      )}

      {!loading && sessionLog && sessionLog.entries.length > 0 && (
        <div
          ref={logRef}
          style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 460, overflowY: "auto", paddingRight: 4 }}
        >
          {sessionLog.entries.map(entry => {
            const bgColor =
              entry.type === "cc"    ? C.tealLight   :
              entry.type === "reply" ? C.purpleLight  : C.gray;
            const borderColor =
              entry.type === "cc"    ? C.tealBorder :
              entry.type === "reply" ? C.gray2       : C.gray2;
            const speakerColor =
              entry.type === "cc"    ? C.teal   :
              entry.type === "reply" ? C.purple  : C.text2;
            const textColor =
              entry.type === "cc" ? "#085041" : C.text;

            return (
              <div
                key={entry.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "10px 12px", borderRadius: Radius.md,
                  background: bgColor, border: `1px solid ${borderColor}`,
                }}
              >
                {/* Timestamp */}
                <div style={{
                  fontSize: 11, color: C.text3, whiteSpace: "nowrap",
                  paddingTop: 2, minWidth: 42, fontVariantNumeric: "tabular-nums",
                }}>
                  {entry.time}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: FontSize.sm, fontWeight: 600,
                    color: speakerColor, marginBottom: 3,
                  }}>
                    {entry.type === "aac"   && <span style={{ marginRight: 4 }}>🗣</span>}
                    {entry.type === "reply" && <span style={{ marginRight: 4 }}>💬</span>}
                    {entry.speaker}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: textColor }}>
                    {entry.text}
                  </div>
                </div>

                {/* Badge */}
                {entry.type === "cc"    && <Badge color="teal">CC</Badge>}
                {entry.type === "aac"   && <Badge color="purple">AAC</Badge>}
                {entry.type === "reply" && <Badge color="purple">Reply</Badge>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty state when no session selected ── */}
      {!loading && !sessionLog && sessions.length > 0 && (
        <div style={{ textAlign: "center", color: C.text3, fontSize: FontSize.sm, padding: "32px 0" }}>
          Select a session above to view its log.
        </div>
      )}
    </Card>
  );
};

export default LiveCC;
