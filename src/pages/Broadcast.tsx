import React, { useState, useRef, useEffect } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import {} from "../components/ui";
import Icon from "../components/ui/Icon";
import api from "../services/api";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const isChromium = !!(window as any).chrome;

interface StudentActivity {
  id:           string;
  type:         "reply" | "icon";
  time:         string;
  student_name: string;
  text:         string;
}

const Broadcast: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [liveText,  setLiveText]  = useState("");
  const [error,     setError]     = useState("");
  const [sttSupported]            = useState(!!SpeechRecognition);

  const [sessionActive,   setSessionActive]   = useState(false);
  const [sessionCode,     setSessionCode]     = useState<string | null>(null);
  const [togglingSession, setTogglingSession] = useState(false);

  const [sentLines,       setSentLines]       = useState<string[]>([]);
  const [studentActivity, setStudentActivity] = useState<StudentActivity[]>([]);
  const [manualText,      setManualText]      = useState("");

  const lastReplyIdRef  = useRef(0);
  const lastIconIdRef   = useRef(0);
  const activityRef     = useRef<HTMLDivElement>(null);

  const recognitionRef       = useRef<any>(null);
  const isRecordingRef       = useRef(false);
  const currentTranscriptRef = useRef("");
  const sessionActiveRef     = useRef(sessionActive);
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
      lastReplyIdRef.current = 0;
      lastIconIdRef.current  = 0;
      return;
    }
    const pollReplies = () => {
      api.get(`/cc/messages/?since=${lastReplyIdRef.current}`)
        .then(res => {
          const msgs: any[] = (res.data as any[]).filter(m => m.speaker === "student");
          if (!msgs.length) return;
          const entries: StudentActivity[] = msgs.map(m => ({
            id: `reply-${m.id}`, type: "reply" as const,
            time: m.sent_at || "", student_name: "Student", text: m.text,
          }));
          setStudentActivity(prev =>
            [...prev, ...entries].sort((a, b) => a.time.localeCompare(b.time))
          );
          lastReplyIdRef.current = msgs[msgs.length - 1].id;
        }).catch(() => {});
    };
    const pollIcons = () => {
      api.get("/sessions/logs/")
        .then(res => {
          const newLogs: any[] = (res.data as any[]).filter(l => l.id > lastIconIdRef.current);
          if (!newLogs.length) return;
          const entries: StudentActivity[] = newLogs.map(l => ({
            id: `icon-${l.id}`, type: "icon" as const,
            time: l.tapped_at || "", student_name: l.student_name || "Student",
            text: l.message || l.icon_label,
          }));
          setStudentActivity(prev =>
            [...prev, ...entries].sort((a, b) => a.time.localeCompare(b.time))
          );
          lastIconIdRef.current = newLogs[newLogs.length - 1].id;
        }).catch(() => {});
    };
    pollReplies(); pollIcons();
    const iv = setInterval(() => { pollReplies(); pollIcons(); }, 2000);
    return () => clearInterval(iv);
  }, [sessionActive]);

  useEffect(() => {
    if (activityRef.current)
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
  }, [studentActivity.length]);

  useEffect(() => {
    return () => { isRecordingRef.current = false; recognitionRef.current?.stop(); };
  }, []);

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
        lastReplyIdRef.current = 0;
        lastIconIdRef.current  = 0;
        if (recording) stopRecording();
      }
    } catch {}
    setTogglingSession(false);
  };

  const startRecording = () => {
    if (!SpeechRecognition) { setError("Requires Google Chrome or Edge."); return; }
    if (!sessionActiveRef.current) { setError("Start a session first."); return; }
    isRecordingRef.current       = true;
    currentTranscriptRef.current = "";
    setRecording(true);
    setError("");

    const recognition = new SpeechRecognition();
    recognitionRef.current     = recognition;
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++)
        text += event.results[i][0].transcript;
      currentTranscriptRef.current = text;
      setLiveText(text);
    };

    recognition.onerror = (event: any) => {
      if (["no-speech", "network", "aborted"].includes(event.error)) return;
      setError(`Mic error: ${event.error}`);
      isRecordingRef.current = false;
      setRecording(false);
    };

    recognition.onend = () => {
      const text = currentTranscriptRef.current.trim();
      currentTranscriptRef.current = "";
      setLiveText("");
      if (text && isRecordingRef.current) {
        api.post("/broadcast/", { text, speaker: "teacher" })
          .then(() => setSentLines(prev => [...prev.slice(-29), text]))
          .catch(() => setError("Broadcast failed — is the session still active?"));
      }
      if (isRecordingRef.current) {
        setTimeout(() => { try { recognition.start(); } catch {} }, 150);
      } else {
        setRecording(false);
      }
    };

    try { recognition.start(); }
    catch {
      setError("Could not access microphone. Refresh and try again.");
      isRecordingRef.current = false;
      setRecording(false);
    }
  };

  const stopRecording = () => {
    isRecordingRef.current       = false;
    currentTranscriptRef.current = "";
    recognitionRef.current?.stop();
    setLiveText("");
    setRecording(false);
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

      {!isChromium && (
        <div style={{
          padding: "10px 16px", borderRadius: Radius.md,
          background: "#FEF3C7", border: "1px solid #FCD34D",
          fontSize: FontSize.sm, color: "#92400E", fontWeight: 500,
        }}>
          ⚠️ <strong>Voice requires Chrome or Edge.</strong>
        </div>
      )}

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

        {/* ── Left: narrow control strip ── */}
        <div style={{
          width: 220, flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 12,
        }}>

          {/* Mic button — compact */}
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
              disabled={!sttSupported || (!sessionActive && !recording)}
              title={recording ? "Mute" : "Unmute"}
              style={{
                width: 56, height: 56, borderRadius: "50%", border: "none",
                background: recording
                  ? "linear-gradient(135deg,#E24B4A,#c0392b)"
                  : sessionActive
                  ? `linear-gradient(135deg,${C.teal},${C.tealMid})`
                  : C.gray3,
                cursor: sttSupported && (sessionActive || recording) ? "pointer" : "not-allowed",
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
              {recording ? "🔴 Live" : sessionActive ? "Tap to go live" : "Start session first"}
            </div>

            {recording && liveText && (
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.65)",
                fontStyle: "italic", textAlign: "center", lineHeight: 1.4,
              }}>
                "{liveText}"
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

          {/* How it works */}
          {!sessionActive && !sentLines.length && (
            <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.7 }}>
              1. Start a session<br />
              2. Tap the mic to go live<br />
              3. Each sentence auto-broadcasts<br />
              4. Tap again to mute<br /><br />
              💡 Use <strong>Chrome</strong>.
            </div>
          )}
        </div>

        {/* ── Right: student responses — dominates the space ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: C.white, borderRadius: Radius.md,
            border: `1px solid ${C.gray2}`, overflow: "hidden",
            minHeight: 520,
          }}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: `1px solid ${C.gray2}`,
            }}>
              <div>
                <div style={{ fontSize: FontSize.lg, fontWeight: 800, color: C.text }}>
                  Student Responses
                </div>
                <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>
                  Typed replies and icon taps appear here in real time
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

            {/* Body */}
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
                  Students will send replies via icons and text once a session is active.
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
                  Responses appear here instantly when students tap icons or send messages.
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
                    background: item.type === "reply" ? C.purpleLight : C.white,
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                      background: item.type === "reply" ? C.purple : C.tealLight,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {item.type === "reply" ? "💬" : "🗣"}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5,
                      }}>
                        <span style={{
                          fontSize: FontSize.base, fontWeight: 700,
                          color: item.type === "reply" ? C.purple : C.teal,
                        }}>
                          {item.student_name}
                        </span>
                        <span style={{ fontSize: FontSize.xs, color: C.text3 }}>
                          {item.time.slice(11, 16)}
                        </span>
                        <span style={{
                          marginLeft: "auto",
                          fontSize: 11, fontWeight: 700, padding: "2px 8px",
                          borderRadius: 999,
                          background: item.type === "reply" ? C.purpleLight : C.tealLight,
                          color: item.type === "reply" ? C.purple : C.teal,
                          border: `1px solid ${item.type === "reply" ? C.purpleMid : C.tealBorder}`,
                        }}>
                          {item.type === "reply" ? "Reply" : "AAC"}
                        </span>
                      </div>
                      <div style={{
                        fontSize: FontSize.lg,
                        fontWeight: 500,
                        color: C.text,
                        lineHeight: 1.45,
                        wordBreak: "break-word",
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
