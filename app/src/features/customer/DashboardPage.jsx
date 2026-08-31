// Customer Dashboard
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, User, LogOut, ChevronRight, Clock, CheckCircle, Search, Calendar, FileText } from 'lucide-react';
import './customer.css';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [savedMenus, setSavedMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getOrders({ limit: 5 }).catch(() => ({ orders: [] })),
      api.getSavedMenus().catch(() => []),
    ]).then(([orderData, menuData]) => {
      setOrders(orderData.orders || []);
      setSavedMenus(Array.isArray(menuData) ? menuData : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const statusColors = {
    SUBMITTED: '#F59E0B', PENDING_PARTNER: '#F59E0B', ACCEPTED: '#3B82F6',
    PREPARING: '#8B5CF6', READY_FOR_PICKUP: '#10B981', COMPLETED: '#10B981',
    CANCELLED: '#EF4444', REJECTED: '#EF4444', DRAFT: '#6B7280',
  };

  if (loading) return (
    <div className="dashboard-page"><div className="dashboard-empty">Preparing your experience...</div></div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Hero */}
        <motion.div className="dashboard-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dashboard-header__left">
            <h1 className="dashboard-header__title">Welcome back, {user?.firstName || 'Guest'}</h1>
            <p className="dashboard-header__subtitle">Your next memorable meal starts with a menu made for you.</p>
          </div>
          <div className="dashboard-header__actions">
            <Link to="/menu-builder" className="dashboard-btn dashboard-btn--primary">
              Build a New Menu
            </Link>
            <Link to="/brands" className="dashboard-btn dashboard-btn--ghost">
              Explore Brands
            </Link>
            <Link to="/dashboard/profile" className="dashboard-btn dashboard-btn--ghost" title="Profile" style={{ padding: '12px' }}>
              <User size={18} />
            </Link>
            <button onClick={handleLogout} className="dashboard-btn dashboard-btn--ghost" title="Logout" style={{ padding: '12px' }}>
              <LogOut size={18} />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="dashboard-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <FileText size={24} />
            </div>
            <div className="dashboard-stat-card__info">
              <span className="dashboard-stat-card__value">{savedMenus.length < 10 ? `0${savedMenus.length}` : savedMenus.length}</span>
              <span className="dashboard-stat-card__label">Menus Created</span>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <ShoppingBag size={24} />
            </div>
            <div className="dashboard-stat-card__info">
              <span className="dashboard-stat-card__value">{orders.length < 10 ? `0${orders.length}` : orders.length}</span>
              <span className="dashboard-stat-card__label">Orders Placed</span>
            </div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__icon" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <Heart size={24} />
            </div>
            <div className="dashboard-stat-card__info">
              <span className="dashboard-stat-card__value">{savedMenus.length < 10 ? `0${savedMenus.length}` : savedMenus.length}</span>
              <span className="dashboard-stat-card__label">Saved Menus</span>
            </div>
          </div>
        </motion.div>

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="dashboard-card__header">
              <h2 className="dashboard-card__title">Recent Orders</h2>
              {orders.length > 0 && <Link to="/dashboard/orders" className="dashboard-card__link">View All <ChevronRight size={14} /></Link>}
            </div>
            <div className="dashboard-card__body">
              {orders.length === 0 ? (
                <div className="dashboard-empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                    <path d="M12 3v18M3 12h18" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9"/>
                  </svg>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>No orders yet</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your first tailored dining experience is waiting.</p>
                  <Link to="/menu-builder" className="dashboard-btn dashboard-btn--ghost dashboard-btn--sm">Build Your First Menu</Link>
                </div>
              ) : (
                <div className="dashboard-list">
                  {orders.map(order => (
                    <div key={order.id} className="dashboard-list-item" onClick={() => navigate(`/dashboard/orders/${order.id}`)}>
                      <div className="dashboard-list-item__left">
                        <span className="dashboard-list-item__ref">{order.orderRef}</span>
                        <span className="dashboard-list-item__date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="dashboard-list-item__right">
                        <span className="dashboard-status" style={{ color: statusColors[order.status] || '#fff', background: `${statusColors[order.status] || '#ffffff'}15` }}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className="dashboard-list-item__amount">₹{order.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Saved Menus */}
          <motion.div className="dashboard-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="dashboard-card__header">
              <h2 className="dashboard-card__title">Saved Menus</h2>
            </div>
            <div className="dashboard-card__body">
              {savedMenus.length === 0 ? (
                <div className="dashboard-empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                    <path d="M4 4h16v16H4z" strokeLinecap="round"/>
                    <path d="M4 8h16M8 4v16" strokeLinecap="round"/>
                  </svg>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>No saved menus</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Curate your next occasion.</p>
                  <Link to="/menu-builder" className="dashboard-btn dashboard-btn--ghost dashboard-btn--sm">Create a Menu</Link>
                </div>
              ) : (
                <div className="dashboard-list">
                  {savedMenus.map(menu => (
                    <div key={menu.id} className="dashboard-list-item">
                      <div className="dashboard-list-item__left">
                        <span className="dashboard-list-item__ref">{menu.name}</span>
                        <span className="dashboard-list-item__date">{menu.guestCount} guests · ₹{menu.totalPerHead}/head</span>
                      </div>
                      <div className="dashboard-list-item__right">
                        <span className="dashboard-list-item__amount">{menu.items?.length || 0} items</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div className="dashboard-quick-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Link to="/menu-builder" className="dashboard-action-card">
            <span className="dashboard-action-card__icon">
              <FileText size={32} color="var(--ft-red-light)" />
            </span>
            <span className="dashboard-action-card__label">Build Menu</span>
          </Link>
          <Link to="/brands" className="dashboard-action-card">
            <span className="dashboard-action-card__icon">
              <Search size={32} color="var(--ft-red-light)" />
            </span>
            <span className="dashboard-action-card__label">Browse Brands</span>
          </Link>
          <Link to="/how-it-works" className="dashboard-action-card">
            <span className="dashboard-action-card__icon">
              <Calendar size={32} color="var(--ft-red-light)" />
            </span>
            <span className="dashboard-action-card__label">Plan an Occasion</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
