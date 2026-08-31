import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, ShoppingBag, Utensils, Brain, DollarSign } from 'lucide-react';
import { api } from '../../../lib/apiClient';

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error('Dashboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const statusColors = { 
    SUBMITTED: 'yellow', ACCEPTED: 'blue', COMPLETED: 'green', 
    CANCELLED: 'red', PENDING_PARTNER: 'yellow', PREPARING: 'purple', 
    CONFIRMED: 'green', REJECTED: 'red' 
  };

  if (loading) {
    return <div style={{ color: 'var(--admin-text-secondary)' }}>Loading dashboard...</div>;
  }

  const stats = dashboard?.stats || {};

  return (
    <div>
      <div className="admin-card-header">
        <h2 className="admin-card-title">Dashboard Overview</h2>
      </div>

      <div className="admin-grid admin-grid-cols-3" style={{ marginBottom: '2rem' }}>
        {[
          { icon: <Users size={24} />, value: stats.totalUsers, label: 'Customers', color: '#3B82F6' },
          { icon: <Building2 size={24} />, value: stats.totalPartners, label: 'Partners', color: '#8B5CF6' },
          { icon: <ShoppingBag size={24} />, value: stats.totalOrders, label: 'Total Orders', color: '#F59E0B' },
          { icon: <Utensils size={24} />, value: stats.totalDishes, label: 'Dishes in Catalog', color: '#10B981' },
          { icon: <Brain size={24} />, value: stats.totalRecommendations, label: 'AI Recommendations', color: '#EC4899' },
          { icon: <DollarSign size={24} />, value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, label: 'Total Revenue', color: '#EF4444' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            className="admin-glass-card" 
            style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.05 * i }}
          >
            <div style={{ background: s.color + '20', color: s.color, padding: '0.75rem', borderRadius: '8px', display: 'flex' }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-glass-card">
        <h2 className="admin-card-title" style={{ marginBottom: '1rem' }}>Recent Orders</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.recentOrders || []).map(order => (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-text-secondary)' }}>{order.orderRef}</td>
                  <td>{order.user?.firstName} {order.user?.lastName}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${statusColors[order.status] || 'gray'}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>₹{order.totalAmount?.toLocaleString()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--admin-text-secondary)', padding: '2rem' }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
