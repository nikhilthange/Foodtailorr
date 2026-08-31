import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import AuthLayout from '../../components/auth/AuthLayout';
import GlassCard from '../../components/auth/GlassCard';
import { TextInput, AuthButton } from '../../components/auth/FormInputs';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const res = await api.forgotPassword({ email });
      setStatus({ type: 'success', message: res.message || 'Password reset link sent.' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: err.error || err.message || 'Failed to send reset link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard>
        <div className="glass-card__header">
          <Link to="/" className="glass-card__brand">FOOD TAILÖR</Link>
          <h2 className="glass-card__title">Reset Password</h2>
          <p className="glass-card__subtitle">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {status.message && (
          <div className={status.type === 'error' ? 'auth-error-banner' : 'auth-success-banner'}>
            <span>{status.type === 'error' ? '⚠' : '✓'}</span> {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            id="reset-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <AuthButton type="submit" loading={loading}>
            Send Reset Link
          </AuthButton>
        </form>

        <div className="auth-divider"></div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-secondary)' }}>
            Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
