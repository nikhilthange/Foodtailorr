import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getAdminOrders({ limit: 50 });
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) return;
    try {
      await api.updateOrderStatus(orderId, newStatus, 'Admin update');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const statusColors = { 
    SUBMITTED: 'yellow', ACCEPTED: 'blue', COMPLETED: 'green', 
    CANCELLED: 'red', PENDING_PARTNER: 'yellow', PREPARING: 'purple', 
    CONFIRMED: 'green', REJECTED: 'red' 
  };

  const availableStatuses = ['SUBMITTED', 'PENDING_PARTNER', 'ACCEPTED', 'REJECTED', 'PREPARING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="admin-glass-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Order Management</h2>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontFamily: 'monospace' }}>{order.orderRef}</td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalAmount?.toLocaleString()}</td>
                <td>
                  <span className={`admin-badge admin-badge--${statusColors[order.status] || 'gray'}`}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <select 
                    className="admin-input" 
                    style={{ padding: '0.25rem', width: 'auto' }}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {availableStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
