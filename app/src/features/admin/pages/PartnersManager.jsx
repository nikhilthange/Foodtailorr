import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function PartnersManager() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await api.getAdminPartners({ limit: 50 });
      setPartners(data.partners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePartner = async (partnerId, approve) => {
    const action = approve ? 'Approve' : 'Revoke';
    if (!window.confirm(`${action} this partner?`)) return;
    try {
      await api.updateAdminPartner(partnerId, { isApproved: approve });
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, isApproved: approve } : p));
    } catch (err) {
      alert(`Failed to ${action.toLowerCase()} partner`);
    }
  };

  if (loading) return <div>Loading partners...</div>;

  return (
    <div className="admin-glass-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Partner Management</h2>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Owner Email</th>
              <th>Cuisine</th>
              <th>Dishes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id}>
                <td><strong>{p.businessName}</strong></td>
                <td style={{ color: 'var(--admin-text-secondary)' }}>{p.user?.email}</td>
                <td>{p.cuisine}</td>
                <td>{p._count?.dishes || 0}</td>
                <td>
                  <span className={`admin-badge ${p.isApproved ? 'admin-badge--green' : 'admin-badge--yellow'}`}>
                    {p.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  {!p.isApproved ? (
                    <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => handleApprovePartner(p.id, true)}>Approve</button>
                  ) : (
                    <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleApprovePartner(p.id, false)}>Revoke</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
