'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import FoodTailorLogo from './ui/svg/FoodTailorLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0D2418] text-slate-300 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-block mb-4">
              <FoodTailorLogo variant="light" className="h-8 w-auto" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-5 font-normal">
              Food Tailor brings Hyderabad&apos;s most celebrated restaurants and specialty kitchens together into custom event menus with coordinated delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Serving all central & suburban Hyderabad</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold mb-1">
              Explore
            </span>
            <Link to="/explore" className="text-xs text-slate-400 hover:text-white transition-colors">
              Discover
            </Link>
            <Link to="/how-it-works" className="text-xs text-slate-400 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link to="/menus" className="text-xs text-slate-400 hover:text-white transition-colors">
              Menu Catalog
            </Link>
            <Link to="/occasions" className="text-xs text-slate-400 hover:text-white transition-colors">
              Occasions
            </Link>
            <Link to="/partners" className="text-xs text-slate-400 hover:text-white transition-colors">
              Restaurants
            </Link>
          </div>

          {/* Planning Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold mb-1">
              Event Planning
            </span>
            <Link to="/build-menu" className="text-xs text-slate-400 hover:text-white transition-colors">
              Build Your Menu
            </Link>
            <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">
              My Orders & Folios
            </Link>
            <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Customer Sign In
            </Link>
          </div>

          {/* Partners Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold mb-1">
              For Restaurants
            </span>
            <Link to="/partner" className="text-xs text-slate-400 hover:text-white transition-colors">
              Partner Portal
            </Link>
            <Link to="/partner/onboarding" className="text-xs text-slate-400 hover:text-white transition-colors">
              Apply to Join
            </Link>
            <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Partner Login
            </Link>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold mb-1">
              Company
            </span>
            <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
            <Link to="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2">
              Admin Console
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Food Tailor. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Curated Event Catering</span>
            <span>•</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
