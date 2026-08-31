import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, UtensilsCrossed, Settings, LogOut, Menu, Activity, ShoppingBag, Bell } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import '../partner.css';

export default function PartnerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', to: '/partner/dashboard', icon: LayoutDashboard },
    { label: 'Orders Management', to: '/partner/orders', icon: ShoppingBag },
    { label: 'Menu & Dishes', to: '/partner/menu', icon: UtensilsCrossed },
    { label: 'Analytics', to: '/partner/analytics', icon: Activity },
    { label: 'Business Profile', to: '/partner/profile', icon: Store },
  ];

  return (
    <div className="partner-layout">
      {/* Sidebar Overlay */}
      {mobileOpen && (
        <div className="partner-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`partner-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="partner-sidebar__header">
          <NavLink to="/" className="partner-sidebar__logo">
            <UtensilsCrossed size={24} color="var(--partner-accent)" />
            FOOD TAILOR
          </NavLink>
          <div className="partner-sidebar__subtitle">Partner Portal</div>
        </div>

        <nav className="partner-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `partner-sidebar__link ${isActive ? 'partner-sidebar__link--active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="partner-sidebar__footer">
          <button onClick={handleLogout} className="partner-btn partner-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="partner-main">
        {/* Topbar */}
        <header className="partner-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="partner-menu-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="partner-topbar__title">Restaurant Dashboard</h1>
          </div>

          <div className="partner-topbar__actions">
            <button className="partner-btn partner-btn--ghost partner-btn--sm" style={{ padding: '0.5rem' }}>
              <Bell size={18} />
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--partner-text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--partner-text-primary)' }}>{user?.firstName}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="partner-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
