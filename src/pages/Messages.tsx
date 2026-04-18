import React, { useState } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, Avatar, CardTitle, StatusDot, Badge, Button } from "../components/ui";
import Icon from "../components/ui/Icon";
import { STUDENTS, MESSAGES, QUICK_REPLIES } from "../data/mockData";
import type { Student, Messages as MessagesType } from "../types";

interface MessagesProps {
  selected: Student | null;
  setSelected: (s: Student) => void;
}

const Messages: React.FC<MessagesProps> = ({ selected, setSelected }) => {
  const [msgs, setMsgs]   = useState<MessagesType>(MESSAGES);
  const [reply, setReply] = useState("");

  const sendReply = (text: string) => {
    if (!selected || !text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), { from: "teacher", text, time: now }],
    }));
    setReply("");
  };

  return (
    <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>

      {/* Student sidebar */}
      <Card style={{ width: 220, flexShrink: 0, overflowY: "auto" }}>
        <CardTitle>Students</CardTitle>
        {STUDENTS.map(s => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 8px", borderRadius: Radius.md, cursor: "pointer",
              background: selected?.id === s.id ? C.tealLight : "transparent",
            }}
            onMouseEnter={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLDivElement).style.background = C.gray; }}
            onMouseLeave={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <Avatar name={s.name} bg={s.bg} color={s.color} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <StatusDot status={s.status} size={6} />
                <span style={{ fontSize: FontSize.xs, color: C.text3 }}>{s.status}</span>
              </div>
            </div>
            {s.unread > 0 && (
              <Badge color="amber" style={{ fontSize: FontSize.xs, padding: "1px 5px" }}>{s.unread}</Badge>
            )}
          </div>
        ))}
      </Card>

      {/* Chat area */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.gray2}` }}>
              <Avatar name={selected.name} bg={selected.bg} color={selected.color} />
              <div>
                <div style={{ fontSize: FontSize.base, fontWeight: 500, color: C.text }}>{selected.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <StatusDot status={selected.status} size={6} />
                  <span style={{ fontSize: FontSize.xs, color: C.text3 }}>{selected.status}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {(msgs[selected.id] ?? []).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.from === "teacher" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    padding: "8px 12px", borderRadius: Radius.md, maxWidth: "80%",
                    background: m.from === "teacher" ? C.teal : C.gray,
                    color:      m.from === "teacher" ? C.white : C.text,
                  }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
                    <div style={{ fontSize: FontSize.xs, marginTop: 3, opacity: 0.6 }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: FontSize.xs, color: C.text3, marginBottom: 6 }}>Quick reply</div>
              <div style={{ display: "flex", gap: 6 }}>
                {QUICK_REPLIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendReply(q.label)}
                    style={{
                      flex: 1, padding: "9px 0", borderRadius: Radius.md,
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      border: "none", background: q.bg, color: q.text,
                      fontFamily: "inherit",
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom input */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendReply(reply)}
                placeholder="Type a custom message..."
                style={{
                  flex: 1, padding: "8px 12px",
                  borderRadius: Radius.md, border: `1px solid ${C.gray2}`,
                  fontSize: FontSize.base, color: C.text,
                  background: C.white, fontFamily: "inherit",
                }}
              />
              <Button variant="primary" onClick={() => sendReply(reply)} style={{ padding: "8px 12px" }}>
                <Icon name="send" size={14} color={C.white} />
              </Button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.text3, fontSize: FontSize.base }}>
            Select a student to view messages
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;