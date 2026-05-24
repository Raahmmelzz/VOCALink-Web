import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [loadingMsg,      setLoadingMsg]      = useState("Creating account…");
  const [success,         setSuccess]         = useState("");

  const toggleShowPass    = () => setShowPass(v => !v);
  const toggleShowConfirm = () => setShowConfirm(v => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!username.trim())                          { setError("Username is required."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6)                       { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword)              { setError("Passwords do not match."); return; }

    setLoading(true);
    setLoadingMsg("Creating account…");

    // Warn user if it's taking long (Render cold start)
    const slowTimer = setTimeout(() => {
      setLoadingMsg("Still working… server is waking up (up to 60s)");
    }, 8000);

    try {
      const result: any = await signup({ username, email, password, status: "TEACHER" });
      clearTimeout(slowTimer);

      setSuccess(result?.email_sent
        ? "Account created! Check your email for the verification code."
        : "Account created! Redirecting to verify your email…"
      );
      setTimeout(() => {
        const params = new URLSearchParams({ email });
        if (result?.debug_code) params.set("code", result.debug_code);
        navigate(`/verify-email?${params.toString()}`);
      }, 1200);
    } catch (err: any) {
      clearTimeout(slowTimer);
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMsg("Creating account…");
    }
  };

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPass, toggleShowPass,
    showConfirm, toggleShowConfirm,
    error, loading, loadingMsg, success, onSubmit,
  };
};
