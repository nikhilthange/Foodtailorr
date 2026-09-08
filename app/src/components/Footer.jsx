'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import FoodTailorLogo from './ui/svg/FoodTailorLogo';

export default function Footer() {
  return (
    <footer className="bg-[#08160E] text-slate-300 pt-16 pb-12 border-t border-emerald-950/60 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C85419]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <FoodTailorLogo variant="light" className="h-8 md:h-9 w-auto" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6 font-normal">
              Food Tailor orchestrates bespoke multi-brand culinary commissions for discerning event hosts. We aggregate iconic heritage dishes from celebrated Hyderabad institutions into one synchronized, audited degustation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-brand-terracotta bg-orange-950/30 border border-brand-terracotta/25 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-pulse" />
              <span className="font-semibold uppercase tracking-wider">Hyderabad Atelier Active</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-[0.16em] text-brand-terracotta font-bold mb-1">
              Navigation
            </span>
            <Link to="/explore" className="text-xs text-slate-400 hover:text-white transition-colors">
              Discover
            </Link>
            <Link to="/how-it-works" className="text-xs text-slate-400 hover:text-white transition-colors">
              Experiences
            </Link>
            <Link to="/menus" className="text-xs text-slate-400 hover:text-white transition-colors">
              Menus
            </Link>
            <Link to="/occasions" className="text-xs text-slate-400 hover:text-white transition-colors">
              Occasions
            </Link>
            <Link to="/partners" className="text-xs text-slate-400 hover:text-white transition-colors">
              Partners
            </Link>
            <Link to="/how-it-works" className="text-xs text-slate-400 hover:text-white transition-colors">
              How It Works
            </Link>
          </div>

          {/* Customer Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-[0.16em] text-brand-terracotta font-bold mb-1">
              Customer
            </span>
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
              My Tastings
            </Link>
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
              Orders
            </Link>
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
              Profile
            </Link>
            <Link to="/build-menu" className="text-xs text-slate-400 hover:text-white transition-colors">
              Build My Menu
            </Link>
          </div>

          {/* Partner Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-[0.16em] text-brand-terracotta font-bold mb-1">
              Partner
            </span>
            <Link to="/partner" className="text-xs text-slate-400 hover:text-white transition-colors">
              Partner Portal
            </Link>
            <Link to="/partner/onboarding" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
              <span>Partner Onboarding</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 bg-brand-terracotta text-white rounded font-bold">Apply</span>
            </Link>
            <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Partner Sign In
            </Link>
          </div>

          {/* Legal & Admin Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-[0.16em] text-brand-terracotta font-bold mb-1">
              Legal
            </span>
            <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
              Refund Policy
            </span>
            <Link to="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2">
              Admin Console
            </Link>
          </div>
        </div>

        {/* Atelier Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Food Tailor. All rights reserved. Registered Culinary Atelier Platform.</p>
          <div className="flex items-center gap-3">
            <span>FSSAI Certified Partner Guild</span>
            <span>•</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
