import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Path adjusted for hooks folder

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPass = () => setShowPass((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signup({ username, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Signup failed.");
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    showPass,
    toggleShowPass,
    error,
    onSubmit,
  };
};