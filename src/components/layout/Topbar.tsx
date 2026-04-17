import React from "react";
import { Colors as C, FontSize } from "../../styles/tokens";
import { StatusDot } from "../ui";
import Icon from "../ui/Icon";
import { STUDENTS } from "../../data/mockData";
import type { NavPage } from "../../types";

const PAGE_TITLES: Record<NavPage, string> = {
  dashboard: "Dashboard",
  students:  "Students",
  broadcast: "STT Broadcast",
  messages:  "Messages",
  livecc:    "Live CC Log",
};

interface TopbarProps {
  page: NavPage;
}

const Topbar: React.FC<TopbarProps> = ({ page }) => {
  const onlineCount = STUDENTS.filter(s => s.status === "online").length;

  return (
    <header style={{
      height: 56,
      background: C.white,
      borderBottom: `1px solid ${C.gray2}`,
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 14, flexShrink: 0,
    }}>
      <h1 style={{
        flex: 1, fontSize: 16, fontWeight: 600,
        color: C.text, letterSpacing: "-0.3px",
      }}>
        {PAGE_TITLES[page]}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <StatusDot status="online" />
        <span style={{ fontSize: FontSize.sm, color: C.text2 }}>
          {onlineCount} students online
        </span>
      </div>

      <div style={{ position: "relative", cursor: "pointer", display: "flex" }}>
        <Icon name="bell" size={18} color={C.text2} />
        <div style={{
          position: "absolute", top: -2, right: -2,
          width: 8, height: 8, borderRadius: "50%",
          background: C.redDark, border: `1.5px solid ${C.white}`,
        }} />
      </div>
    </header>
  );
};

export default Topbar;