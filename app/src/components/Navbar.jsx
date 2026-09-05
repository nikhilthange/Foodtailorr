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
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#EBE3D5] shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo - Official Food Tailor Vector Mark */}
          <Link to="/" className="flex items-center group py-1">
            <FoodTailorLogo className="h-8 md:h-10 w-auto transition-transform group-hover:scale-[1.02]" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <Link
              to="/explore"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/menus"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              Menus
            </Link>
            <Link
              to="/occasions"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              Occasions
            </Link>
            <Link
              to="/partners"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/dashboard"
              className="text-xs uppercase font-semibold tracking-wider text-[#424941] hover:text-[#C55418] transition-colors"
            >
              My Tastings
            </Link>

            {roleLink && user.role !== 'CUSTOMER' && (
              <Link
                to={roleLink.path}
                className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#173E23] hover:text-[#C55418] transition-colors"
              >
                <span>{roleLink.label}</span>
                {roleLink.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-[#C55418]/10 text-[#C55418] rounded font-bold">
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
                  className="flex items-center gap-1.5 text-xs text-[#173E23] font-semibold hover:text-[#C55418] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Hi, {user.firstName || user.email.split('@')[0]}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1 text-xs text-[#424941] hover:text-[#173E23] transition-colors font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs text-[#424941] hover:text-red-700 border border-[#EBE3D5] rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#173E23] hover:text-[#C55418] transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/build-menu"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C55418] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:bg-[#a33e00] active:scale-[0.98] transition-all"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              aria-label="Open navigation drawer"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#173E23] rounded-xl hover:bg-[#F3EFE6] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[84vw] max-w-sm z-50 bg-[#FDFBF7] flex flex-col justify-between p-6 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-[#EBE3D5]">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center">
              <FoodTailorLogo className="h-7 w-auto" />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3EFE6] text-[#424941]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 py-6">
            <Link
              to="/explore"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/menus"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              Menus
            </Link>
            <Link
              to="/occasions"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              Occasions
            </Link>
            <Link
              to="/partners"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setDrawerOpen(false)}
              className="text-base font-semibold text-[#173E23] hover:text-[#C55418] transition-colors"
            >
              My Tastings
            </Link>

            {roleLink && (
              <Link
                to={roleLink.path}
                onClick={() => setDrawerOpen(false)}
                className="text-base font-bold text-[#C55418] hover:text-[#a33e00] transition-colors pt-2 border-t border-[#EBE3D5]"
              >
                {roleLink.label}
              </Link>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#EBE3D5] space-y-4">
          {user ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7C6F5A] block">Signed in as</span>
                <span className="text-sm font-bold text-[#173E23] truncate max-w-[150px] block">
                  {user.firstName || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                className="w-1/2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#173E23] border border-[#173E23] rounded-xl hover:bg-[#173E23]/5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setDrawerOpen(false)}
                className="w-1/2 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#173E23] rounded-xl hover:bg-[#00280f]"
              >
                Register
              </Link>
            </div>
          )}

          <Link
            to="/build-menu"
            onClick={() => setDrawerOpen(false)}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[#C55418] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#a33e00] transition-all"
          >
            <span>Build My Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
