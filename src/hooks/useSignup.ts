import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPass = () => setShowPass((v) => !v);
  const toggleShowConfirm = () => setShowConfirm((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // We removed the status state, and just hardcode it here!
      await signup({ 
        fullName,
        email, 
        password,
        status: "TEACHER" 
      });
      
      navigate("/login?registered=1");
    } catch (err: any) {
      setError(err?.message || "Signup failed.");
    }
  };

  return { 
    fullName, setFullName, 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    showPass, toggleShowPass, 
    showConfirm, toggleShowConfirm, 
    error, onSubmit 
  };
};