import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardOverview() {
  const { user } = useAuth();

  const [boards, setBoards] = useState<string[]>([
    "Basic Greetings",
    "Emergency Needs",
    "Classroom Instructions"
  ]);
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreateBoard = (e: FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim() === "") return;
    setBoards([...boards, newBoardName]);
    setNewBoardName(""); 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e5e7eb" }}>
        <h1 style={{ marginTop: 0 }}>Dashboard Overview</h1>
        <p style={{ color: "#64748b" }}>
          Logged in as <b>{user?.username}</b>
        </p>
      </div>

      <div style={{ background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e5e7eb" }}>
        <h2 style={{ marginTop: 0 }}>Communication Boards</h2>
        <ul style={{ color: "#334155", marginBottom: "20px" }}>
          {boards.map((board, index) => (
            <li key={index}>{board}</li>
          ))}
        </ul>
        <form onSubmit={handleCreateBoard} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="E.g., Recess Activities"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            required
          />
          <button type="submit" style={{ background: "#646cff", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", cursor: "pointer" }}>
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}