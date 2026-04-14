import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure this path is correct!

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  // Grab the 'token' we created in AuthContext instead of 'user'
  const { token } = useAuth(); 

  // If there is no token in storage, kick them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If they have the token VIP pass, let them see the dashboard!
  return <>{children}</>;
}