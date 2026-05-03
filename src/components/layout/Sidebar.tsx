import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius } from "../../styles/tokens";
import { Badge, Divider } from "../ui";
import Icon from "../ui/Icon";
import type { NavPage } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // 1. Added API import

interface NavItem {
  id: NavPage;
  label: string;
  icon: "home" | "users" | "mic" | "msg" | "cc";
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard",     icon: "home" },
  { id: "students",  label: "Students",      icon: "users" },
  { id: "broadcast", label: "STT Broadcast", icon: "mic" },
  { id: "messages",  label: "Messages",      icon: "msg", badge: 3 },
  { id: "livecc",    label: "Live CC Log",   icon: "cc" },
];

interface SidebarProps {
  active: NavPage;
  setActive: (page: NavPage) => void;
  teacherName: string;
  teacherInitials: string;
  teacherPhoto: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  active, setActive,
  teacherName, teacherInitials, teacherPhoto,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 2. Local state to catch the username immediately on load
  const [localName, setLocalName] = useState("");
  const [localInitials, setLocalInitials] = useState("");

  // 3. Fetch user data instantly when the sidebar appears
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('users/me/');
        const defaultName = res.data.display_name || res.data.username || "User";
        setLocalName(defaultName);
        setLocalInitials(defaultName.substring(0, 2).toUpperCase());
      } catch (error) {
        console.error("Sidebar failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();             // 1. Clears the tokens
    navigate("/login");   // 2. Redirects to the login screen
  };

  // 4. Logic: If parent passes a real name (like after a Settings save), use it. 
  // Otherwise, use our instantly fetched name so it never says "Loading..."
  const isPropReal = teacherName && !teacherName.toLowerCase().includes("loading");
  const displayName = isPropReal ? teacherName : (localName || "Loading...");
  const displayInitials = isPropReal ? teacherInitials : (localInitials || "...");

  return (
    <aside style={{
      width: 220, background: C.white,
      borderRight: `1px solid ${C.gray2}`,
      display: "flex", flexDirection: "column",
      flexShrink: 0, height: "100vh",
    }}>

      {/* Brand */}
      <div style={{ padding: "20px 16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: Radius.md,
          background: "linear-gradient(135deg, #2aa7ff, #00e1ff)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" fill="white" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: "-0.3px" }}>
          VocaLink
        </span>
      </div>

      {/* Role badge */}
      <div style={{ padding: "0 16px 12px" }}>
        <Badge color="teal">Teacher Portal</Badge>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{
          padding: "4px 16px 6px",
          fontSize: FontSize.xs, fontWeight: 600,
          color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          Classroom
        </div>

        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", margin: "1px 6px",
                borderRadius: Radius.md, cursor: "pointer",
                fontSize: FontSize.base,
                background: isActive ? C.tealLight : "transparent",
                color:      isActive ? C.teal      : C.text2,
                fontWeight: isActive ? 500          : 400,
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = C.gray; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <Icon name={item.icon} size={15} color={isActive ? C.teal : C.text3} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && (
                <Badge color="amber" style={{ fontSize: FontSize.xs, padding: "1px 6px" }}>
                  {item.badge}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div style={{ padding: "12px 10px" }}>
        <Divider style={{ margin: "0 0 10px" }} />

        {/* Settings */}
        <div
          onClick={() => setActive("settings")}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 10px", borderRadius: Radius.md,
            cursor: "pointer", fontSize: FontSize.base,
            background: active === "settings" ? C.tealLight : "transparent",
            color:      active === "settings" ? C.teal      : C.text2,
            fontWeight: active === "settings" ? 500          : 400,
            transition: "background 0.1s",
          }}
          onMouseEnter={e => { if (active !== "settings") (e.currentTarget as HTMLDivElement).style.background = C.gray; }}
          onMouseLeave={e => { if (active !== "settings") (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
        >
          <Icon name="settings" size={15} color={active === "settings" ? C.teal : C.text3} />
          <span>Settings</span>
        </div>

        {/* Sign out */}
        <div
        onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 10px", borderRadius: Radius.md,
            cursor: "pointer", fontSize: FontSize.base, color: C.text2,
            transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.gray}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
        >
          <Icon name="logout" size={15} color={C.text3} />
          <span>Sign out</span>
        </div>

        <Divider />

        {/* Teacher info — Dynamically Synced */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px" }}>
          {/* Avatar: show photo if uploaded, else initials */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: teacherPhoto ? "transparent" : C.tealLight,
            border: `1.5px solid ${C.teal}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}>
            {teacherPhoto
              ? <img src={teacherPhoto} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 10, fontWeight: 600, color: C.teal }}>{displayInitials}</span>
            }
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{displayName}</div>
            <div style={{ fontSize: 10, color: C.text3 }}>SNED Teacher</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;