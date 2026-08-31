import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import GlassCard from '../../components/auth/GlassCard';
import { TextInput, PasswordInput, AuthButton } from '../../components/auth/FormInputs';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'PARTNER') navigate('/partner/dashboard', { replace: true });
      else navigate(from !== '/login' && from !== '/register' ? from : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard>
        <div className="glass-card__header">
          <Link to="/" className="glass-card__brand">FOOD TAILÖR</Link>
          <h2 className="glass-card__title">Welcome Back</h2>
          <p className="glass-card__subtitle">Sign in to continue crafting your perfect event.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            id="login-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '16px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-dark-secondary)', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" loading={loading}>
            Sign In
          </AuthButton>
        </form>

        <div className="auth-divider">OR</div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-secondary)' }}>
            Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>

        {/* Developer Demo Accounts (Hidden in details tag) */}
        <div className="auth-demo-badge">
          <details>
            <summary>View Demo Credentials</summary>
            <div className="auth-demo-grid">
              <button type="button" className="auth-demo-btn" onClick={() => { setEmail('admin@foodtailor.in'); setPassword('password123'); }}>
                <span className="auth-demo-role">Admin</span>
                <span>admin@foodtailor.in</span>
              </button>
              <button type="button" className="auth-demo-btn" onClick={() => { setEmail('test@foodtailor.in'); setPassword('password123'); }}>
                <span className="auth-demo-role">Customer</span>
                <span>test@foodtailor.in</span>
              </button>
              <button type="button" className="auth-demo-btn" onClick={() => { setEmail('partner1@foodtailor.in'); setPassword('password123'); }}>
                <span className="auth-demo-role">Partner</span>
                <span>partner1@foodtailor.in</span>
              </button>
            </div>
          </details>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
