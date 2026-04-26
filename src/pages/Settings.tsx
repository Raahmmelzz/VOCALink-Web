import React, { useState, useRef, useEffect } from "react";
import { Colors as C, FontSize, Radius } from "../styles/tokens";
import { Card, CardTitle, Button, Divider } from "../components/ui";
import Icon from "../components/ui/Icon";
import api from "../services/api"; // Added the API import

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.text3, margin: "18px 0 8px" }}>
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 4 }}>{children}</div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} style={{ width: "100%", fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: "8px 10px", outline: "none", fontFamily: "inherit", ...props.style }} />
);

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} style={{ width: "100%", fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: "8px 10px", outline: "none", fontFamily: "inherit", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer", ...props.style }} />
);

const Toggle: React.FC<{ value: boolean; onChange: () => void }> = ({ value, onChange }) => (
  <div onClick={onChange} style={{ width: 36, height: 20, borderRadius: 10, flexShrink: 0, background: value ? C.teal : "#D3D1C7", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
    <div style={{ width: 15, height: 15, borderRadius: "50%", background: C.white, position: "absolute", top: 2.5, left: value ? 19 : 2.5, transition: "left 0.15s" }} />
  </div>
);

const ToggleRow: React.FC<{ label: string; sub: string; value: boolean; onChange: () => void }> = ({ label, sub, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `0.5px solid #EEECE8` }}>
    <div>
      <div style={{ fontSize: FontSize.sm, color: C.text, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{sub}</div>
    </div>
    <Toggle value={value} onChange={onChange} />
  </div>
);

const SaveRow: React.FC<{ onSave: () => void }> = ({ onSave }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
    <Button style={{ minWidth: 80 }}>Cancel</Button>
    <Button variant="primary" onClick={onSave} style={{ minWidth: 110 }}>Save changes</Button>
  </div>
);

const Toast: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, background: C.teal, color: C.white, fontSize: FontSize.sm, fontWeight: 500, padding: "10px 18px", borderRadius: Radius.md, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.25s, transform 0.25s", pointerEvents: "none", zIndex: 100, display: "flex", alignItems: "center", gap: 8 }}>
    <Icon name="check" size={13} color={C.white} />
    Changes saved!
  </div>
);

type Tab = "profile" | "security" | "notifications";
const TABS: { id: Tab; label: string }[] = [
  { id: "profile",       label: "Profile" },
  { id: "security",      label: "Security" },
  { id: "notifications", label: "Notifications" },
];

interface SettingsProps {
  teacherName: string;
  teacherPhoto: string | null;
  onNameChange: (name: string, initials: string) => void;
  onPhotoChange: (url: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ teacherPhoto, onNameChange, onPhotoChange }) => {
  const [tab,   setTab]   = useState<Tab>("profile");
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  // Initialized with empty strings to prevent flashing old mock data
  const [username,    setUsername]    = useState("");
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [room,        setRoom]        = useState("");
  const [department,  setDepartment]  = useState("");
  const [grade,       setGrade]       = useState("");
  const [school,      setSchool]      = useState("");
  const [bio,         setBio]         = useState("");

  const [savedDisplayName, setSavedDisplayName] = useState("");
  const [savedRoom,        setSavedRoom]        = useState("");
  const [savedDepartment,  setSavedDepartment]  = useState(""); 

  const [pendingPhoto, setPendingPhoto] = useState<string | null>(teacherPhoto);
  const fileRef = useRef<HTMLInputElement>(null);

  // FETCH DATA ON MOUNT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('users/me/');
        const data = response.data;
        setUsername(data.username || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setDisplayName(data.display_name || "");
        setEmail(data.email || "");
        setPhone(data.contact_number || "");
        setRoom(data.room_section || "");
        setDepartment(data.department || "");
        setGrade(data.grade_handled || "");
        setSchool(data.organization || "");
        setBio(data.bio || "");

        setSavedDisplayName(data.display_name || "");
        setSavedRoom(data.room_section || "");
        setSavedDepartment(data.department || "");
        
        // This will display something like: "Teresa @treyes843"
        const sidebarName = data.display_name || (data.username ? `@${data.username}` : "Teacher");
        const initials = data.display_name 
            ? data.display_name.substring(0, 2).toUpperCase() 
            : (data.username ? data.username.substring(0, 2).toUpperCase() : "");
        
        onNameChange(sidebarName, initials);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [notifs, setNotifs] = useState({
    urgentMessages: true, aacRequests: true, studentIdle: false,
    broadcastReminder: true, sessionSummary: false,
    inApp: true, emailAlerts: true, smsAlerts: false, soundAlerts: true,
  });
  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  // ASYNC SAVE FUNCTION
  const showToast = async () => {
    try {
      const payload = {
        username: username,     // <--- ADD THIS
        email: email,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        contact_number: phone, // Matches Serializer
        room_section: room,    // Matches Serializer
        department: department,
        grade_handled: grade,
        organization: school,
        bio: bio
      };

      await api.patch('users/me/', payload);

      // Helper to safely get initials for the profile circle
      const fChar = firstName.trim().charAt(0).toUpperCase();
      const initials = fChar || "T";
      
      // Update sidebar instantly with First Name + @Username
      // 💥 Instantly update sidebar using the new rule
      const sidebarName = displayName || `@${username}`;
      const calculatedInitials = displayName 
          ? displayName.substring(0, 2).toUpperCase() 
          : (username ? username.substring(0, 2).toUpperCase() : "T");
          
      onNameChange(sidebarName, initials);
      
      // Update the "Saved" labels
      onNameChange(displayName, initials || "TR");
      onPhotoChange(pendingPhoto);
      
      // Update the "Saved" labels in the sidebar
      setSavedDisplayName(displayName);
      setSavedRoom(room);
      setSavedDepartment(department); 
      
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    } catch (error) {
      console.error("Error saving profile", error);
      alert("Failed to save changes.");
    }
  };

  const initials = (firstName[0] ?? "").toUpperCase() + (lastName[0] ?? "").toUpperCase();

  // PREVENT RENDERING UNTIL DATA IS LOADED
  if (loading) {
    return <div style={{ padding: 20, color: C.text3, fontSize: FontSize.sm }}>Loading profile...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, background: "#ECEAE5", borderRadius: Radius.md, padding: 3, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ fontSize: FontSize.sm, padding: "6px 18px", borderRadius: (Radius as any).sm ?? 6, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t.id ? 500 : 400, background: tab === t.id ? C.white : "transparent", color: tab === t.id ? C.text : C.text3, boxShadow: tab === t.id ? `0 0 0 0.5px #DDD` : "none", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

          {/* Photo card */}
          <Card style={{ width: 220, flexShrink: 0 }}>
            <CardTitle>Profile photo</CardTitle>
            <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 16, lineHeight: 1.5 }}>
              Visible to students and admins
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ width: 88, height: 88, borderRadius: "50%", background: pendingPhoto ? "transparent" : C.tealLight, border: `2.5px solid ${(C as any).tealMid ?? C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden", flexShrink: 0 }}
              >
                {pendingPhoto
                  ? <img src={pendingPhoto} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 24, fontWeight: 500, color: C.teal }}>{initials || "TR"}</span>
                }
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: C.teal, border: `2px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={10} color={C.white} />
                </div>
              </div>

              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />

              <div style={{ fontSize: FontSize.sm, fontWeight: 500, color: C.text, textAlign: "center" }}>{savedDisplayName}</div>
              <div style={{ fontSize: 11, color: C.text3, textAlign: "center" }}>SNED Teacher · {savedRoom}</div>

              <Button onClick={() => fileRef.current?.click()} style={{ width: "100%", fontSize: FontSize.sm, justifyContent: "center" }}>
                Upload new photo
              </Button>
              <button
                onClick={() => setPendingPhoto(null)}
                style={{ width: "100%", fontSize: FontSize.sm, color: C.text3, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "inherit" }}
              >
                Remove photo
              </button>
              <div style={{ fontSize: 11, color: C.text3, textAlign: "center", lineHeight: 1.5 }}>
                JPG, PNG or GIF · Max 2 MB<br />Recommended 200×200 px
              </div>
            </div>

            <Divider />

            {[
              { label: "Employee ID",  value: "TCH-2019-044" },
              { label: "Department",   value: savedDepartment }, 
              { label: "Member since", value: "June 2019" },
              { label: "Last login",   value: "Today, 7:48 AM" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `0.5px solid #EEECE8` }}>
                <span style={{ fontSize: 11, color: C.text3 }}>{row.label}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{row.value}</span>
              </div>
            ))}
          </Card>

          {/* Personal info card */}
          <Card style={{ flex: 1 }}>
            <CardTitle>Personal information</CardTitle>
            <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 16, lineHeight: 1.5 }}>
              Update your name, contact, and role details
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel>First name</FieldLabel><TextInput value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
              <div><FieldLabel>Last name</FieldLabel><TextInput value={lastName} onChange={e => setLastName(e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Display name</FieldLabel><TextInput value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Email address</FieldLabel><TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><FieldLabel>Contact number</FieldLabel><TextInput type="tel" value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div><FieldLabel>Room / Section</FieldLabel><TextInput value={room} onChange={e => setRoom(e.target.value)} /></div>
              <div>
                <FieldLabel>Department</FieldLabel>
                <SelectInput value={department} onChange={e => setDepartment(e.target.value)}>
                  <option>SNED</option><option>Regular</option><option>Administration</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Grade handled</FieldLabel>
                <SelectInput value={grade} onChange={e => setGrade(e.target.value)}>
                  <option>Grade 4</option><option>Grade 5</option><option>Grade 6</option>
                </SelectInput>
              </div>
              <div style={{ gridColumn: "1 / -1" }}><FieldLabel>School name</FieldLabel><TextInput value={school} onChange={e => setSchool(e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}>
                <FieldLabel>Bio / Short note</FieldLabel>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ width: "100%", fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: "8px 10px", outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
              </div>
            </div>
            <SaveRow onSave={showToast} />
          </Card>
        </div>
      )}

      {/* ── SECURITY TAB — centered, max width ── */}
      {tab === "security" && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "100%", maxWidth: 520 }}>
            <CardTitle>Change password</CardTitle>
            <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 16, lineHeight: 1.5 }}>Use a strong password you don't use elsewhere</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><FieldLabel>Current password</FieldLabel><TextInput type="password" placeholder="Enter current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} /></div>
              <div><FieldLabel>New password</FieldLabel><TextInput type="password" placeholder="Min. 8 characters" value={newPw} onChange={e => setNewPw(e.target.value)} /></div>
              <div><FieldLabel>Confirm new password</FieldLabel><TextInput type="password" placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} /></div>
            </div>
            <SaveRow onSave={showToast} />
            <Divider />
            <SectionLabel>Login sessions</SectionLabel>
            {[
              { device: "Chrome on Windows — Computer Lab", time: "Active now",   active: true  },
              { device: "Safari on iPhone — Mobile",        time: "Apr 18, 2026", active: false },
              { device: "Chrome on Android — Tablet",       time: "Apr 14, 2026", active: false },
            ].map(s => (
              <div key={s.device} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `0.5px solid #EEECE8` }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.active ? C.teal : "#B4B2A9", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: FontSize.sm, color: C.text }}>{s.device}</div>
                  <div style={{ fontSize: 11, color: C.text3 }}>{s.active ? "Active now" : `Last active ${s.time}`}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Button style={{ fontSize: FontSize.sm, color: "#A32D2D", borderColor: "#F09595" }}>Sign out all other sessions</Button>
            </div>
            <Divider />
            <div style={{ border: `0.5px solid #F09595`, borderRadius: Radius.md, padding: "14px 16px", background: "#FFF8F8" }}>
              <div style={{ fontSize: FontSize.sm, fontWeight: 600, color: "#A32D2D", marginBottom: 4 }}>Danger zone</div>
              <div style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 12, lineHeight: 1.5 }}>Permanently delete your account and all associated data. This cannot be undone.</div>
              <Button style={{ fontSize: FontSize.sm, color: "#A32D2D", borderColor: "#F09595", background: "#FCEBEB" }}>Delete account</Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {tab === "notifications" && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Card style={{ flex: 1 }}>
            <CardTitle>Notification preferences</CardTitle>
            <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 4, lineHeight: 1.5 }}>Choose how you want to be alerted during sessions</p>
            <SectionLabel>Student messages</SectionLabel>
            <ToggleRow label="Urgent messages"      sub="Get alerted immediately for urgent student flags" value={notifs.urgentMessages}    onChange={() => toggleNotif("urgentMessages")} />
            <ToggleRow label="New AAC requests"     sub="Notify when a student sends a new request"        value={notifs.aacRequests}       onChange={() => toggleNotif("aacRequests")} />
            <ToggleRow label="Student goes idle"    sub="Alert when a student hasn't responded in 10 min"  value={notifs.studentIdle}       onChange={() => toggleNotif("studentIdle")} />
            <SectionLabel>System</SectionLabel>
            <ToggleRow label="Broadcast reminders"  sub="Remind me before a scheduled STT broadcast"       value={notifs.broadcastReminder} onChange={() => toggleNotif("broadcastReminder")} />
            <ToggleRow label="Session summary email" sub="Receive a daily summary at end of period"        value={notifs.sessionSummary}    onChange={() => toggleNotif("sessionSummary")} />
            <SaveRow onSave={showToast} />
          </Card>
          <Card style={{ flex: 1 }}>
            <CardTitle>Notification channels</CardTitle>
            <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 4, lineHeight: 1.5 }}>Where alerts should be delivered</p>
            <SectionLabel>Delivery</SectionLabel>
            <ToggleRow label="In-app notifications" sub="Show alerts inside the VocaLink dashboard"   value={notifs.inApp}        onChange={() => toggleNotif("inApp")} />
            <ToggleRow label="Email notifications"  sub={`Send alerts to ${email}`}                  value={notifs.emailAlerts}  onChange={() => toggleNotif("emailAlerts")} />
            <ToggleRow label="SMS notifications"    sub={`Text alerts to ${phone}`}                  value={notifs.smsAlerts}    onChange={() => toggleNotif("smsAlerts")} />
            <ToggleRow label="Sound alerts"         sub="Play a sound for urgent messages"           value={notifs.soundAlerts}  onChange={() => toggleNotif("soundAlerts")} />
            <SaveRow onSave={showToast} />
          </Card>
        </div>
      )}

      <Toast visible={toast} />
    </div>
  );
};

export default Settings;