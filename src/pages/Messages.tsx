import React, { useState, useEffect, useRef } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, Avatar, CardTitle, StatusDot, Badge, Button } from "../components/ui";
import Icon from "../components/ui/Icon";
import { QUICK_REPLIES } from "../data/mockData";
import type { Student } from "../types";
import api from '../services/api';

const AVATAR_PALETTE = [
  { bg: C.tealLight,   color: C.teal   },
  { bg: C.blueLight,   color: C.blue   },
  { bg: C.purpleLight, color: C.purple },
  { bg: C.amberLight,  color: C.amber  },
  { bg: C.redLight,    color: C.red    },
];

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  is_aac: boolean;
  sent_at: string;
}

interface MessagesProps {
  selected: Student | null;
  setSelected: (s: Student | null) => void;
}

const Messages: React.FC<MessagesProps> = ({ selected, setSelected }) => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Student List (Class Roster)
  const fetchStudents = async () => {
    try {
      const response = await api.get('/teacher/students/');
      const formatted = response.data.map((s: any) => ({
        id: s.id,
        name: (s.first_name || s.last_name) ? `${s.first_name} ${s.last_name}`.trim() : s.username,
        status: s.status,
        unread: 0,
        bg: AVATAR_PALETTE[s.id % AVATAR_PALETTE.length].bg,
        color: AVATAR_PALETTE[s.id % AVATAR_PALETTE.length].color,
      }));
      setStudents(formatted);
    } catch (e) {
      console.error("Error fetching students:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Chat History for Selected Student
  // GET /messages/my-students returns ALL messages between teacher and their students.
  // We fetch everything once and filter client-side — no /messages/:id endpoint exists.
  const fetchChat = async () => {
    if (!selected) return;
    try {
      const response = await api.get(`/messages/my-students`);
      const all: Message[] = response.data;
      // Keep only messages exchanged between the teacher and this specific student
      const thread = all.filter(
        (m) => m.sender_id === selected.id || m.receiver_id === selected.id
      );
      setChatHistory(thread);
    } catch (e) {
      console.error("Failed to load chat:", e);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 10000); // Refresh list every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selected) {
      fetchChat();
      const interval = setInterval(fetchChat, 3000); // Poll for new messages every 3s
      return () => clearInterval(interval);
    } else {
      setChatHistory([]);
    }
  }, [selected]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendReply = async (text: string) => {
    if (!selected || !text.trim()) return;
    try {
      await api.post('/messages/', {
        receiver_id: selected.id,
        text: text
      });
      setReply("");
      fetchChat(); // Immediate refresh
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  return (
    <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>
      {/* Student sidebar */}
      <Card style={{ width: 220, flexShrink: 0, overflowY: "auto" }}>
        <CardTitle>Students</CardTitle>
        {loading ? (
          <div style={{ padding: 10, fontSize: FontSize.xs, color: C.text3 }}>Loading...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: 10, fontSize: FontSize.xs, color: C.text3 }}>No students found.</div>
        ) : (
          students.map(s => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 8px", borderRadius: Radius.md, cursor: "pointer",
                background: selected?.id === s.id ? C.tealLight : "transparent",
              }}
            >
              <Avatar name={s.name} bg={s.bg} color={s.color} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <StatusDot status={s.status as any} size={6} />
                  <span style={{ fontSize: FontSize.xs, color: C.text3 }}>{s.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Chat area */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {selected ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.gray2}` }}>
              <Avatar name={selected.name} bg={selected.bg} color={selected.color} />
              <div>
                <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>{selected.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <StatusDot status={selected.status as any} size={6} />
                  <span style={{ fontSize: FontSize.xs, color: C.text3 }}>{selected.status}</span>
                </div>
              </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
              {chatHistory.map((m) => {
                const isMe = m.sender_id !== selected.id;
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{
                      padding: "8px 12px", borderRadius: Radius.md, maxWidth: "80%",
                      background: isMe ? C.teal : C.gray,
                      color: isMe ? C.white : C.text,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                      {m.is_aac && !isMe && <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2, opacity: 0.8 }}>AAC TAP</div>}
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                      <div style={{ fontSize: 10, marginTop: 3, opacity: 0.6, textAlign: "right" }}>
                        {new Date(m.sent_at.endsWith("Z") || m.sent_at.includes("+") ? m.sent_at : m.sent_at + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: FontSize.xs, color: C.text3, marginBottom: 6 }}>Quick reply</div>
              <div style={{ display: "flex", gap: 6 }}>
                {QUICK_REPLIES.map((q, i) => (
                  <button key={i} onClick={() => sendReply(q.label)} style={{ flex: 1, padding: "9px 0", borderRadius: Radius.md, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: q.bg, color: q.text }}>{q.label}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendReply(reply)}
                placeholder="Type a custom message..."
                style={{ flex: 1, padding: "8px 12px", borderRadius: Radius.md, border: `1px solid ${C.gray2}`, fontSize: FontSize.base, color: C.text, background: C.white }}
              />
              <Button variant="primary" onClick={() => sendReply(reply)} style={{ padding: "8px 12px" }}>
                <Icon name="send" size={14} color={C.white} />
              </Button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.text3 }}>Select a student to view messages</div>
        )}
      </Card>
    </div>
  );
};

export default Messages;