import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import GlassCard from '../../components/auth/GlassCard';
import { TextInput, PasswordInput, AuthButton } from '../../components/auth/FormInputs';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    businessName: '',
    cuisine: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.role === 'PARTNER' && !form.businessName) {
      setError('Business name is required for partner registration');
      return;
    }

    setLoading(true);
    try {
      const data = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
      };
      if (form.role === 'PARTNER') {
        data.businessName = form.businessName;
        data.cuisine = form.cuisine || 'General';
      }

      const user = await register(data);
      if (user.role === 'PARTNER') navigate('/partner/dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard>
        <div className="glass-card__header">
          <Link to="/" className="glass-card__brand">FOOD TAILÖR</Link>
          <h2 className="glass-card__title">Create Account</h2>
          <p className="glass-card__subtitle">Join Food Tailor to curate perfect event menus.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-toggle__btn ${form.role === 'CUSTOMER' ? 'auth-role-toggle__btn--active' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, role: 'CUSTOMER' }))}
            >
              Customer
            </button>
            <button
              type="button"
              className={`auth-role-toggle__btn ${form.role === 'PARTNER' ? 'auth-role-toggle__btn--active' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, role: 'PARTNER' }))}
            >
              Partner
            </button>
          </div>

          <div className="auth-input-row">
            <TextInput id="reg-fname" label="First Name" value={form.firstName} onChange={updateField('firstName')} required />
            <TextInput id="reg-lname" label="Last Name" value={form.lastName} onChange={updateField('lastName')} required />
          </div>

          <TextInput id="reg-email" label="Email Address" type="email" value={form.email} onChange={updateField('email')} required />

          {form.role === 'PARTNER' && (
            <div className="auth-input-row">
              <TextInput id="reg-business" label="Business Name" value={form.businessName} onChange={updateField('businessName')} required />
              <TextInput id="reg-cuisine" label="Cuisine Type" value={form.cuisine} onChange={updateField('cuisine')} placeholder="e.g. Hyderabadi" />
            </div>
          )}

          <div className="auth-input-row">
            <PasswordInput id="reg-pass" label="Password" value={form.password} onChange={updateField('password')} required minLength={8} />
            <PasswordInput id="reg-confirm" label="Confirm Password" value={form.confirmPassword} onChange={updateField('confirmPassword')} required minLength={8} />
          </div>

          <AuthButton type="submit" loading={loading}>
            {form.role === 'PARTNER' ? 'Register as Partner' : 'Create Account'}
          </AuthButton>
        </form>

        <div className="auth-divider">OR</div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-secondary)' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
