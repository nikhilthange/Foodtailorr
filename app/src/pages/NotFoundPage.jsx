import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import GlassCard from '../components/auth/GlassCard';

export default function NotFoundPage() {
  return (
    <AuthLayout>
      <GlassCard>
        <div className="glass-card__header">
          <h2 className="glass-card__title">404</h2>
          <p className="glass-card__subtitle">We couldn't find the page you're looking for.</p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
          <Link to="/" className="auth-button" style={{ textDecoration: 'none' }}>
            Return Home
          </Link>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
