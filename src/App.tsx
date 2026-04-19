<<<<<<< HEAD
  import AppRoutes from "./routes/AppRoutes";

  export default function App() {
    return <AppRoutes />;
  } 
=======
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/auth.css";
import { Colors as C } from "./styles/tokens";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Broadcast from "./pages/Broadcast";
import Messages from "./pages/Messages";
import LiveCC from "./pages/LiveCC";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import { STUDENTS } from "./data/mockData";
import type { NavPage } from "./types";
import type { Student } from "./types";

const MainApp: React.FC = () => {
  const [active, setActive] = useState<NavPage>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student>(STUDENTS[0]);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <Dashboard setActive={setActive} setSelectedStudent={setSelectedStudent} />;
      case "students":  return <Students />;
      case "broadcast": return <Broadcast />;
      case "messages":  return <Messages selected={selectedStudent} setSelected={setSelectedStudent} />;
      case "livecc":    return <LiveCC />;
      default:          return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", background: C.bg, overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar page={active} />
        <main style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      />
      {/* Catch-all: redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
>>>>>>> 50a0724 (with login)
