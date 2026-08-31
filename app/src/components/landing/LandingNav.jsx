import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      // Activate sticky navbar after scrolling 40% of viewport height
      const threshold = window.innerHeight * 0.4;
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/how-it-works', label: 'HOW IT WORKS' },
    { to: '/brands', label: 'BRANDS' },
    { to: '/menu-builder', label: 'MENU BUILDER' },
    { to: '/about', label: 'ABOUT' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 1. CLEAN SINGLE-ROW TOP EDITORIAL NAVBAR */}
      <header className="ft-site-header ft-site-header--single">
        <div className="ft-site-header__container ft-site-header__container--single">
          {/* LEFT: Food Tailor Wordmark Logo */}
          <div className="ft-site-header__brand-wrap">
            <Link to="/" className="ft-site-header__logo" aria-label="Food Tailor Home">
              FOOD TAILOR
            </Link>
          </div>

          {/* CENTER: Primary Navigation Links */}
          <nav className="ft-site-header__nav-center" aria-label="Main Navigation">
            <ul className="ft-site-header__nav-list">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li key={link.to} className="ft-site-header__nav-item">
                    <Link
                      to={link.to}
                      className={`ft-site-header__nav-link ${active ? 'ft-site-header__nav-link--active' : ''}`}
                    >
                      <span className="ft-site-header__dot">•</span>
                      <span className="ft-site-header__nav-text">{link.label}</span>
                      <span className="ft-site-header__dot">•</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT: Compact CTA Button and Auth */}
          <div className="ft-site-header__action" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'PARTNER' ? '/partner/dashboard' : '/dashboard'} className="ft-site-header__nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={18} />
                <span className="ft-site-header__nav-text">{user?.firstName || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link to="/login" className="ft-site-header__nav-link">
                <span className="ft-site-header__nav-text">SIGN IN</span>
              </Link>
            )}
            <Link to="/menu-builder" className="ft-site-header__cta">
              START YOUR MENU
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="ft-site-header__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* 2. REFINED COMPACT LIQUID-GLASS STICKY NAVBAR */}
      <div
        className={`ft-sticky-nav ${scrolled ? 'ft-sticky-nav--visible' : ''}`}
        role="navigation"
        aria-label="Sticky Navigation"
      >
        <div className="ft-sticky-nav__container">
          {/* LEFT: Circular Brand Seal + Brand Name */}
          <Link to="/" className="ft-sticky-nav__brand" aria-label="Food Tailor Home">
            <div className="ft-sticky-nav__circle-logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 8c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.4 0 2.6.7 3.3 1.8C12.1.7 13.3 0 14.7 0c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.4 0-2.6-.7-3.3-1.8C10.6 7.3 9.4 8 8 8z"
                  stroke="#c41e3a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  transform="translate(4, 7) scale(1.15)"
                />
              </svg>
            </div>
            <span className="ft-sticky-nav__brand-text">FOOD TAILOR</span>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="ft-sticky-nav__menu">
            <ul className="ft-sticky-nav__list">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li key={link.to} className="ft-sticky-nav__item">
                    <Link
                      to={link.to}
                      className={`ft-sticky-nav__link ${active ? 'ft-sticky-nav__link--active' : ''}`}
                    >
                      <span className="ft-sticky-nav__dot">•</span>
                      <span>{link.label}</span>
                      <span className="ft-sticky-nav__dot">•</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* RIGHT: CTA Button and Auth */}
          <div className="ft-sticky-nav__action" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'PARTNER' ? '/partner/dashboard' : '/dashboard'} className="ft-sticky-nav__link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={18} />
                <span>{user?.firstName || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link to="/login" className="ft-sticky-nav__link">
                <span>SIGN IN</span>
              </Link>
            )}
            <Link to="/menu-builder" className="ft-site-header__cta ft-site-header__cta--sticky">
              START YOUR MENU
            </Link>
          </div>

          {/* Mobile Menu Trigger for Sticky Navbar */}
          <button
            className="ft-sticky-nav__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="ft-sticky-nav__mobile-label">MENU</span>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE FULL-SCREEN OVERLAY DRAWER */}
      {mobileOpen && (
        <div className="ft-site-header__mobile-drawer">
          <nav className="ft-site-header__mobile-nav">
            <ul className="ft-site-header__mobile-list">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li key={link.to} className="ft-site-header__mobile-item">
                    <Link
                      to={link.to}
                      className={`ft-site-header__mobile-link ${active ? 'ft-site-header__mobile-link--active' : ''}`}
                    >
                      <span className="ft-site-header__mobile-dot">•</span>
                      <span>{link.label}</span>
                      <span className="ft-site-header__mobile-dot">•</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ft-site-header__mobile-cta-wrap">
              {isAuthenticated ? (
                <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'PARTNER' ? '/partner/dashboard' : '/dashboard'} className="ed-btn ed-btn--outline ed-btn--wide" style={{ marginBottom: '1rem' }}>
                  GO TO DASHBOARD
                </Link>
              ) : (
                <Link to="/login" className="ed-btn ed-btn--outline ed-btn--wide" style={{ marginBottom: '1rem' }}>
                  SIGN IN
                </Link>
              )}
              <Link to="/menu-builder" className="ed-btn ed-btn--crimson ed-btn--wide">
                START YOUR MENU
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
