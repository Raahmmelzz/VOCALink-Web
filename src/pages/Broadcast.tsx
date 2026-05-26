import React, { useState, useRef, useEffect } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import Icon from "../components/ui/Icon";
import api from "../services/api";

const SpeechRecognition: any =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface StudentActivity {
  id:           string;
  type:         "icon";
  time:         string;
  student_name: string;
  text:         string;
}


const Broadcast: React.FC = () => {
  const [recording,  setRecording]  = useState(false);
  const [lastText,   setLastText]   = useState("");
  const [error,        setError]        = useState("");

  const [sessionActive,   setSessionActive]   = useState(false);
  const [sessionCode,     setSessionCode]     = useState<string | null>(null);
  const [togglingSession, setTogglingSession] = useState(false);

  const [sentLines,       setSentLines]       = useState<string[]>([]);
  const [studentActivity, setStudentActivity] = useState<StudentActivity[]>([]);
  const [manualText,      setManualText]      = useState("");

  const lastIconIdRef    = useRef(0);
  const activityRef      = useRef<HTMLDivElement>(null);
  const isRecordingRef   = useRef(false);
  const recognitionRef   = useRef<any>(null);
  const sessionActiveRef = useRef(sessionActive);
  useEffect(() => { sessionActiveRef.current = sessionActive; }, [sessionActive]);

  useEffect(() => {
    api.get("/sessions/teacher").then(res => {
      setSessionActive(res.data.active);
      setSessionCode(res.data.session_code || null);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionActive) {
      setStudentActivity([]);
      lastIconIdRef.current = 0;
      return;
    }
    const poll = () => {
      api.get(`/sessions/logs/?since=${lastIconIdRef.current}`)
        .then(res => {
          const logs: any[] = res.data;
          if (!logs.length) return;
          const entries: StudentActivity[] = logs.map(l => ({
            id:           `icon-${l.id}`,
            type:         "icon" as const,
            time:         l.tapped_at || "",
            student_name: l.student_name || "Student",
            text:         l.message || l.icon_label,
          }));
          setStudentActivity(prev =>
            [...prev, ...entries].sort((a, b) => a.time.localeCompare(b.time))
          );
          lastIconIdRef.current = logs[logs.length - 1].id;
        }).catch(() => {});
    };
    poll();
    const iv = setInterval(poll, 2000);
    return () => clearInterval(iv);
  }, [sessionActive]);

  useEffect(() => {
    if (activityRef.current)
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
  }, [studentActivity.length]);

  useEffect(() => () => stopRecording(), []);

  // ── Google Web Speech API (webkitSpeechRecognition) ──────────────────────
  const startRecording = () => {
    if (!sessionActiveRef.current) { setError("Start a session first."); return; }
    if (!SpeechRecognition) { setError("Speech recognition requires Chrome or Edge."); return; }
    setError("");
    setLastText("");

    const recog = new SpeechRecognition();
    recog.continuous      = true;
    recog.interimResults  = true;
    recog.lang            = "en-US";

    recog.onresult = async (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          const text = t.trim();
          if (!text || !sessionActiveRef.current) continue;
          try {
            await api.post("/broadcast/", { text, speaker: "teacher" });
            setLastText(text);
            setSentLines(prev => [...prev.slice(-29), text]);
            setError("");
          } catch (err: any) {
            setError(err?.response?.data?.detail || "Broadcast failed.");
          }
        } else {
          interim += t;
        }
      }
      if (interim) setLastText(interim);
    };

    recog.onerror = (e: any) => {
      if (e.error !== "no-speech" && e.error !== "aborted")
        setError(`Speech error: ${e.error}`);
    };

    recog.onend = () => {
      if (isRecordingRef.current) recog.start();
    };

    recognitionRef.current   = recog;
    isRecordingRef.current   = true;
    setRecording(true);
    recog.start();
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
    setLastText("");
  };

  const toggleSession = async () => {
    setTogglingSession(true);
    try {
      const res = await api.post("/sessions/toggle");
      const nowActive = res.data.active as boolean;
      setSessionActive(nowActive);
      setSessionCode(res.data.session_code || null);
      if (!nowActive) {
        setSentLines([]);
        setStudentActivity([]);
        lastIconIdRef.current = 0;
        if (recording) stopRecording();
      }
    } catch {}
    setTogglingSession(false);
  };

  const handleManualSend = async () => {
    const text = manualText.trim();
    if (!text) return;
    setManualText("");
    try {
      await api.post("/broadcast/", { text, speaker: "teacher" });
      setSentLines(prev => [...prev.slice(-29), text]);
    } catch {
      setError("Broadcast failed — is the session still active?");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Session bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px", borderRadius: Radius.md,
        background: sessionActive ? "rgba(34,197,94,0.08)" : C.gray,
        border: `1px solid ${sessionActive ? "rgba(34,197,94,0.3)" : C.gray2}`,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: sessionActive ? "#22C55E" : C.gray3,
          boxShadow: sessionActive ? "0 0 0 3px rgba(34,197,94,0.2)" : "none",
        }} />
        <span style={{ flex: 1, fontSize: FontSize.sm, fontWeight: 600, color: sessionActive ? "#15803D" : C.text2 }}>
          {sessionActive
            ? <>Active &nbsp;·&nbsp; <span style={{ fontFamily: "monospace", letterSpacing: 2 }}>{sessionCode}</span></>
            : "No active session"}
        </span>
        <button
          onClick={toggleSession}
          disabled={togglingSession}
          style={{
            padding: "6px 14px", borderRadius: Radius.sm, border: "none",
            cursor: togglingSession ? "not-allowed" : "pointer",
            fontWeight: 600, fontSize: FontSize.xs,
            background: sessionActive ? "#DC2626" : C.teal,
            color: "#fff", opacity: togglingSession ? 0.6 : 1,
          }}
        >
          {togglingSession ? "…" : sessionActive ? "⏹ End Session" : "▶ Start Session"}
        </button>
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

        {/* ── Left: control strip ── */}
        <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Mic button */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            padding: "20px 12px",
            background: recording ? "#1a1a2e" : C.white,
            borderRadius: Radius.md,
            border: `1px solid ${recording ? "#4a4a7a" : C.gray2}`,
            transition: "all 0.2s",
          }}>
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={!sessionActive && !recording}
              title={recording ? "Stop" : "Go live"}
              style={{
                width: 56, height: 56, borderRadius: "50%", border: "none",
                background: recording
                  ? "linear-gradient(135deg,#E24B4A,#c0392b)"
                  : sessionActive
                  ? `linear-gradient(135deg,${C.teal},${C.tealMid})`
                  : C.gray3,
                cursor: sessionActive || recording ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: recording
                  ? "0 0 0 8px rgba(226,75,74,0.18),0 0 0 16px rgba(226,75,74,0.07)"
                  : sessionActive ? `0 0 0 6px ${C.tealLight}` : "none",
                transition: "all 0.2s",
              }}
            >
              <Icon name={recording ? "mic-off" : "mic"} size={24} color="#fff" />
            </button>

            <div style={{
              fontSize: FontSize.xs, fontWeight: 700, textAlign: "center",
              color: recording ? "#fff" : sessionActive ? C.text2 : C.text3,
            }}>
              {recording
                ? "🔴 Recording"
                : sessionActive ? "Tap to go live" : "Start session first"}
            </div>

            {recording && lastText && (
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.65)",
                fontStyle: "italic", textAlign: "center", lineHeight: 1.4,
              }}>
                "{lastText}"
              </div>
            )}

            {recording && (
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                Live via Google Speech Recognition
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "8px 12px", background: "#FEF2F2",
              borderRadius: Radius.sm, fontSize: 11, color: C.red,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Type to send */}
          {sessionActive && (
            <div style={{
              background: C.white, borderRadius: Radius.md,
              border: `1px solid ${C.gray2}`, overflow: "hidden",
            }}>
              <input
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleManualSend()}
                placeholder="Type + Enter to send…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: "none", outline: "none", padding: "9px 12px",
                  fontSize: FontSize.xs, color: C.text,
                  background: "transparent", fontFamily: "inherit",
                }}
              />
              {manualText.trim() && (
                <div style={{ borderTop: `1px solid ${C.gray2}` }}>
                  <button
                    onClick={handleManualSend}
                    style={{
                      width: "100%", border: "none", padding: "7px",
                      background: C.teal, color: "#fff",
                      fontSize: FontSize.xs, fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Recent broadcasts */}
          {sentLines.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, marginBottom: 6 }}>
                ✅ Sent this session
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 220, overflowY: "auto" }}>
                {[...sentLines].reverse().map((line, i) => (
                  <div key={i} style={{
                    padding: "5px 9px", borderRadius: Radius.sm,
                    background: C.tealLight, border: `1px solid ${C.tealBorder}`,
                    fontSize: 11, color: "#085041", lineHeight: 1.5,
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!sessionActive && !sentLines.length && (
            <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.7 }}>
              1. Start a session<br />
              2. Tap the mic to go live<br />
              3. Speech is recognised and broadcast live<br />
              4. Tap again to stop<br /><br />
              💡 Requires Chrome or Edge.
            </div>
          )}
        </div>

        {/* ── Right: student responses ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: C.white, borderRadius: Radius.md,
            border: `1px solid ${C.gray2}`, overflow: "hidden",
            minHeight: 520,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: `1px solid ${C.gray2}`,
            }}>
              <div>
                <div style={{ fontSize: FontSize.lg, fontWeight: 800, color: C.text }}>
                  Student Responses
                </div>
                <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>
                  AAC icon taps appear here in real time
                </div>
              </div>
              {sessionActive && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
                  }} />
                  <span style={{ fontSize: FontSize.sm, color: "#15803D", fontWeight: 700 }}>Live</span>
                </div>
              )}
            </div>

            {!sessionActive ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 12, padding: "80px 20px",
                color: C.text3, textAlign: "center",
              }}>
                <div style={{ fontSize: 48 }}>🎓</div>
                <div style={{ fontSize: FontSize.base, fontWeight: 600, color: C.text2 }}>
                  Start a session to see responses
                </div>
                <div style={{ fontSize: FontSize.sm }}>
                  Students send responses via AAC icons once a session is active.
                </div>
              </div>
            ) : studentActivity.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 10, padding: "80px 20px",
                color: C.text3, textAlign: "center",
              }}>
                <div style={{ fontSize: 40 }}>👂</div>
                <div style={{ fontSize: FontSize.base, fontWeight: 600, color: C.text2 }}>
                  Waiting for students…
                </div>
                <div style={{ fontSize: FontSize.sm }}>
                  Responses appear here instantly when students tap icons.
                </div>
              </div>
            ) : (
              <div
                ref={activityRef}
                style={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: 580 }}
              >
                {studentActivity.map((item, idx) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "16px 20px",
                    borderBottom: idx < studentActivity.length - 1 ? `1px solid ${C.gray2}` : "none",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: C.tealLight,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      🗣
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: FontSize.base, fontWeight: 700, color: C.teal }}>
                          {item.student_name}
                        </span>
                        <span style={{ fontSize: FontSize.xs, color: C.text3 }}>
                          {item.time.slice(11, 16)}
                        </span>
                        <span style={{
                          marginLeft: "auto", fontSize: 11, fontWeight: 700,
                          padding: "2px 8px", borderRadius: 999,
                          background: C.tealLight, color: C.teal,
                          border: `1px solid ${C.tealBorder}`,
                        }}>
                          AAC
                        </span>
                      </div>
                      <div style={{
                        fontSize: FontSize.lg, fontWeight: 500,
                        color: C.text, lineHeight: 1.45, wordBreak: "break-word",
                      }}>
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
