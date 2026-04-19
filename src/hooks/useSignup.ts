import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useAuth } from "../context/AuthContext"; // Path adjusted for hooks folder
=======
import { useAuth } from "../context/AuthContext";
>>>>>>> 50a0724 (with login)

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

<<<<<<< HEAD
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPass = () => setShowPass((v) => !v);
=======
  const [fullName, setFullName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [error, setError]                     = useState("");

  const toggleShowPass    = () => setShowPass((v) => !v);
  const toggleShowConfirm = () => setShowConfirm((v) => !v);
>>>>>>> 50a0724 (with login)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
<<<<<<< HEAD
    try {
      await signup({ username, email, password });
      navigate("/login");
=======
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
>>>>>>> 50a0724 (with login)
    } catch (err: any) {
      setError(err?.message || "Signup failed.");
    }
  };

  return {
<<<<<<< HEAD
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
=======
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPass, toggleShowPass,
    showConfirm, toggleShowConfirm,
    error, onSubmit,
  };
};
>>>>>>> 50a0724 (with login)
