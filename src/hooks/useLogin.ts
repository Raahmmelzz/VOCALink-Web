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

  const toggleShowPass = () => setShowPass((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Clear old errors when they try again
    
    try {
      // 1. Send the data to your AuthContext
      await login({ identifier, password, remember });
      
      // 2. If the Teacher Bouncer lets them through, send them to the dashboard!
      navigate("/dashboard");
      
    } catch (err: any) {
      // 3. If the Bouncer blocks them (e.g., they are a Student), display the rejection message
      setError(err?.message || "Invalid email or password.");
    }
  };

  return { 
    identifier, setIdentifier, 
    password, setPassword, 
    remember, setRemember, 
    showPass, toggleShowPass, 
    error, onSubmit 
  };
};