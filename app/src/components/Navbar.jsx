'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, usePathname } from '../lib/navigation';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowRight, Menu, X, User, Compass, UtensilsCrossed, Calendar, Building2, Sparkles } from 'lucide-react';
import FoodTailorLogo from './ui/svg/FoodTailorLogo';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = usePathname?.() || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const getRoleDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') return { label: 'Admin Console', path: '/admin', badge: 'ADMIN' };
    if (user.role === 'PARTNER') return { label: 'Partner Portal', path: '/partner', badge: 'PARTNER' };
    return { label: 'My Tastings', path: '/dashboard', badge: null };
  };

  const roleLink = getRoleDashboardLink();

  const navLinks = [
    { label: 'Discover', path: '/explore', icon: Compass },
    { label: 'How It Works', path: '/how-it-works', icon: Sparkles },
    { label: 'Menus', path: '/menus', icon: UtensilsCrossed },
    { label: 'Occasions', path: '/occasions', icon: Calendar },
    { label: 'Restaurants', path: '/partners', icon: Building2 },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#0D2418]/95 backdrop-blur-md border-b border-white/10 shadow-sm py-3'
            : 'bg-[#0D2418] border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group py-0.5 focus:outline-none">
              <FoodTailorLogo
                variant="light"
                className="h-8 w-auto transition-opacity group-hover:opacity-90"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-normal transition-colors py-1 relative font-medium ${
                    isActive
                      ? 'text-white font-semibold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[#C85419] after:rounded-full'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {user.role === 'PARTNER' ? (
                  <Link
                    to="/partner"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-all text-xs font-semibold"
                  >
                    <span>Partner Portal</span>
                  </Link>
                ) : user.role === 'ADMIN' ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-all text-xs font-semibold"
                  >
                    <span>Admin Console</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-all text-xs font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>My Account</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-300 hover:text-white px-2 py-1.5 rounded transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-block text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            {/* Build My Menu CTA button */}
            {user?.role !== 'PARTNER' && (
              <Link
                to="/build-menu"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-white text-xs font-semibold tracking-normal transition-all shadow-sm"
              >
                <span>Build Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[82vw] max-w-sm z-50 bg-[#0D2418] text-white flex flex-col justify-between p-6 shadow-xl lg:hidden transition-transform duration-300 ease-in-out border-l border-white/10 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center py-1">
              <FoodTailorLogo variant="light" className="h-7 w-auto" />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 py-4">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {roleLink && (
              <Link
                to={roleLink.path}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 mt-2 rounded-lg text-sm font-semibold text-amber-300 bg-white/5 border border-white/10"
              >
                <span>{roleLink.label}</span>
                {roleLink.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-[#C85419] text-white rounded font-bold">
                    {roleLink.badge}
                  </span>
                )}
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          {user ? (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#C85419] text-white flex items-center justify-center text-xs font-bold">
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <div className="text-xs font-medium text-white truncate max-w-[130px]">
                  {user.firstName || user.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setDrawerOpen(false)}
              className="block w-full py-2.5 rounded-lg border border-white/20 text-center text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          )}

          {user?.role !== 'PARTNER' && (
            <Link
              to="/build-menu"
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2 text-white"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

