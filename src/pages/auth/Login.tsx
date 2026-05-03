import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthBranding from "../../components/layout/AuthBranding";
<<<<<<< Updated upstream
import AuthFooter from "../../components/layout/AuthFooter";
import { useLogin } from "../../hooks/useLogin"; // Import the custom hook

export default function Login() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    remember,
    setRemember,
    showPass,
    toggleShowPass,
    error,
    onSubmit,
=======
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const {
    identifier, setIdentifier,
    password, setPassword,
    remember, setRemember,
    showPass, toggleShowPass,
    error, loading, onSubmit,
>>>>>>> Stashed changes
  } = useLogin();

  return (
    <AuthLayout
      left={
        <AuthBranding description="Empowering teachers to support nonverbal students through seamless communication." />
      }
      right={
        <div className="form-card">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-desc">Sign in to access your dashboard</p>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={onSubmit} className="form">
            <label className="label">Username or Email</label>
            <input
              className="input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your username or email"
              autoComplete="username"
              required
            />

            <label className="label">Password</label>
            <div className="input-wrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={toggleShowPass}
              >
                👁
              </button>
            </div>

            <div className="row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="link-btn" 
                onClick={() => alert("Reset flow coming soon!")}
              >
                Forgot Password?
              </button>
            </div>

<<<<<<< Updated upstream
            <button className="primary-btn" type="submit">Sign In</button>
=======
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Logging in…
                </span>
              ) : "Login"}
            </button>
>>>>>>> Stashed changes

            <p className="bottom-text">
              Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      }
    />
  );
}