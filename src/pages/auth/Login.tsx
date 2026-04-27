import React, { useState } from 'react';
import { Colors as C, FontSize, Radius } from '../../styles/tokens';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import Icon from '../../components/ui/Icon'; // Assuming you have this from Settings

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ identifier: email, password, remember: rememberMe });
      // Redirect happens in AuthContext or App router!
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: C.white, fontFamily: 'inherit' }}>
      
      {/* ── LEFT SIDE: Branding (Dashboard Style) ── */}
      <div style={{ 
        flex: 1, 
        background: '#E6F0EE', // Soft mint/teal off-white from your dashboard
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2, textAlign: 'center', maxWidth: 400 }}>
          {/* Dashboard Logo Style */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Icon name="mic" size={20} color={C.white} /> {/* Replace with your circle icon */}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: C.text, margin: 0 }}>VocaLink</h1>
          </div>
          
          <p style={{ fontSize: FontSize.md, color: C.text3, lineHeight: 1.6 }}>
            Empowering people to connect with deaf and mute individuals through seamless communication.
          </p>
        </div>

        {/* Optional: Add your collage images here, but perhaps give them a subtle opacity or blend mode so they don't overpower the soft teal background */}
      </div>

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
          
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 8, marginTop: 0 }}>Welcome Back</h2>
          <p style={{ fontSize: FontSize.sm, color: C.text3, marginBottom: 32 }}>Sign in to access your dashboard</p>

          {error && (
            <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '12px 16px', borderRadius: Radius.md, fontSize: FontSize.sm, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Email Input */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Email</label>
              <input 
                type="text" 
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', fontSize: FontSize.sm, color: C.text, fontWeight: 500, marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', fontSize: FontSize.sm, color: C.text, background: C.white, border: `1px solid #E2E0DC`, borderRadius: Radius.md, padding: '12px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: C.text3 }}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {/* Utilities Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: FontSize.sm, color: C.text3, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: C.teal }} 
                />
                Remember me
              </label>
              <a href="#" style={{ fontSize: FontSize.sm, color: C.teal, textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
            </div>

            {/* Login Button */}
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
                marginTop: 8,
                transition: 'background 0.2s'
              }}
            >
              Login
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 32, fontSize: FontSize.sm, color: C.text3 }}>
            Don't have an account? <a href="#/signup" style={{ color: C.teal, textDecoration: 'none', fontWeight: 600 }}>Sign Up</a>
          </div>

        </div>
      </div>
    </div>
  );
<<<<<<< Updated upstream
}
=======
};

export default Login;
>>>>>>> Stashed changes
