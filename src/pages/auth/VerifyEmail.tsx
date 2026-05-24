import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout   from "../../components/layout/AuthLayout";
import AuthBranding from "../../components/layout/AuthBranding";
import AuthFooter   from "../../components/layout/AuthFooter";

const API = "https://vocalink-fastapi.onrender.com/api/auth";

export default function VerifyEmail() {
  const [params]    = useSearchParams();
  const navigate    = useNavigate();
  const email       = params.get("email") || "";
  const [code, setCode]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/verify-email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed.");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      left={<AuthBranding description="Empowering teachers to connect with nonverbal students through seamless communication." />}
      right={
        <div className="form-card">
          <h2 className="form-title">Verify Your Email</h2>
          <p className="form-desc">
            We sent a 6-digit code to <strong style={{ wordBreak: "break-all" }}>{email || "your email"}</strong>.
            Enter it below to activate your account.
          </p>

          {error && <div className="alert">{error}</div>}

          {done ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <p className="form-desc">Email verified! You can now sign in.</p>
              <button className="primary-btn" style={{ marginTop: 20, width: "100%" }} onClick={() => navigate("/login")}>
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="form">
              <label className="label">Verification Code</label>
              <input
                className="input"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                style={{ fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: 10 }}
              />
              <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", margin: "4px 0 0" }}>
                Code expires in 30 minutes
              </p>

              <button
                className="primary-btn"
                type="submit"
                disabled={loading || code.length < 6}
                style={{ marginTop: 20 }}
              >
                {loading ? "Verifying…" : "Verify Email"}
              </button>

              <p className="bottom-text">
                Wrong email? <Link to="/signup">Sign up again</Link>
              </p>
              <AuthFooter />
            </form>
          )}
        </div>
      }
    />
  );
}
