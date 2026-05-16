import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/auth.css";
import { Colors as C } from "./styles/tokens";

import Sidebar   from "./components/layout/Sidebar";
import Topbar    from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Students  from "./pages/Students";
import Broadcast from "./pages/Broadcast";
import Messages  from "./pages/Messages";
import LiveCC    from "./pages/LiveCC";
import Settings  from "./pages/Settings";
import Login          from "./pages/auth/Login";
import Signup         from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

import { useAuth } from "./context/AuthContext";
import type { NavPage, Student } from "./types";
import api from "./services/api";

// 1. We move your entire dashboard UI into a sub-component
const DashboardLayout: React.FC = () => {
  const [active, setActive] = useState<NavPage>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [teacherName,    setTeacherName]    = useState("");
  const [teacherInitials,setTeacherInitials]= useState("");
  const [teacherPhoto,   setTeacherPhoto]   = useState<string | null>(null);

  // Fetch name immediately on login so sidebar never shows blank/Loading
  useEffect(() => {
    api.get('/users/me/').then(res => {
      const data = res.data;
      const name = data.display_name || data.first_name || data.username || "Teacher";
      const initials = name.substring(0, 2).toUpperCase();
      setTeacherName(name);
      setTeacherInitials(initials);
    }).catch(() => {});
  }, []);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <Dashboard setActive={setActive} setSelectedStudent={setSelectedStudent} />;
      case "students":  return <Students />;
      case "messages":  return <Messages selected={selectedStudent} setSelected={setSelectedStudent} />;
      case "broadcast": return <Broadcast />;
      case "messages":  return selectedStudent ? <Messages selected={selectedStudent} setSelected={setSelectedStudent} /> : <Dashboard setActive={setActive} setSelectedStudent={setSelectedStudent} />;
      case "livecc":    return <LiveCC />;
      case "settings":  return (
        <Settings
          teacherName={teacherName}
          teacherPhoto={teacherPhoto}
          onNameChange={(name, initials) => { setTeacherName(name); setTeacherInitials(initials); }}
          onPhotoChange={setTeacherPhoto}
        />
      );
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", background: C.bg, overflow: "hidden" }}>
      <Sidebar
        active={active}
        setActive={setActive}
        teacherName={teacherName}
        teacherInitials={teacherInitials}
        teacherPhoto={teacherPhoto}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar page={active} />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, background: "#F0F5F9" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};


// 2. This is the new Traffic Cop that protects the app!
const App: React.FC = () => {
  const { user } = useAuth(); // Check if the user is logged in

  return (
    <Routes>
      {/* If they are logged in, don't let them see the login page, push them to dashboard */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* If they are NOT logged in, don't let them see the dashboard, push them to login */}
      <Route path="/dashboard/*" element={user ? <DashboardLayout /> : <Navigate to="/login" />} />
      
      {/* Catch-all: Route anything else based on auth status */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default App;