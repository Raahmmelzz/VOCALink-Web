import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/DashboardComponent.css";

export default function DashboardHeader({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get initials for the avatar (e.g., "Rammel" -> "R")
  const initials = user?.username 
    ? user.username.split(" ").map(n => n[0]).join("").toUpperCase() 
    : "U";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {onOpenMenu && (
          <button onClick={onOpenMenu} className="burger-btn" aria-label="Open Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <h2 className="header-title">VocaLink</h2>
      </div>

      <div className="header-right">
        <button 
          className="header-profile-btn" 
          onClick={() => navigate("/dashboard/profile")}
          title="Go to Profile"
        >
          <div className="header-avatar">{initials}</div>
        </button>
      </div>
    </header>
  );
}