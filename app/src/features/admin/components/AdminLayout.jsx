import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, UtensilsCrossed, Settings, LogOut, Menu, X, BrainCircuit, Activity, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import '../admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Partners', to: '/admin/partners', icon: Store },
    { label: 'Menu Mgmt', to: '/admin/menu', icon: UtensilsCrossed },
    { label: 'AI Logs', to: '/admin/ai-logs', icon: BrainCircuit },
    { label: 'Analytics', to: '/admin/analytics', icon: Activity },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay */}
      {mobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <UtensilsCrossed size={24} color="var(--admin-accent)" />
          <NavLink to="/" className="admin-sidebar__logo">FOOD TAILOR</NavLink>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="admin-btn admin-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="admin-menu-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="admin-topbar__title">Admin Portal</h1>
          </div>

          <div className="admin-topbar__actions">
            <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--admin-text-primary)' }}>{user?.firstName}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
