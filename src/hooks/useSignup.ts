import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [error, setError]                     = useState("");

  const toggleShowPass    = () => setShowPass((v) => !v);
  const toggleShowConfirm = () => setShowConfirm((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      await signup({ fullName, email, password });
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
    error, onSubmit,
  };
};
