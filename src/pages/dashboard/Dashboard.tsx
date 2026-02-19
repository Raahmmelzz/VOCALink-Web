import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext"; 
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); 

  const navStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#646cff" : "#334155",
    fontWeight: isActive ? "bold" : "normal", 
    textDecoration: "none",
    padding: "8px 0", 
    display: "block" 
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f6f8fb", position: "relative" }}>
      
      <DashboardHeader onOpenMenu={() => setIsSidebarOpen(true)} />

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999, 
            cursor: "pointer"
          }}
        />
      )}

      <nav 
        style={{
          position: "fixed",
          top: 0,
          left: isSidebarOpen ? "0" : "-300px", 
          width: "250px",
          height: "100vh",
          background: "#fff",
          padding: "80px 20px 20px", 
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          transition: "left 0.3s ease-in-out",
          zIndex: 1000, 
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <button 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
        >
          ✕
        </button>

        <h3 style={{ marginTop: 0, marginBottom: "10px" }}>System Menu</h3>
        
        <NavLink end onClick={() => setIsSidebarOpen(false)} to="/dashboard" style={navStyle}>
          Overview
        </NavLink>
        
        <NavLink onClick={() => setIsSidebarOpen(false)} to="/dashboard/students" style={navStyle}>
          Manage Students
        </NavLink>
        
        <NavLink onClick={() => setIsSidebarOpen(false)} to="/dashboard/tts" style={navStyle}>
          Text-to-Speech Config
        </NavLink> 
        
        {/* User Profile & Logout Area */}
        <div style={{ marginTop: "auto", borderTop: "1px solid #e5e7eb", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* User Info Display */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "bold", color: "#213547", fontSize: "1rem" }}>
              {user?.username || "Educator"}
            </span>
            <span style={{ color: "#64748b", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email || "user@vocalink.edu"}
            </span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              logout();
            }}
            style={{ 
              background: "#fee2e2", 
              border: "none", 
              color: "#ef4444", 
              fontWeight: "bold", 
              cursor: "pointer",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              transition: "background 0.2s"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: 24, maxWidth: 1100, width: "100%", margin: "0 auto" }}>
        <Outlet /> 
      </main>

      <DashboardFooter />
    </div>
  );
}