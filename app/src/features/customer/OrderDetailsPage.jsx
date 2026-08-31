import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, ChefHat, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { api } from '../../lib/apiClient';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(id)
      .then(setOrder)
      .catch(err => {
        console.error(err);
        navigate('/dashboard'); // fallback
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="dashboard-page"><div className="dashboard-empty">Loading order...</div></div>;
  if (!order) return null;

  const statusColors = {
    SUBMITTED: '#F59E0B', PENDING_PARTNER: '#F59E0B', ACCEPTED: '#3B82F6',
    PREPARING: '#8B5CF6', READY_FOR_PICKUP: '#10B981', COMPLETED: '#10B981',
    CANCELLED: '#EF4444', REJECTED: '#EF4444', DRAFT: '#6B7280',
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dashboard-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-dark)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>Order {order.orderRef}</h1>
              <p style={{ color: 'var(--text-dark-secondary)', margin: 0 }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
            <span className="dashboard-status" style={{ color: statusColors[order.status] || '#fff', background: `${statusColors[order.status] || '#ffffff'}15`, padding: '0.5rem 1rem', fontSize: '1rem' }}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Event Details */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                <Clock size={18} color="var(--terracotta)" /> Event Details
              </h3>
              <div style={{ background: 'var(--ft-dark-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark-secondary)' }}>Occasion:</strong> {order.occasion || 'Special Event'}</div>
                <div style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark-secondary)' }}>Date:</strong> {new Date(order.eventDate).toLocaleDateString('en-IN')}</div>
                <div style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark-secondary)' }}>Time:</strong> {order.eventTime || 'TBD'}</div>
                <div><strong style={{ color: 'var(--text-dark-secondary)' }}>Guests:</strong> {order.guestCount}</div>
              </div>
            </div>

            {/* Delivery/Contact */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                <MapPin size={18} color="var(--terracotta)" /> Delivery & Contact
              </h3>
              <div style={{ background: 'var(--ft-dark-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark-secondary)' }}>Delivery Address:</strong><br />{order.deliveryAddress || 'Pending Coordination'}</div>
                <div style={{ marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-dark-secondary)' }}>Contact Name:</strong> {order.contactName}</div>
                <div><strong style={{ color: 'var(--text-dark-secondary)' }}>Contact Phone:</strong> {order.contactPhone}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
            <ChefHat size={18} color="var(--terracotta)" /> Curated Menu
          </h3>
          <div style={{ background: 'var(--ft-dark-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem' }}>
            {order.items?.map((item, idx) => (
              <div key={item.id} style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== order.items.length - 1 ? '1px solid var(--color-border-dark)' : 'none' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>{item.dish?.name || 'Unknown Dish'}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dark-secondary)' }}>{item.dish?.partner?.businessName || 'Food Tailor Kitchen'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.quantity} × ₹{item.pricePerUnit}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--terracotta-light)' }}>₹{(item.quantity * item.pricePerUnit).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', maxWidth: '350px', background: 'var(--ft-dark-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-dark)' }}>₹{Math.floor((order.totalAmount || 0) * 0.95).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border-dark)', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-dark-secondary)' }}>Taxes & Fees</span>
                <span style={{ color: 'var(--text-dark)' }}>₹{Math.ceil((order.totalAmount || 0) * 0.05).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text-dark)' }}>Total</span>
                <span style={{ color: 'var(--terracotta)' }}>₹{(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
