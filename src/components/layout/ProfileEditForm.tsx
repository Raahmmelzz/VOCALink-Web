
import { useProfileEdit } from "../../hooks/useProfileEdit";

export default function ProfileEditForm() {
  const { 
    formData, 
    isSaving, 
    updateField, 
    handleDiscard, 
    handleSubmit 
  } = useProfileEdit();

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={(e) => updateField("username", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Organization / School</label>
        <input 
          type="text" 
          placeholder="e.g. Vocalink Learning Center"
          value={formData.organization} 
          onChange={(e) => updateField("organization", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Professional Bio</label>
        <textarea 
          placeholder="Describe your focus in special education..."
          value={formData.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={handleDiscard}>
          Discard
        </button>
        <button type="submit" className="save-btn" disabled={isSaving}>
          {isSaving ? "Syncing..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}