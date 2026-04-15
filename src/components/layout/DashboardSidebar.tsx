import { NavLink } from "react-router-dom";
import UserFooter from "./UserFooter";
import "../../styles/DashboardComponent.css";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  // We removed user and logout here because UserFooter handles them now
  
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
        
        {/* This single component now handles the clickable name AND the logout button */}
        <UserFooter onAction={onClose} />
      </nav>
    </>
  );
}