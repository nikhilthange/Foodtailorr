import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function PartnerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.getMe()
      .then(async (data) => {
        // Assume getMe returns the user info, but we also want the partner profile
        const p = await api.getPartnerDashboard(); // Or a specific profile endpoint
        setProfile(p.partner);
        setFormData({
          businessName: p.partner.businessName,
          cuisine: p.partner.cuisine,
          description: p.partner.description || '',
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { apiFetch } = await import('../../../lib/apiClient');
      await apiFetch('/partner/profile', {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      alert('Profile updated successfully');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="partner-glass-card" style={{ maxWidth: '800px' }}>
      <div className="partner-card-header">
        <h2 className="partner-card-title">Business Profile</h2>
        <span className={`partner-badge ${profile?.isApproved ? 'partner-badge--green' : 'partner-badge--yellow'}`}>
          {profile?.isApproved ? 'Approved Partner' : 'Approval Pending'}
        </span>
      </div>
      
      <form onSubmit={handleSave}>
        <div className="partner-grid partner-grid-cols-2">
          <div className="partner-form-group">
            <label className="partner-label">Business Name</label>
            <input className="partner-input" value={formData.businessName || ''} onChange={e => setFormData({...formData, businessName: e.target.value})} />
          </div>
          <div className="partner-form-group">
            <label className="partner-label">Primary Cuisine</label>
            <input className="partner-input" value={formData.cuisine || ''} onChange={e => setFormData({...formData, cuisine: e.target.value})} />
          </div>
          <div className="partner-form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="partner-label">Business Description</label>
            <textarea className="partner-textarea" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
        </div>
        <button type="submit" className="partner-btn partner-btn--primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
