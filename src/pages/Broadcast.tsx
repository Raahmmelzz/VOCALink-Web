import React, { useState, useRef, useEffect } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Button, ProgressBar, Divider } from "../components/ui";
import Icon from "../components/ui/Icon";
import api from "../services/api";

// Browser Speech Recognition setup
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Detect if browser is Chrome/Edge
const isChromium = !!(window as any).chrome;

const Broadcast: React.FC = () => {
  const [recording, setRecording]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sending, setSending]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [error, setError]           = useState("");
  const [sttSupported]              = useState(!!SpeechRecognition);

  // ── Session state ──
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode]     = useState<string | null>(null);
  const [sessionLogs, setSessionLogs]     = useState<any[]>([]);
  const [togglingSession, setTogglingSession] = useState(false);

  // Check if session is already active on mount
  useEffect(() => {
    api.get("/sessions/teacher").then(res => {
      setSessionActive(res.data.active);
      setSessionCode(res.data.session_code || null);
    }).catch(() => {});
  }, []);

  // Poll session logs every 2s when session is active
  useEffect(() => {
    if (!sessionActive) { setSessionLogs([]); return; }
    const poll = () => {
      api.get("/sessions/logs/").then(res => setSessionLogs(res.data)).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [sessionActive]);

  const toggleSession = async () => {
    setTogglingSession(true);
    try {
      const res = await api.post("/sessions/toggle");
      setSessionActive(res.data.active);
      setSessionCode(res.data.session_code || null);
      if (!res.data.active) setSessionLogs([]);
    } catch {}
    setTogglingSession(false);
  };

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      recognitionRef.current?.stop();
    };
  }, []);

  const startRecording = () => {
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;       // Keep listening
    recognition.interimResults = true;   // Show words as they're spoken
    recognition.lang = "en-US";

    let finalText = transcript;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interim = result[0].transcript;
        }
      }
      setTranscript(finalText + interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        setError(`Mic error: ${event.error}. Make sure mic is allowed.`);
      }
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
    setRecording(true);
    setSent(false);
    setError("");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const handleToggle = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleBroadcast = async () => {
    if (!transcript.trim()) return;
    // Stop recording first if still going
    if (recording) stopRecording();

    setSending(true);
    setError("");
    try {
      await api.post("/broadcast/", { text: transcript.trim(), speaker: "teacher" });
      setSent(true);
      setTranscript("");
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError("Failed to broadcast. Please try again.");
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
            <strong>Voice input requires Chrome or Edge.</strong> You are using a different browser.
            Please switch to <strong>Google Chrome</strong> for the STT Broadcast to work.
          </span>
        </div>
      )}

    <div style={{ display: "flex", gap: 16 }}>

      {/* Main panel */}
      <Card style={{ flex: 1 }}>
        <CardTitle>Speech-to-Text Broadcast</CardTitle>
        <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 20, lineHeight: 1.6 }}>
          Click the mic and speak. Your voice is transcribed in real time.
          When done, click <strong>Broadcast</strong> to send to all students.
        </p>

        {/* Mic button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 0" }}>
          <button
            onClick={handleToggle}
            disabled={!sttSupported}
            style={{
              width: 72, height: 72, borderRadius: "50%", border: "none",
              background: recording ? C.redDark : C.teal,
              cursor: sttSupported ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: recording
                ? `0 0 0 10px rgba(226,75,74,0.12), 0 0 0 20px rgba(226,75,74,0.06)`
                : `0 0 0 8px ${C.tealLight}`,
              transition: "all 0.2s",
              opacity: sttSupported ? 1 : 0.5,
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
              : recording
              ? "🎙 Listening... tap to stop"
              : "Tap mic to start speaking"}
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
            Transcript {recording && <span style={{ color: C.teal }}>● Live</span>}
          </div>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Your speech will appear here as you speak... or type manually."
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box",
              background: recording ? "#F0FDF9" : C.gray,
              borderRadius: Radius.md,
              padding: "10px 14px", minHeight: 80,
              fontSize: 13, lineHeight: 1.7, color: C.text2,
              border: `1px solid ${recording ? C.teal : C.gray2}`,
              outline: "none", resize: "vertical", fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          />
        </div>

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

        {/* Success banner */}
        {sent && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 14, padding: "10px 14px",
            background: C.tealLight, borderRadius: Radius.md,
          }}>
            <Icon name="check" size={14} color={C.teal} />
            <span style={{ fontSize: FontSize.sm, color: C.teal, fontWeight: 500 }}>
              ✅ Broadcast sent! Students will see it within 2 seconds.
            </span>
          </div>
        )}

        {/* Actions */}
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

      {/* Right column */}
      <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 14 }}>

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

        {/* Live session feed */}
        {sessionActive && (
          <Card style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <CardTitle>Live Icon Taps</CardTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)" }} />
                <span style={{ fontSize: FontSize.xs, color: "#15803D", fontWeight: 600 }}>Live</span>
              </div>
            </div>

            {sessionLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: C.text3, fontSize: FontSize.sm }}>
                Waiting for students to tap icons...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
                {sessionLogs.map(log => (
                  <div key={log.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: Radius.md,
                    background: C.gray, border: `1px solid ${C.gray2}`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: Radius.sm,
                      background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>
                      {/* Show emoji based on icon_id if possible */}
                      🗣
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: C.text }}>{log.icon_label}</div>
                      <div style={{ fontSize: FontSize.xs, color: C.text3 }}>
                        @{log.student_name} · {log.tapped_at?.slice(11, 16)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* How it works */}
        {!sessionActive && (
          <Card>
            <CardTitle>How it works</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { step: "1", text: "Start a session above" },
                { step: "2", text: "Students tap icons on their board" },
                { step: "3", text: "Taps appear here in real time" },
                { step: "4", text: "Broadcast captions via the mic" },
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
