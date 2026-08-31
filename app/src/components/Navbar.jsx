import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../features/auth/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/brands', label: 'Brands' },
    { to: '/menu-builder', label: 'Menu Builder' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'PARTNER') return '/partner/dashboard';
    return '/dashboard';
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner">
        <Logo />

        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--mobile-open' : ''}`}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${isActive(to) ? 'navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
          
          {isAuthenticated ? (
             <div className="navbar__auth" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
               <Link to={getDashboardLink()} className="navbar__link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                 <User size={18} />
                 <span>{user?.firstName || 'Dashboard'}</span>
               </Link>
               <button onClick={logout} className="btn btn--outline btn--sm navbar__cta">Logout</button>
             </div>
          ) : (
            <div className="navbar__auth" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
              <Link to="/login" className="navbar__link">Log in</Link>
              <Link to="/register" className="btn btn--primary btn--sm navbar__cta">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
