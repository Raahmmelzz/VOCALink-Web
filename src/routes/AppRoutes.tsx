import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ManageStudents from "../pages/students/ManageStudents";
import SpeechContexts from "../pages/tts/SpeechContexts";
import Profile from "../pages/profile/Profile";
import BoardConfig from "../components/layout/BoardConfig";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="students" element={<ManageStudents />} />
        <Route path="tts" element={<SpeechContexts />} />
        <Route path="boards" element={<BoardConfig />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}