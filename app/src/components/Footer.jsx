'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import FoodTailorLogo from './ui/svg/FoodTailorLogo';
import { FlourishAccent } from './ui/svg/DecorativeSketches';
import BotanicalSprig from './ui/svg/BotanicalSprig';

export default function Footer() {
  return (
    <footer className="bg-[#173E23] text-[#FDF9F2] pt-16 pb-12 border-t border-[#173E23]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Subtle Botanical Watermark */}
        <div className="absolute top-6 right-6 opacity-10 pointer-events-none hidden lg:block">
          <BotanicalSprig className="w-48 h-48 text-white" color="#FFFFFF" />
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10 relative z-10">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-block p-2 bg-[#FDF9F2] rounded-xl mb-4 shadow-sm">
              <FoodTailorLogo className="h-8 w-auto" />
            </Link>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm mb-6 font-light">
              Food Tailor orchestrates bespoke multi-brand culinary commissions for discerning event hosts. We aggregate iconic heritage dishes from celebrated Hyderabad institutions into one synchronized, audited degustation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#C55418] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#C55418] animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider">Hyderabad Atelier Active</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C55418] font-bold mb-2">
              Navigation
            </span>
            <Link to="/explore" className="text-xs text-white/75 hover:text-white transition-colors">
              Discover
            </Link>
            <Link to="/how-it-works" className="text-xs text-white/75 hover:text-white transition-colors">
              Experiences
            </Link>
            <Link to="/menus" className="text-xs text-white/75 hover:text-white transition-colors">
              Menus
            </Link>
            <Link to="/occasions" className="text-xs text-white/75 hover:text-white transition-colors">
              Occasions
            </Link>
            <Link to="/partners" className="text-xs text-white/75 hover:text-white transition-colors">
              Partners
            </Link>
            <Link to="/how-it-works" className="text-xs text-white/75 hover:text-white transition-colors">
              How It Works
            </Link>
          </div>

          {/* Customer Column */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C55418] font-bold mb-2">
              Customer
            </span>
            <Link to="/dashboard" className="text-xs text-white/75 hover:text-white transition-colors">
              My Tastings
            </Link>
            <Link to="/dashboard" className="text-xs text-white/75 hover:text-white transition-colors">
              Orders
            </Link>
            <Link to="/dashboard" className="text-xs text-white/75 hover:text-white transition-colors">
              Profile
            </Link>
            <Link to="/build-menu" className="text-xs text-white/75 hover:text-white transition-colors">
              Build My Menu
            </Link>
          </div>

          {/* Partner Column */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C55418] font-bold mb-2">
              Partner
            </span>
            <Link to="/partner" className="text-xs text-white/75 hover:text-white transition-colors">
              Partner Portal
            </Link>
            <Link to="/partner/onboarding" className="text-xs text-white/75 hover:text-white transition-colors flex items-center gap-1.5">
              <span>Partner Onboarding</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#C55418] text-white rounded font-bold">Apply</span>
            </Link>
            <Link to="/login" className="text-xs text-white/75 hover:text-white transition-colors">
              Partner Sign In
            </Link>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C55418] font-bold mb-2">
              Legal
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="text-xs text-white/60 hover:text-white cursor-pointer transition-colors">
              Refund Policy
            </span>
            <Link to="/admin" className="text-xs text-white/40 hover:text-white/80 transition-colors mt-2">
              Admin Console
            </Link>
          </div>

        </div>

        {/* Handcrafted Divider Flourish */}
        <div className="py-6 flex justify-center opacity-40">
          <FlourishAccent className="w-40 h-5" color="#FFFFFF" />
        </div>

        {/* Atelier Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Food Tailor. All rights reserved. Registered Culinary Atelier Platform.</p>
          <div className="flex items-center gap-4">
            <span>FSSAI Certified Partner Guild</span>
            <span>•</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
