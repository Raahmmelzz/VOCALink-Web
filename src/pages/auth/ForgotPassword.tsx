import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthBranding from "../../components/layout/AuthBranding";
import AuthFooter from "../../components/layout/AuthFooter";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPassword() {
  const [step, setStep]         = useState<Step>("email");
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const API = "https://vocalink-fastapi.onrender.com/api/auth";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send OTP.");
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP.");
      setStep("reset");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confPass) {
      setError("Passwords do not match.");
      return;
    }
    if (newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reset password.");
      setStep("done");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    // ── Step 1: Enter Email ──
    if (step === "email") return (
      <form onSubmit={handleSendOTP} className="form">
        <h2 className="form-title">Forgot Password</h2>
        <p className="form-desc">Enter your email and we'll send you a 6-digit OTP.</p>

        {error && <div className="alert">{error}</div>}

        <label className="label">Email Address</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoFocus
        />

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Sending OTP…" : "Send OTP"}
        </button>

        <p className="bottom-text">
          Remember your password? <Link to="/login">Sign In</Link>
        </p>
        <AuthFooter />
      </form>
    );

    // ── Step 2: Enter OTP ──
    if (step === "otp") return (
      <form onSubmit={handleVerifyOTP} className="form">
        <h2 className="form-title">Enter OTP</h2>
        <p className="form-desc">
          We sent a 6-digit code to <strong>{email}</strong>. Check your inbox.
        </p>

        {error && <div className="alert">{error}</div>}

        <label className="label">6-Digit OTP</label>
        <input
          className="input"
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          inputMode="numeric"
          maxLength={6}
          required
          autoFocus
          style={{ letterSpacing: 8, fontSize: 22, textAlign: "center" }}
        />

        <button className="primary-btn" type="submit" disabled={loading || otp.length < 6}>
          {loading ? "Verifying…" : "Verify OTP"}
        </button>

        <button
          type="button"
          className="link-btn"
          style={{ marginTop: 8, width: "100%", textAlign: "center" }}
          onClick={() => { setStep("email"); setOtp(""); setError(""); }}
        >
          ← Resend OTP
        </button>
        <AuthFooter />
      </form>
    );

    // ── Step 3: New Password ──
    if (step === "reset") return (
      <form onSubmit={handleResetPassword} className="form">
        <h2 className="form-title">New Password</h2>
        <p className="form-desc">Choose a strong new password for your account.</p>

        {error && <div className="alert">{error}</div>}

        <label className="label">New Password</label>
        <div className="input-wrap">
          <input
            className="input"
            type={showPass ? "text" : "password"}
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="At least 6 characters"
            required
            autoFocus
          />
          <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>
            {showPass ? "🙈" : "👁"}
          </button>
        </div>

        <label className="label">Confirm Password</label>
        <input
          className="input"
          type={showPass ? "text" : "password"}
          value={confPass}
          onChange={e => setConfPass(e.target.value)}
          placeholder="Re-enter new password"
          required
        />

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Resetting…" : "Reset Password"}
        </button>
        <AuthFooter />
      </form>
    );

    // ── Step 4: Done ──
    return (
      <div className="form">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 className="form-title">Password Reset!</h2>
          <p className="form-desc">
            Your password has been successfully reset. You can now sign in.
          </p>
          <Link to="/login">
            <button className="primary-btn" style={{ marginTop: 24, width: "100%" }}>
              Back to Sign In
            </button>
          </Link>
        </div>
        <AuthFooter />
      </div>
    );
  };

  // Step indicator
  const steps = ["Email", "OTP", "Reset", "Done"];
  const stepIndex = ["email", "otp", "reset", "done"].indexOf(step);

  return (
    <AuthLayout
      left={<AuthBranding description="Empowering people to connect with deaf and mute individuals through seamless communication." />}
      right={
        <div className="form-card">
          {/* Step indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i <= stepIndex ? "#1AADDC" : "#E5E7EB",
                  color: i <= stepIndex ? "#fff" : "#9CA3AF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i <= stepIndex ? "#1AADDC" : "#9CA3AF", fontWeight: 600 }}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div style={{ width: 20, height: 2, background: i < stepIndex ? "#1AADDC" : "#E5E7EB" }} />
                )}
              </div>
            ))}
          </div>

          {renderStep()}
        </div>
      }
    />
  );
}
