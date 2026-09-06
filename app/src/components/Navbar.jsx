'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from '../lib/navigation';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowRight, Menu, X, User } from 'lucide-react';
import FoodTailorLogo from './ui/svg/FoodTailorLogo';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const getRoleDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') return { label: 'Admin Console', path: '/admin', badge: 'ADMIN' };
    if (user.role === 'PARTNER') return { label: 'Partner Atelier', path: '/partner', badge: 'PARTNER' };
    return { label: 'My Tastings', path: '/dashboard', badge: null };
  };

  const roleLink = getRoleDashboardLink();

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo - Official Food Tailor Mark */}
          <Link to="/" className="flex items-center group py-1">
            <FoodTailorLogo className="h-8 md:h-9 w-auto transition-transform duration-200 group-hover:scale-[1.02]" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/explore"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/menus"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              Menus
            </Link>
            <Link
              to="/occasions"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              Occasions
            </Link>
            <Link
              to="/partners"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/dashboard"
              className="text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors"
            >
              My Tastings
            </Link>

            {roleLink && user.role !== 'CUSTOMER' && (
              <Link
                to={roleLink.path}
                className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-brand-forest hover:text-brand-terracotta transition-colors"
              >
                <span>{roleLink.label}</span>
                {roleLink.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-brand-terracotta/10 text-brand-terracotta rounded font-bold">
                    {roleLink.badge}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-xs text-brand-forest font-bold hover:text-brand-terracotta transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.firstName || user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-block text-xs uppercase font-bold tracking-wider text-slate-700 hover:text-brand-terracotta transition-colors px-2 py-1"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/build-menu"
              className="btn-accent hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
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
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[84vw] max-w-sm z-50 bg-white flex flex-col justify-between p-6 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
              <FoodTailorLogo className="h-7 w-auto" />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 py-6">
            <Link
              to="/explore"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/menus"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              Menus
            </Link>
            <Link
              to="/occasions"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              Occasions
            </Link>
            <Link
              to="/partners"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-slate-800 hover:text-brand-terracotta transition-colors"
            >
              My Tastings
            </Link>

            {roleLink && (
              <Link
                to={roleLink.path}
                onClick={() => setDrawerOpen(false)}
                className="text-base font-bold text-brand-terracotta hover:text-brand-terracotta/90 transition-colors pt-2 border-t border-slate-100"
              >
                {roleLink.label}
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Signed in as</span>
                <span className="text-sm font-bold text-brand-forest truncate max-w-[150px] block">
                  {user.firstName || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-1/2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-brand-forest border border-brand-forest rounded-xl hover:bg-brand-forest/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setDrawerOpen(false)}
                className="btn-primary w-1/2 py-2.5 text-center text-xs uppercase tracking-wider"
              >
                Register
              </Link>
            </div>
          )}

          <Link
            to="/build-menu"
            onClick={() => setDrawerOpen(false)}
            className="btn-accent w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
          >
            <span>Build My Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
