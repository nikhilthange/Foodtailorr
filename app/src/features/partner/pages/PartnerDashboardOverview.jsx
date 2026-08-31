import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { api } from '../../../lib/apiClient';

export default function PartnerDashboardOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPartnerDashboard()
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
    return <div style={{ color: 'var(--partner-text-secondary)' }}>Loading dashboard...</div>;
  }

  const stats = dashboard?.stats || {};

  return (
    <div>
      <div className="partner-card-header">
        <h2 className="partner-card-title">Welcome back, {dashboard?.partner?.businessName}</h2>
      </div>

      <div className="partner-grid partner-grid-cols-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: <Clock size={24} />, value: stats.pendingOrders || 0, label: 'Pending Orders', color: '#F59E0B' },
          { icon: <ShoppingBag size={24} />, value: stats.totalOrders || 0, label: 'Total Orders', color: '#3B82F6' },
          { icon: <Utensils size={24} />, value: stats.activeDishes || 0, label: 'Active Dishes', color: '#10B981' },
          { icon: <TrendingUp size={24} />, value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, label: 'Total Revenue', color: '#EF4444' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            className="partner-glass-card" 
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
              <div style={{ fontSize: '0.85rem', color: 'var(--partner-text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="partner-glass-card">
        <h2 className="partner-card-title" style={{ marginBottom: '1rem' }}>Recent Orders</h2>
        <div className="partner-table-wrap">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items Ordered</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.recentOrders || []).map(order => {
                const itemCount = order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
                return (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--partner-text-secondary)' }}>{order.orderRef}</td>
                    <td>{order.user?.firstName} {order.user?.lastName}</td>
                    <td>
                      <span className={`partner-badge partner-badge--${statusColors[order.status] || 'gray'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{itemCount} item(s)</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
              {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--partner-text-secondary)', padding: '2rem' }}>
                    You're all caught up — no orders yet.
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
