import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import AuthLayout from '../../components/auth/AuthLayout';
import GlassCard from '../../components/auth/GlassCard';
import { PasswordInput, AuthButton } from '../../components/auth/FormInputs';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !userId) {
      setStatus({ type: 'error', message: 'Invalid or missing password reset token.' });
    }
  }, [token, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !userId) return;
    
    setStatus({ type: '', message: '' });

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const res = await api.resetPassword({ userId, token, password });
      setStatus({ type: 'success', message: res.message || 'Password successfully reset.' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setStatus({ type: 'error', message: err.error || err.message || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard>
        <div className="glass-card__header">
          <Link to="/" className="glass-card__brand">FOOD TAILÖR</Link>
          <h2 className="glass-card__title">Create New Password</h2>
          <p className="glass-card__subtitle">Please enter your new password below.</p>
        </div>

        {status.message && (
          <div className={status.type === 'error' ? 'auth-error-banner' : 'auth-success-banner'}>
            <span>{status.type === 'error' ? '⚠' : '✓'}</span> {status.message}
          </div>
        )}

        {token && userId && (
          <form onSubmit={handleSubmit}>
            <PasswordInput
              id="reset-pass"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            
            <PasswordInput
              id="reset-confirm"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />

            <AuthButton type="submit" loading={loading} disabled={status.type === 'success'}>
              {status.type === 'success' ? 'Redirecting...' : 'Reset Password'}
            </AuthButton>
          </form>
        )}

        <div className="auth-divider"></div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-secondary)' }}>
            <Link to="/login" className="auth-link">Return to Sign in</Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
