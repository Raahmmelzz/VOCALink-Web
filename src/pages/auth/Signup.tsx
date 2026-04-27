import { Link } from "react-router-dom";
import { Colors as C, FontSize, Radius } from "../../styles/tokens";
import Icon from "../../components/ui/Icon";
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const {
    username, setUsername, // Changed from fullName
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPass, toggleShowPass,
    showConfirm, toggleShowConfirm,
    error, onSubmit,
  } = useSignup();

  return (
    <AuthLayout
      left={
        <AuthBranding description="Empowering people to connect with deaf and mute individuals through seamless communication." />
      }
      right={
        <div className="form-card">
          <h2 className="form-title">Create Account</h2>
          <p className="form-desc">Sign up to get started with VocaLink</p>

          {error && (
            <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '12px 16px', borderRadius: Radius.md, fontSize: FontSize.sm, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="form">
  
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username (no spaces)"
              autoComplete="username"
              required
            />

            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <label className="label">Set Password</label>
            <div className="input-wrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
                autoComplete="new-password"
                required
              />
              <button type="button" className="eye" onClick={toggleShowPass} aria-label="Toggle password">
                <EyeIcon open={showPass} />
              </button>
            </div>

            <label className="label">Confirm Password</label>
            <div className="input-wrap">
              <input
                className="input"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
              />
              <button type="button" className="eye" onClick={toggleShowConfirm} aria-label="Toggle confirm password">
                <EyeIcon open={showConfirm} />
              </button>
            </div>

            <button className="primary-btn" type="submit">Sign Up</button>

            <p className="bottom-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>

            <AuthFooter />
          </form>

          <div style={{ textAlign: 'center', marginTop: 32, fontSize: FontSize.sm, color: C.text3 }}>
            Already have an account? <Link to="/login" style={{ color: C.teal, textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 11, color: '#A9A7A1' }}>
            © 2026 VocaLink v1.0.0<br/>Designed for Deaf & Mute Individuals
          </div>

        </div>
      </div>
    </div>
  );
}