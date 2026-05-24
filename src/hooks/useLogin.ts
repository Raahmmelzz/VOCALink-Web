import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleShowPass = () => setShowPass((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Send the data to your AuthContext
      await login({ identifier, password, remember });
      
      // 2. If the Teacher Bouncer lets them through, send them to the dashboard!
      navigate("/dashboard");
      
    } catch (err: any) {
      const detail = err?.message || "";
      if (detail === "EMAIL_NOT_VERIFIED") {
        navigate(`/verify-email?email=${encodeURIComponent(identifier)}`);
        return;
      }
      setError(detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return { 
    identifier, setIdentifier, 
    password, setPassword, 
    remember, setRemember, 
    showPass, toggleShowPass,
    error, loading, onSubmit
  };
};