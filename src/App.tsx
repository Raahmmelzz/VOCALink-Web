import React, { useState } from "react";
import "./styles/global.css";
import { Colors as C } from "./styles/tokens";
import Sidebar   from "./components/layout/Sidebar";
import Topbar    from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Students  from "./pages/Students";
import Broadcast from "./pages/Broadcast";
import Messages  from "./pages/Messages";
import LiveCC    from "./pages/LiveCC";
import Settings  from "./pages/Settings";
import { STUDENTS } from "./data/mockData";
import type { NavPage } from "./types";
import type { Student } from "./types";

const App: React.FC = () => {
  const [active,          setActive]          = useState<NavPage>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student>(STUDENTS[0]);

  // ── Teacher profile state lifted here so Sidebar stays in sync ──
  const [teacherName,    setTeacherName]    = useState("Mrs. Teresa Reyes");
  const [teacherInitials,setTeacherInitials]= useState("TR");
  const [teacherPhoto,   setTeacherPhoto]   = useState<string | null>(null);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <Dashboard setActive={setActive} setSelectedStudent={setSelectedStudent} />;
      case "students":  return <Students />;
      case "broadcast": return <Broadcast />;
      case "messages":  return <Messages selected={selectedStudent} setSelected={setSelectedStudent} />;
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
        <main style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
