// Admin Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { Users, Building2, ShoppingBag, Utensils, Brain, DollarSign, LogOut, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);

  useEffect(() => {
    api.getAdminDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error('Dashboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const loadTab = async (tab) => {
    setActiveTab(tab);
    try {
      if (tab === 'users' && users.length === 0) {
        const data = await api.getAdminUsers({ limit: 50 });
        setUsers(data.users || []);
      }
      if (tab === 'partners' && partners.length === 0) {
        const data = await api.getAdminPartners({ limit: 50 });
        setPartners(data.partners || []);
      }
      if (tab === 'orders' && orders.length === 0) {
        const data = await api.getAdminOrders({ limit: 50 });
        setOrders(data.orders || []);
      }
      if (tab === 'ai-logs' && aiLogs.length === 0) {
        const data = await api.getAdminAILogs({ limit: 50 });
        setAiLogs(data.logs || []);
      }
    } catch (err) { console.error('Tab load failed:', err); }
  };

  const handleApprovePartner = async (partnerId, approve) => {
    try {
      await api.updateAdminPartner(partnerId, { isApproved: approve });
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, isApproved: approve } : p));
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const statusColors = { SUBMITTED: '#D97706', ACCEPTED: '#2563EB', COMPLETED: '#059669', CANCELLED: '#DC2626', PENDING_PARTNER: '#D97706', PREPARING: '#7C3AED', CONFIRMED: '#059669', REJECTED: '#DC2626' };

  if (loading) return <div className="dashboard-page"><div className="dashboard-loading">Loading admin dashboard...</div></div>;

  const stats = dashboard?.stats || {};

  return (
    <div className="dashboard-page dashboard-page--admin">
      <div className="dashboard-container">
        <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dashboard-header__left">
            <h1 className="dashboard-header__title"><Shield size={24} /> Admin Dashboard</h1>
            <p className="dashboard-header__subtitle">Food Tailor Platform Administration</p>
          </div>
          <button onClick={handleLogout} className="dashboard-btn dashboard-btn--ghost"><LogOut size={18} /> Logout</button>
        </motion.div>

        {/* Stats */}
        <div className="dashboard-stats dashboard-stats--admin">
          {[
            { icon: <Users size={22} />, value: stats.totalUsers, label: 'Customers', color: '#2563EB' },
            { icon: <Building2 size={22} />, value: stats.totalPartners, label: 'Partners', color: '#7C3AED' },
            { icon: <ShoppingBag size={22} />, value: stats.totalOrders, label: 'Orders', color: '#D97706' },
            { icon: <Utensils size={22} />, value: stats.totalDishes, label: 'Dishes', color: '#059669' },
            { icon: <Brain size={22} />, value: stats.totalRecommendations, label: 'AI Recs', color: '#EC4899' },
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
          {['overview', 'users', 'partners', 'orders', 'ai-logs'].map(tab => (
            <button key={tab} className={`dashboard-tab ${activeTab === tab ? 'dashboard-tab--active' : ''}`} onClick={() => loadTab(tab)}>
              {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dashboard-tab-content">
          {activeTab === 'overview' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">Recent Orders</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>Ref</th><th>Customer</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {(dashboard?.recentOrders || []).map(order => (
                      <tr key={order.id}>
                        <td className="dashboard-table__mono">{order.orderRef}</td>
                        <td>{order.user?.firstName} {order.user?.lastName}</td>
                        <td><span className="dashboard-status" style={{ color: statusColors[order.status], background: statusColors[order.status] + '18' }}>{order.status?.replace(/_/g, ' ')}</span></td>
                        <td>₹{order.totalAmount?.toLocaleString()}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">All Users</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td className="dashboard-table__mono">{u.email}</td>
                        <td><span className="dashboard-role-badge">{u.role}</span></td>
                        <td>{u.isActive ? <CheckCircle size={16} color="#059669" /> : <XCircle size={16} color="#DC2626" />}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">Partners</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>Business</th><th>Cuisine</th><th>Dishes</th><th>Approved</th><th>Actions</th></tr></thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.businessName}</strong><br /><small>{p.user?.email}</small></td>
                        <td>{p.cuisine}</td>
                        <td>{p._count?.dishes || 0}</td>
                        <td>{p.isApproved ? <CheckCircle size={16} color="#059669" /> : <XCircle size={16} color="#DC2626" />}</td>
                        <td>
                          {!p.isApproved ? (
                            <button className="dashboard-btn dashboard-btn--sm dashboard-btn--primary" onClick={() => handleApprovePartner(p.id, true)}>Approve</button>
                          ) : (
                            <button className="dashboard-btn dashboard-btn--sm dashboard-btn--danger" onClick={() => handleApprovePartner(p.id, false)}>Revoke</button>
                          )}
                        </td>
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
                  <thead><tr><th>Ref</th><th>Customer</th><th>Items</th><th>Status</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="dashboard-table__mono">{order.orderRef}</td>
                        <td>{order.user?.firstName} {order.user?.lastName}</td>
                        <td>{order._count?.items || 0}</td>
                        <td><span className="dashboard-status" style={{ color: statusColors[order.status], background: statusColors[order.status] + '18' }}>{order.status?.replace(/_/g, ' ')}</span></td>
                        <td>₹{order.totalAmount?.toLocaleString()}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ai-logs' && (
            <div className="dashboard-card">
              <h2 className="dashboard-card__title">AI Recommendation Logs</h2>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead><tr><th>ID</th><th>Provider</th><th>Guests</th><th>Budget</th><th>Fallback</th><th>Duration</th><th>Date</th></tr></thead>
                  <tbody>
                    {aiLogs.map(log => (
                      <tr key={log.id}>
                        <td className="dashboard-table__mono">{log.id.slice(0, 8)}...</td>
                        <td>{log.provider}</td>
                        <td>{log.guestCount}</td>
                        <td>₹{log.budgetPerHead}/head</td>
                        <td>{log.isFallback ? 'Yes' : 'No'}</td>
                        <td>{log.durationMs ? `${log.durationMs}ms` : '-'}</td>
                        <td>{new Date(log.createdAt).toLocaleDateString('en-IN')}</td>
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
