import { Link } from "react-router-dom";
<<<<<<< HEAD
import { Colors as C, FontSize, Radius } from "../../styles/tokens";
import Icon from "../../components/ui/Icon";
=======
import AuthLayout from "../../components/layout/AuthLayout";
import AuthBranding from "../../components/layout/AuthBranding";
import AuthFooter from "../../components/layout/AuthFooter";
>>>>>>> 2cdfbb9e567e567c731161b1516c2680445bbf47
import { useSignup } from "../../hooks/useSignup";

export default function Signup() {
  const {
<<<<<<< HEAD
    username, setUsername, 
=======
    username, setUsername, // Changed from fullName
>>>>>>> 2cdfbb9e567e567c731161b1516c2680445bbf47
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPass, toggleShowPass,
    showConfirm, toggleShowConfirm,
    error, onSubmit,
  } = useSignup();

  const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  return (
<<<<<<< HEAD
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: C.white, fontFamily: 'inherit' }}>
      
      {/* ── LEFT SIDE: Branding (Dashboard Style) ── */}
      <div style={{ 
        flex: 1, 
        background: '#E6F0EE', // Soft mint/teal off-white
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Icon name="mic" size={20} color={C.white} /> 
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: 0 }}>VocaLink</h1>
          </div>
          
          <p style={{ fontSize: FontSize.md, color: C.text3, lineHeight: 1.6 }}>
            Empowering people to connect with deaf and mute individuals through seamless communication.
          </p>
        </div>
      </div>
=======
    <AuthLayout
      left={
        <AuthBranding description="Empowering people to connect with deaf and mute individuals through seamless communication." />
      }
      right={
        <div className="form-card">
          <h2 className="form-title">Create Account</h2>
          <p className="form-desc">Sign up to get started with VocaLink</p>
>>>>>>> 2cdfbb9e567e567c731161b1516c2680445bbf47

      {/* ── RIGHT SIDE: The Form ── */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 10%',
        background: C.white
      }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 8, marginTop: 0 }}>Create Account</h2>
          <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 32 }}>Sign up to get started with VocaLink</p>

<<<<<<< HEAD
          {error && (
            <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '12px 16px', borderRadius: Radius.md, fontSize: FontSize.sm, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
  
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username (no spaces)"
                autoComplete="username"
=======
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
>>>>>>> 2cdfbb9e567e567c731161b1516c2680445bbf47
                required
                style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
<<<<<<< HEAD
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Set Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  autoComplete="new-password"
                  required
                  style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={toggleShowPass} style={{ position: 'absolute', right: 14, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: C.text3 }}>
                  <Icon name={showPass ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={toggleShowConfirm} style={{ position: 'absolute', right: 14, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: C.text3 }}>
                  <Icon name={showConfirm ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: C.teal, 
                color: C.white, 
                border: 'none', 
                borderRadius: Radius.md, 
                fontSize: FontSize.md, 
                fontWeight: 600, 
                cursor: 'pointer', 
                marginTop: 12,
                transition: 'background 0.2s'
              }}
            >
              Sign Up
            </button>
=======
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
>>>>>>> 2cdfbb9e567e567c731161b1516c2680445bbf47

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
