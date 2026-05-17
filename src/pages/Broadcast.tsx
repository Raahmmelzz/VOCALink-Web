import React, { useState, useRef, useEffect } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Button, ProgressBar, Divider } from "../components/ui";
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
  const [recording, setRecording]     = useState(false);
  const [transcript, setTranscript]   = useState("");
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState("");
  const [sttSupported]                = useState(!!SpeechRecognition);

  // ── Session state ──────────────────────────────────────────────────────────
  const [sessionActive, setSessionActive]     = useState(false);
  const [sessionCode,   setSessionCode]       = useState<string | null>(null);
  const [togglingSession, setTogglingSession] = useState(false);

  // ── Live feed state ────────────────────────────────────────────────────────
  const [sentLines,       setSentLines]       = useState<string[]>([]);
  const [studentActivity, setStudentActivity] = useState<StudentActivity[]>([]);
  const lastReplyIdRef  = useRef(0);
  const lastIconIdRef   = useRef(0);
  const activityRef     = useRef<HTMLDivElement>(null);

  // ── Refs that bridge state into speech callbacks ───────────────────────────
  const recognitionRef        = useRef<any>(null);
  const isRecordingRef        = useRef(false);
  const currentTranscriptRef  = useRef("");   // interim text being spoken right now
  const sessionActiveRef      = useRef(sessionActive);
  useEffect(() => { sessionActiveRef.current = sessionActive; }, [sessionActive]);

  // ── On mount: restore session state ──────────────────────────────────────
  useEffect(() => {
    api.get("/sessions/teacher").then(res => {
      setSessionActive(res.data.active);
      setSessionCode(res.data.session_code || null);
    }).catch(() => {});
  }, []);

  // ── Poll student replies + icon taps every 2 s ────────────────────────────
  useEffect(() => {
    if (!sessionActive) {
      setStudentActivity([]);
      lastReplyIdRef.current = 0;
      lastIconIdRef.current  = 0;
      return;
    }

    const pollReplies = () => {
      api.get(`/messages/my-students?since=${lastReplyIdRef.current}`)
        .then(res => {
          const msgs: any[] = res.data;
          if (!msgs.length) return;
          const entries: StudentActivity[] = msgs.map(m => ({
            id:           `reply-${m.id}`,
            type:         "reply" as const,
            time:         m.sent_at || "",
            student_name: m.student_name || "Student",
            text:         m.text,
          }));
          setStudentActivity(prev =>
            [...prev, ...entries].sort((a, b) => a.time.localeCompare(b.time))
          );
          lastReplyIdRef.current = msgs[msgs.length - 1].id;
        })
        .catch(() => {});
    };

    const pollIcons = () => {
      api.get("/sessions/logs/")
        .then(res => {
          const logs: any[] = res.data;
          const newLogs = logs.filter(l => l.id > lastIconIdRef.current);
          if (!newLogs.length) return;
          const entries: StudentActivity[] = newLogs.map(l => ({
            id:           `icon-${l.id}`,
            type:         "icon" as const,
            time:         l.tapped_at || "",
            student_name: l.student_name || "Student",
            text:         l.message || l.icon_label,
          }));
          setStudentActivity(prev =>
            [...prev, ...entries].sort((a, b) => a.time.localeCompare(b.time))
          );
          lastIconIdRef.current = newLogs[newLogs.length - 1].id;
        })
        .catch(() => {});
    };

    pollReplies();
    pollIcons();
    const iv = setInterval(() => { pollReplies(); pollIcons(); }, 2000);
    return () => clearInterval(iv);
  }, [sessionActive]);

  // Auto-scroll student activity to bottom
  useEffect(() => {
    if (activityRef.current)
      activityRef.current.scrollTop = activityRef.current.scrollHeight;
  }, [studentActivity.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  // ── Session toggle ─────────────────────────────────────────────────────────
  const toggleSession = async () => {
    setTogglingSession(true);
    try {
      const res = await api.post("/sessions/toggle");
      const nowActive = res.data.active as boolean;
      setSessionActive(nowActive);
      setSessionCode(res.data.session_code || null);
      if (!nowActive) {
        // New session will be fresh — reset everything
        setSentLines([]);
        setStudentActivity([]);
        lastReplyIdRef.current = 0;
        lastIconIdRef.current  = 0;
        if (recording) stopRecording();
      }
    } catch {}
    setTogglingSession(false);
  };

  // ── Auto-broadcast: continuous=false so each utterance fires onend ─────────
  //
  //  Flow:
  //    startRecording() → recognition.start()
  //    user speaks → onresult keeps updating currentTranscriptRef (interim)
  //    user pauses → Chrome stops the recognizer → onend fires
  //    onend → broadcast the utterance → restart recognition → repeat
  //    stopRecording() → isRecordingRef=false → onend skips restart
  //
  const startRecording = () => {
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported. Please use Google Chrome.");
      return;
    }
    if (!sessionActiveRef.current) {
      setError("Start a class session first, then tap the mic to broadcast.");
      return;
    }

    isRecordingRef.current = true;
    currentTranscriptRef.current = "";
    setRecording(true);
    setSent(false);
    setError("");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous     = false;   // each utterance is one unit
    recognition.interimResults = true;
    recognition.lang           = "en-US";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      currentTranscriptRef.current = text;
      setTranscript(text);
    };

    recognition.onerror = (event: any) => {
      // "no-speech", "network", "aborted" are transient — onend will restart
      if (["no-speech", "network", "aborted"].includes(event.error)) return;
      setError(`Mic error: ${event.error}. Check browser microphone permissions.`);
      isRecordingRef.current = false;
      setRecording(false);
    };

    recognition.onend = () => {
      const textToBroadcast = currentTranscriptRef.current.trim();
      currentTranscriptRef.current = "";
      setTranscript("");

      // Broadcast the captured utterance
      if (textToBroadcast && isRecordingRef.current) {
        api.post("/broadcast/", { text: textToBroadcast, speaker: "teacher" })
          .then(() => setSentLines(prev => [...prev.slice(-9), textToBroadcast]))
          .catch(() => setError("Broadcast failed — is the class session still active?"));
      }

      // Restart immediately for the next utterance
      if (isRecordingRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch {}
        }, 150);
      } else {
        setRecording(false);
      }
    };

    try {
      recognition.start();
    } catch {
      setError("Could not access microphone. Refresh and try again.");
      isRecordingRef.current = false;
      setRecording(false);
    }
  };

  const stopRecording = () => {
    isRecordingRef.current       = false;
    currentTranscriptRef.current = "";
    recognitionRef.current?.stop();
    setTranscript("");
    setRecording(false);
  };

  const handleToggle = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  // Manual broadcast for typed text
  const handleBroadcast = async () => {
    if (!transcript.trim()) return;
    if (recording) stopRecording();
    setSending(true);
    setError("");
    try {
      await api.post("/broadcast/", { text: transcript.trim(), speaker: "teacher" });
      setSentLines(prev => [...prev.slice(-9), transcript.trim()]);
      setSent(true);
      setTranscript("");
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError("Failed to broadcast. Check that a session is active.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Browser warning */}
      {!isChromium && (
        <div style={{
          padding: "12px 18px", borderRadius: Radius.md,
          background: "#FEF3C7", border: "1px solid #FCD34D",
          display: "flex", alignItems: "center", gap: 10,
          fontSize: FontSize.sm, color: "#92400E", fontWeight: 500,
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span>
            <strong>Voice input requires Chrome or Edge.</strong>{" "}
            Please switch to <strong>Google Chrome</strong> for the mic to work.
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: 16 }}>

        {/* ── Main panel ── */}
        <Card style={{ flex: 1 }}>
          <CardTitle>Speech-to-Text Broadcast</CardTitle>
          <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 20, lineHeight: 1.6 }}>
            {sessionActive
              ? <>Tap the mic and speak. Every sentence is <strong>automatically broadcast</strong> to students the moment you pause — no button needed.</>
              : <>Start a session first, then tap the mic to begin broadcasting.</>}
          </p>

          {/* Mic button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
            <button
              onClick={handleToggle}
              disabled={!sttSupported || (!sessionActive && !recording)}
              style={{
                width: 72, height: 72, borderRadius: "50%", border: "none",
                background: recording ? C.redDark : sessionActive ? C.teal : C.gray3,
                cursor: (sttSupported && (sessionActive || recording)) ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: recording
                  ? `0 0 0 10px rgba(226,75,74,0.12), 0 0 0 20px rgba(226,75,74,0.06)`
                  : sessionActive ? `0 0 0 8px ${C.tealLight}` : "none",
                transition: "all 0.2s",
                opacity: (sttSupported && (sessionActive || recording)) ? 1 : 0.5,
              }}
            >
              {recording
                ? <Icon name="stop" size={24} color={C.white} />
                : <Icon name="mic"  size={24} color={C.white} />
              }
            </button>

            <div style={{ fontSize: FontSize.base, fontWeight: 500, color: recording ? C.redDark : C.text2 }}>
              {!sttSupported
                ? "Use Chrome for voice input"
                : !sessionActive && !recording
                ? "Start a session above to enable mic"
                : recording
                ? "🎙 Listening… pausing broadcasts each sentence"
                : "Tap mic to start auto-broadcasting"}
            </div>

            {recording && (
              <div style={{ width: "60%" }}>
                <ProgressBar value={65} color={C.tealMid} />
              </div>
            )}
          </div>

          {/* Live interim transcript */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: C.text3, marginBottom: 8 }}>
              {recording
                ? <span>Now hearing <span style={{ color: C.teal }}>● Auto-broadcasting on pause</span></span>
                : "Or type here to broadcast manually"}
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder={
                recording
                  ? "Speak now… text appears here, sends automatically when you pause."
                  : "Type here and click Broadcast, or use the mic above."
              }
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                background: recording ? "#F0FDF9" : C.gray,
                borderRadius: Radius.md, padding: "10px 14px", minHeight: 70,
                fontSize: 13, lineHeight: 1.7, color: C.text2,
                border: `1px solid ${recording ? C.teal : C.gray2}`,
                outline: "none", resize: "vertical", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            />
          </div>

          {/* Recently auto-broadcast log */}
          {sentLines.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: FontSize.xs, fontWeight: 600, color: C.text3, marginBottom: 6 }}>
                ✅ Recently broadcast ({sentLines.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 130, overflowY: "auto" }}>
                {sentLines.map((line, i) => (
                  <div key={i} style={{
                    padding: "6px 10px", borderRadius: Radius.sm,
                    background: C.tealLight, border: `1px solid ${C.tealBorder}`,
                    fontSize: FontSize.xs, color: "#085041", lineHeight: 1.5,
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 10, padding: "10px 14px",
              background: "#FEF2F2", borderRadius: Radius.md,
              fontSize: FontSize.sm, color: C.red,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {sent && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 14, padding: "10px 14px",
              background: C.tealLight, borderRadius: Radius.md,
            }}>
              <Icon name="check" size={14} color={C.teal} />
              <span style={{ fontSize: FontSize.sm, color: C.teal, fontWeight: 500 }}>
                ✅ Broadcast sent! Students see it within 2 seconds.
              </span>
            </div>
          )}

          {/* Manual broadcast button */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Button
              variant="primary"
              onClick={handleBroadcast}
              disabled={!transcript.trim() || sending}
              style={{ flex: 1 }}
            >
              {sending ? "Sending..." : "📡 Broadcast to students"}
            </Button>
            <Button
              onClick={() => setTranscript("")}
              disabled={!transcript.trim() || recording}
              style={{ flex: 1 }}
            >
              Clear
            </Button>
          </div>
        </Card>

        {/* ── Right column ── */}
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Session control */}
          <Card>
            <CardTitle>Class Session</CardTitle>
            <div style={{
              padding: "12px 14px", borderRadius: Radius.md, marginBottom: 12,
              background: sessionActive ? "rgba(34,197,94,0.08)" : C.gray,
              border: `1px solid ${sessionActive ? "rgba(34,197,94,0.3)" : C.gray2}`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: sessionActive ? "#22C55E" : C.gray3,
                boxShadow: sessionActive ? "0 0 0 3px rgba(34,197,94,0.25)" : "none",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: sessionActive ? "#15803D" : C.text2 }}>
                  {sessionActive ? "Session Active" : "No Active Session"}
                </div>
                {sessionCode && (
                  <div style={{ fontSize: FontSize.xs, color: C.text3, marginTop: 2 }}>
                    Code: <strong>{sessionCode}</strong>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant={sessionActive ? "danger" : "primary"}
              onClick={toggleSession}
              disabled={togglingSession}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {togglingSession ? "..." : sessionActive ? "⏹ End Session" : "▶ Start Session"}
            </Button>
          </Card>

          {/* Live student responses */}
          {sessionActive && (
            <Card style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <CardTitle>Student Responses</CardTitle>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)" }} />
                  <span style={{ fontSize: FontSize.xs, color: "#15803D", fontWeight: 600 }}>Live</span>
                </div>
              </div>

              {studentActivity.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: C.text3, fontSize: FontSize.sm }}>
                  Waiting for students to respond…
                </div>
              ) : (
                <div
                  ref={activityRef}
                  style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}
                >
                  {studentActivity.map(item => (
                    <div key={item.id} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "8px 10px", borderRadius: Radius.md,
                      background: item.type === "reply" ? C.purpleLight : C.gray,
                      border: `1px solid ${C.gray2}`,
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: Radius.sm, flexShrink: 0,
                        background: item.type === "reply" ? C.tealLight : C.gray,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                      }}>
                        {item.type === "reply" ? "💬" : "🗣"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: FontSize.xs, fontWeight: 700, color: C.text, marginBottom: 2 }}>
                          {item.student_name}
                          <span style={{ fontWeight: 400, color: C.text3, marginLeft: 6 }}>
                            · {item.time.slice(11, 16)}
                          </span>
                        </div>
                        <div style={{ fontSize: FontSize.sm, color: C.text2, lineHeight: 1.4, wordBreak: "break-word" }}>
                          {item.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* How it works (when no session) */}
          {!sessionActive && (
            <Card>
              <CardTitle>How it works</CardTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "1", text: "Start a session above" },
                  { step: "2", text: "Tap the mic — each sentence auto-broadcasts" },
                  { step: "3", text: "Students reply via icons or text" },
                  { step: "4", text: "Their responses appear here live" },
                ].map(item => (
                  <div key={item.step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      background: C.teal, color: C.white,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {item.step}
                    </div>
                    <span style={{ fontSize: FontSize.sm, color: C.text2, lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div style={{ fontSize: FontSize.xs, color: C.text3, lineHeight: 1.6 }}>
                💡 Use <strong>Chrome</strong> for voice recognition.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
