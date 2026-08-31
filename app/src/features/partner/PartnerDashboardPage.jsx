// Partner Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { LogOut, Utensils, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function PartnerDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.getPartnerDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error('Partner dashboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const loadTab = async (tab) => {
    setActiveTab(tab);
    try {
      if (tab === 'menu' && dishes.length === 0) {
        const data = await api.getPartnerDishes();
        setDishes(Array.isArray(data) ? data : []);
      }
      if (tab === 'orders' && orders.length === 0) {
        const data = await api.getPartnerOrders({ limit: 50 });
        setOrders(data.orders || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleOrderAction = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const statusColors = { SUBMITTED: '#D97706', PENDING_PARTNER: '#D97706', ACCEPTED: '#2563EB', PREPARING: '#7C3AED', CONFIRMED: '#059669', COMPLETED: '#059669', CANCELLED: '#DC2626', REJECTED: '#DC2626' };

  if (loading) return <div className="dashboard-page"><div className="dashboard-loading">Loading partner dashboard...</div></div>;

  const stats = dashboard?.stats || {};
  const partner = dashboard?.partner || {};

  return (
    <div className="dashboard-page dashboard-page--partner">
      <div className="dashboard-container">
        <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dashboard-header__left">
            <h1 className="dashboard-header__title">🍽️ {partner.businessName || 'Partner Dashboard'}</h1>
            <p className="dashboard-header__subtitle">{partner.cuisine} · {partner.isApproved ? '✅ Approved' : '⏳ Pending Approval'}</p>
          </div>
          <button onClick={handleLogout} className="dashboard-btn dashboard-btn--ghost"><LogOut size={18} /> Logout</button>
        </motion.div>

        {!partner.isApproved && (
          <div className="dashboard-alert dashboard-alert--warning">
            <AlertTriangle size={20} />
            <span>Your account is pending admin approval. Your dishes won't appear in recommendations until approved.</span>
          </div>
        )}

        {/* Stats */}
        <div className="dashboard-stats">
          {[
            { icon: <Utensils size={22} />, value: stats.activeDishes, label: `Active / ${stats.totalDishes} Total`, color: '#059669' },
            { icon: <ShoppingBag size={22} />, value: stats.pendingOrders, label: 'Pending Orders', color: '#D97706' },
            { icon: <Clock size={22} />, value: stats.totalOrders, label: 'Total Orders', color: '#2563EB' },
            { icon: <DollarSign size={22} />, value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, label: 'Revenue', color: '#B91C1C' },
          ].map((s, i) => (
            <motion.div key={i} className="dashboard-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <div className="dashboard-stat-card__icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div className="dashboard-stat-card__info">
                <span className="dashboard-stat-card__value">{s.value}</span>
                <span className="dashboard-stat-card__label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {['overview', 'menu', 'orders'].map(tab => (
            <button key={tab} className={`dashboard-tab ${activeTab === tab ? 'dashboard-tab--active' : ''}`} onClick={() => loadTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dashboard-tab-content">
          {activeTab === 'overview' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">Recent Orders</h2>
              {(dashboard?.recentOrders || []).length === 0 ? (
                <div className="dashboard-empty"><p>No orders yet</p></div>
              ) : (
                <div className="dashboard-list">
                  {(dashboard?.recentOrders || []).map(order => (
                    <div key={order.id} className="dashboard-list-item">
                      <div className="dashboard-list-item__left">
                        <span className="dashboard-list-item__ref">{order.orderRef || 'Order'}</span>
                        <span className="dashboard-list-item__date">{order.user?.firstName} {order.user?.lastName} · {order.items?.length} items</span>
                      </div>
                      <div className="dashboard-list-item__right">
                        <span className="dashboard-status" style={{ color: statusColors[order.status], background: statusColors[order.status] + '18' }}>
                          {order.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">Your Menu ({dishes.length} dishes)</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>Dish</th><th>Category</th><th>Price</th><th>Veg</th><th>Available</th></tr></thead>
                  <tbody>
                    {dishes.map(dish => (
                      <tr key={dish.id}>
                        <td><strong>{dish.name}</strong>{dish.isSignature && <span className="dashboard-badge dashboard-badge--gold"> ★</span>}</td>
                        <td>{dish.category?.name}</td>
                        <td>₹{dish.pricePerHead}/head</td>
                        <td>{dish.isVeg ? '🟢' : '🔴'}</td>
                        <td>{dish.isAvailable ? <CheckCircle size={16} color="#059669" /> : <XCircle size={16} color="#DC2626" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">All Orders</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>Ref</th><th>Customer</th><th>Items</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="dashboard-table__mono">{order.orderRef}</td>
                        <td>{order.user?.firstName} {order.user?.lastName}</td>
                        <td>{order.items?.length}</td>
                        <td><span className="dashboard-status" style={{ color: statusColors[order.status], background: statusColors[order.status] + '18' }}>{order.status?.replace(/_/g, ' ')}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          {['SUBMITTED', 'PENDING_PARTNER'].includes(order.status) && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="dashboard-btn dashboard-btn--sm dashboard-btn--primary" onClick={() => handleOrderAction(order.id, 'ACCEPTED')}>Accept</button>
                              <button className="dashboard-btn dashboard-btn--sm dashboard-btn--danger" onClick={() => handleOrderAction(order.id, 'REJECTED')}>Reject</button>
                            </div>
                          )}
                          {order.status === 'ACCEPTED' && (
                            <button className="dashboard-btn dashboard-btn--sm dashboard-btn--primary" onClick={() => handleOrderAction(order.id, 'PREPARING')}>Start Prep</button>
                          )}
                          {order.status === 'PREPARING' && (
                            <button className="dashboard-btn dashboard-btn--sm dashboard-btn--primary" onClick={() => handleOrderAction(order.id, 'CONFIRMED')}>Confirm Ready</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
