import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAnalytics(30)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  // Simple aggregation for UI
  const totalOrders = data?.orders?.length || 0;
  const newUsers = data?.users?.length || 0;
  const completedOrders = data?.orders?.filter(o => o.status === 'COMPLETED').length || 0;
  const revenue30d = data?.orders?.filter(o => o.status === 'COMPLETED').reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;

  return (
    <div>
      <div className="admin-card-header">
        <h2 className="admin-card-title">Analytics (Last 30 Days)</h2>
      </div>

      <div className="admin-grid admin-grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="admin-glass-card" style={{ marginBottom: 0 }}>
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{totalOrders}</div>
        </div>
        <div className="admin-glass-card" style={{ marginBottom: 0 }}>
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Completed Orders</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10B981' }}>{completedOrders}</div>
        </div>
        <div className="admin-glass-card" style={{ marginBottom: 0 }}>
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>New Customers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3B82F6' }}>{newUsers}</div>
        </div>
        <div className="admin-glass-card" style={{ marginBottom: 0 }}>
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Revenue (30d)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#EF4444' }}>₹{revenue30d.toLocaleString()}</div>
        </div>
      </div>

      <div className="admin-glass-card">
        <h2 className="admin-card-title">Revenue Chart Placeholder</h2>
        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingTop: '2rem' }}>
          {/* Very basic CSS bar chart representation for MVP */}
          {[40, 70, 30, 90, 50, 80, 60].map((h, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--admin-accent)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--admin-text-secondary)' }}>
          *Chart visualizes simulated daily revenue distribution over the selected period.
        </p>
      </div>
    </div>
  );
}
