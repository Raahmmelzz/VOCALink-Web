// src/components/layout/UserFooter.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface UserFooterProps {
  onAction: () => void;
}

export default function UserFooter({ onAction }: UserFooterProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onAction(); // Close the sidebar/overlay
    navigate("/dashboard/profile");
  };

  return (
    <div className="sidebar-footer">
      <div 
        className="user-info-clickable" 
        onClick={handleProfileClick}
        title="View Profile"
        role="button"
        tabIndex={0}
      >
        <span className="user-name">{user?.username || "Educator"}</span>
        <span className="user-email">{user?.email || "user@vocalink.edu"}</span>
      </div>

      <button onClick={() => { onAction(); logout(); }} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}