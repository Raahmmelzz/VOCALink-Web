import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthBranding from "../../components/layout/AuthBranding";
import AuthFooter from "../../components/layout/AuthFooter";
import { useSignup } from "../../hooks/useSignup"; // Importing from your new hooks folder

export default function Signup() {
  const {
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
  } = useSignup();

  return (
    <AuthLayout
      left={
        <AuthBranding description="Empowering people to connect with deaf and mute individuals through seamless communication." />
      }
      right={
        <div className="form-card">
          <h2 className="form-title">Create Account</h2>
          <p className="form-desc">Sign up to access your dashboard</p>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={onSubmit} className="form">
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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

            <label className="label">Password</label>
            <div className="input-wrap">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
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

            <button className="primary-btn" type="submit">
              Sign Up
            </button>

            <p className="bottom-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>

            <AuthFooter />
          </form>
        </div>
      }
    />
  );
}