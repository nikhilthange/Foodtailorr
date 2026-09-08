'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, usePathname } from '../lib/navigation';
import { useAuth } from '../features/auth/AuthContext';
import { ArrowRight, Menu, X, User, Compass, UtensilsCrossed, Calendar, Award, Sparkles } from 'lucide-react';
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
    if (user.role === 'PARTNER') return { label: 'Partner Atelier', path: '/partner', badge: 'PARTNER' };
    return { label: 'My Tastings', path: '/dashboard', badge: null };
  };

  const roleLink = getRoleDashboardLink();

  const navLinks = [
    { label: 'Discover', path: '/explore', icon: Compass },
    { label: 'Experiences', path: '/how-it-works', icon: Sparkles },
    { label: 'Menus', path: '/menus', icon: UtensilsCrossed },
    { label: 'Occasions', path: '/occasions', icon: Calendar },
    { label: 'Partners', path: '/partners', icon: Award },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B1E13]/95 backdrop-blur-xl border-b border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.35)] py-2.5'
            : 'bg-[#0B1E13]/80 backdrop-blur-md border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group py-1 focus:outline-none">
              <FoodTailorLogo
                variant="light"
                className="h-7 sm:h-8 md:h-9 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-white font-semibold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-[#C85419] after:rounded-full'
                      : 'text-slate-300 font-medium hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {/* Role specific primary workspace link */}
                {user.role === 'PARTNER' ? (
                  <Link
                    to="/partner"
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-400/30 text-amber-200 transition-all shadow-xs group"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#C85419] text-white flex items-center justify-center text-[10px] font-bold">
                      {(user.firstName?.[0] || 'P').toUpperCase()}
                    </div>
                    <span className="text-xs font-bold tracking-wide group-hover:text-white transition-colors max-w-[120px] truncate">
                      {user.firstName || 'Partner Atelier'}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                      Atelier
                    </span>
                  </Link>
                ) : user.role === 'ADMIN' ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-400/30 text-purple-200 transition-all"
                  >
                    <span className="text-xs font-bold tracking-wide">Admin Console</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white transition-all text-xs font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>My Tastings</span>
                  </Link>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1"
              >
                Sign In
              </Link>
            )}

            {/* Build My Menu CTA button */}
            {user?.role !== 'PARTNER' && (
              <Link
                to="/build-menu"
                className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-[#C85419] hover:bg-[#A33E00] text-white text-xs font-bold tracking-wide shadow-md shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>Build My Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/15 text-slate-200 hover:bg-white/10 transition-colors"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[84vw] max-w-sm z-50 bg-[#0B1E13] text-white flex flex-col justify-between p-6 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out border-l border-white/10 ${
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

          <nav className="flex flex-col gap-2 py-5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-bold border border-white/15'
                      : 'text-slate-300 hover:bg-white/5 hover:text-amber-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {roleLink && (
              <Link
                to={roleLink.path}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-3.5 py-3 mt-2 rounded-xl text-sm font-bold text-amber-300 bg-white/5 border border-white/10"
              >
                <span>{roleLink.label}</span>
                {roleLink.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-[#C85419] text-white rounded font-bold">
                    {roleLink.badge}
                  </span>
                )}
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-5 border-t border-white/10 space-y-3">
          {user ? (
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C85419] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Signed In</span>
                  <span className="text-xs font-bold text-white truncate max-w-[130px] block">
                    {user.firstName || user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs text-rose-400 font-semibold border border-rose-500/30 bg-rose-950/30 rounded-lg hover:bg-rose-900/40 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 rounded-xl border border-white/20 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {user?.role === 'PARTNER' ? (
            <Link
              to="/partner"
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 text-white border border-emerald-500/40"
            >
              <span>Go to Atelier Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/build-menu"
              onClick={() => setDrawerOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#C85419] hover:bg-[#a33e00] text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 text-white"
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

