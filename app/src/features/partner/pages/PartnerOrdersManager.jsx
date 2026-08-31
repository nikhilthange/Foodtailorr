import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/apiClient';

export default function PartnerOrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getPartnerOrders({ limit: 50 });
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
      await api.updateOrderStatus(orderId, newStatus, 'Partner update');
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

  const availableStatuses = ['PENDING_PARTNER', 'ACCEPTED', 'REJECTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="partner-glass-card">
      <div className="partner-card-header">
        <h2 className="partner-card-title">Order Management</h2>
      </div>
      
      <div className="partner-table-wrap">
        <table className="partner-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Your Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const partnerTotal = order.items?.reduce((acc, curr) => acc + curr.totalPrice, 0) || 0;
              return (
                <tr key={order.id}>
                  <td style={{ fontFamily: 'monospace' }}>{order.orderRef}</td>
                  <td>{order.user?.firstName} {order.user?.lastName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{partnerTotal.toLocaleString()}</td>
                  <td>
                    <span className={`partner-badge partner-badge--${statusColors[order.status] || 'gray'}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="partner-input" 
                      style={{ padding: '0.25rem', width: 'auto' }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value={order.status}>{order.status}</option>
                      {availableStatuses.filter(s => s !== order.status).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--partner-text-secondary)' }}>
                  You have no orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
