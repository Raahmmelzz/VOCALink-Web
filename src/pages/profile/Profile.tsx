import DashboardCard from "../../components/layout/DashboardCard";
import ProfileEditForm from "../../components/layout/ProfileEditForm";
import { useProfile } from "../../hooks/useProfile";
import "../../styles/DashboardLayout.css";

export default function Profile() {
  const {
    user,
    specs,
    newSpec,
    setNewSpec,
    initials,
    handleAddSpec,
    removeSpec,
  } = useProfile();

  return (
    <div className="profile-page-container">
      <div className="profile-grid">
        {/* Sidebar: Avatar & Basic Info */}
        <div className="profile-sidebar-column">
          <DashboardCard>
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">{initials}</div>
              <h2 className="profile-name-display">{user?.username}</h2>
              <p className="profile-role-tag">
                {user?.organization || "SNED Educator"}
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* Main Content: Settings & Expertise */}
        <div className="profile-main-column">
          <DashboardCard>
            <h3 className="section-title">Account Settings</h3>
            <ProfileEditForm />
          </DashboardCard>

          <DashboardCard>
            <h3 className="section-title">Expertise & Specializations</h3>
            <div className="specialization-grid">
              {specs.map((s, i) => (
                <div key={i} className="spec-tag">
                  {s}{" "}
                  <span className="remove-tag" onClick={() => removeSpec(i)}>
                    ×
                  </span>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddSpec} className="add-spec-form">
              <input
                type="text"
                placeholder="Add new area..."
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
              />
              <button type="submit" className="add-btn">
                Add
              </button>
            </form>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}