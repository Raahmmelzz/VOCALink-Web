import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/DashboardComponent.css";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && <div onClick={onClose} className="sidebar-overlay" />}

      <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`}>
        <button onClick={onClose} className="sidebar-close-btn">✕</button>

        <h3 className="sidebar-title">System Menu</h3>
        
        <NavLink end onClick={onClose} to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        
        <NavLink onClick={onClose} to="/dashboard/students" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Manage Students
        </NavLink>
        
        <NavLink onClick={onClose} to="/dashboard/tts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Text-to-Speech Config
        </NavLink> 

        <NavLink onClick={onClose} to="/dashboard/boards" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Manage Boards
        </NavLink>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.username || "Educator"}</span>
            <span className="user-email">{user?.email || "user@vocalink.edu"}</span>
          </div>

          <button onClick={() => { onClose(); logout(); }} className="logout-btn">
            Log Out
          </button>
        </div>
      </nav>
    </>
  );
}