import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

// Import your new components here:
import ManageStudents from "../pages/students/ManageStudents";
import SpeechContexts from "../pages/tts/SpeechContexts";

// A temporary component for the main dashboard landing page until you create it
const DashboardOverview = () => (
  <div style={{ background: "#fff", padding: 20, borderRadius: 14 }}>
    <h2>Overview</h2>
    <p>Select an option from the menu.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* The Dashboard Parent Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* These routes will inject into the <Outlet /> in your Dashboard */}
        <Route index element={<DashboardOverview />} /> 
        <Route path="students" element={<ManageStudents />} />
        <Route path="tts" element={<SpeechContexts />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}