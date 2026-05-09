import React, { useEffect, useState } from "react";
import { Colors as C, FontSize, Radius } from "../../styles/tokens";
import { Badge } from "../ui";
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
  { id: "dashboard", label: "Dashboard",     icon: "home"  },
  { id: "students",  label: "Students",      icon: "users" },
  { id: "broadcast", label: "STT Broadcast", icon: "mic"   },
  { id: "messages",  label: "Messages",      icon: "msg", badge: 3 },
  { id: "livecc",    label: "Live CC Log",   icon: "cc"    },
];

interface SidebarProps {
  active: NavPage;
  setActive: (page: NavPage) => void;
  teacherName: string;
  teacherInitials: string;
  teacherPhoto: string | null;
}

const NavBtn: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px", margin: "2px 8px",
        borderRadius: Radius.md, cursor: "pointer",
        fontSize: FontSize.base,
        background: isActive
          ? "rgba(26,173,220,0.18)"
          : hovered ? C.sidebarHover : "transparent",
        color: isActive ? "#1AADDC" : hovered ? "rgba(255,255,255,0.85)" : C.sidebarText,
        fontWeight: isActive ? 600 : 400,
        transition: "all 0.15s",
        borderLeft: isActive ? `3px solid #1AADDC` : "3px solid transparent",
      }}
    >
      {children}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  active, setActive,
  teacherName, teacherInitials, teacherPhoto,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [settingsHovered, setSettingsHovered] = React.useState(false);
  const [logoutHovered, setLogoutHovered] = React.useState(false);

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
    logout();
    navigate("/login");
  };

  return (
    <aside style={{
      width: 232,
      background: C.sidebar,
      display: "flex", flexDirection: "column",
      flexShrink: 0, height: "100vh",
      borderRight: `1px solid rgba(255,255,255,0.06)`,
    }}>

      {/* Brand header with gradient */}
      <div style={{
        padding: "0 16px",
        background: "linear-gradient(135deg, rgba(26,173,220,0.25) 0%, rgba(13,208,245,0.10) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        marginBottom: 8,
      }}>
        <div style={{ padding: "18px 0 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: Radius.md,
            background: "linear-gradient(135deg, #1AADDC, #0DD0F5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(26,173,220,0.4)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="white"/>
              <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="10.5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
              VocaLink
            </div>
            <div style={{ fontSize: FontSize.xs, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>
              Teacher Portal
            </div>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{
        padding: "6px 20px 4px",
        fontSize: FontSize.xs, fontWeight: 600,
        color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        Classroom
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <NavBtn key={item.id} isActive={isActive} onClick={() => setActive(item.id)}>
              <Icon name={item.icon} size={15} color={isActive ? "#1AADDC" : "rgba(255,255,255,0.45)"} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && (
                <span style={{
                  background: "#1AADDC", color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 999,
                  minWidth: 18, textAlign: "center",
                }}>
                  {item.badge}
                </span>
              )}
            </NavBtn>
          );
        })}
      </div>

      {/* Bottom section */}
      <div style={{ padding: "8px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Settings */}
        <div
          onClick={() => setActive("settings")}
          onMouseEnter={() => setSettingsHovered(true)}
          onMouseLeave={() => setSettingsHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", margin: "2px 8px",
            borderRadius: Radius.md, cursor: "pointer",
            fontSize: FontSize.base,
            background: active === "settings"
              ? "rgba(26,173,220,0.18)"
              : settingsHovered ? C.sidebarHover : "transparent",
            color: active === "settings" ? "#1AADDC" : settingsHovered ? "rgba(255,255,255,0.85)" : C.sidebarText,
            fontWeight: active === "settings" ? 600 : 400,
            borderLeft: active === "settings" ? "3px solid #1AADDC" : "3px solid transparent",
            transition: "all 0.15s",
          }}
        >
          <Icon name="settings" size={15} color={active === "settings" ? "#1AADDC" : "rgba(255,255,255,0.45)"} />
          <span>Settings</span>
        </div>

        {/* Sign out */}
        <div
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", margin: "2px 8px 8px",
            borderRadius: Radius.md, cursor: "pointer",
            fontSize: FontSize.base,
            background: logoutHovered ? "rgba(226,75,74,0.12)" : "transparent",
            color: logoutHovered ? "#F87171" : C.sidebarText,
            borderLeft: "3px solid transparent",
            transition: "all 0.15s",
          }}
        >
          <Icon name="logout" size={15} color={logoutHovered ? "#F87171" : "rgba(255,255,255,0.45)"} />
          <span>Sign out</span>
        </div>

        {/* Teacher info */}
        <div style={{
          margin: "0 8px 8px",
          padding: "10px 12px",
          borderRadius: Radius.md,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: teacherPhoto ? "transparent" : "linear-gradient(135deg, #1AADDC, #0DD0F5)",
            border: `2px solid rgba(26,173,220,0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, overflow: "hidden",
          }}>
            {teacherPhoto
              ? <img src={teacherPhoto} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                  {teacherInitials || "T"}
                </span>
            }
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {teacherName || "Teacher"}
            </div>
            <div style={{ fontSize: FontSize.xs, color: "rgba(255,255,255,0.35)" }}>SNED Teacher</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;