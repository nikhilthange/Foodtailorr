import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { api } from '../../lib/apiClient';
import { useAuth } from '../auth/AuthContext';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName
      });
      await checkAuth(); // Refresh user context
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: 800 }}>
        
        <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dashboard-header__left">
            <h1 className="dashboard-header__title">Your Profile</h1>
            <p className="dashboard-header__subtitle">Manage your personal information and preferences.</p>
          </div>
        </motion.div>

        <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Personal Information</h2>
          </div>
          <div className="dashboard-card__body">
            
            {message && (
              <div style={{ padding: '1rem', background: 'var(--support-success-light, rgba(16, 185, 129, 0.1))', color: '#10B981', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> {message}
              </div>
            )}
            
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dark-secondary)', fontSize: '0.9rem' }}>First Name</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark-muted)' }}>
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={form.firstName} 
                      onChange={e => setForm({...form, firstName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'var(--ft-dark-elevated)', border: '1px solid var(--color-border-dark)', color: 'var(--text-dark)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dark-secondary)', fontSize: '0.9rem' }}>Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark-muted)' }}>
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={form.lastName} 
                      onChange={e => setForm({...form, lastName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'var(--ft-dark-elevated)', border: '1px solid var(--color-border-dark)', color: 'var(--text-dark)', borderRadius: 'var(--radius-md)' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dark-secondary)', fontSize: '0.9rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark-muted)' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={form.email} 
                    disabled
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border-dark)', color: 'var(--text-dark-muted)', borderRadius: 'var(--radius-md)', cursor: 'not-allowed' }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', marginTop: '0.5rem' }}>Email address cannot be changed. Contact support if you need assistance.</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} className="dashboard-btn dashboard-btn--primary" style={{ minWidth: '150px' }}>
                  {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
