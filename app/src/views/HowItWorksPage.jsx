'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import { ArrowRight, CheckCircle2, Compass, Calendar, Sliders, CheckSquare, CreditCard, PartyPopper } from 'lucide-react';

const STAGES = [
  {
    number: '01',
    title: 'Explore Hyderabad’s Top Restaurants',
    tag: 'EXPLORATION',
    narrative:
      'Browse our curated collection of verified restaurants, sweet houses, and specialty chaat makers. From Hotel Shadab’s classic mutton dum biryani to Cafe Niloufer’s Irani chai and Almond House’s pure ghee sweets, see real dishes and banquet options.',
    icon: Compass,
    highlights: ['Verified iconic restaurants', 'Authentic signature dishes', 'Transparent portion details'],
  },
  {
    number: '02',
    title: 'Share Your Event Details',
    tag: 'SCALE & DATE',
    narrative:
      'Tell us your event date, delivery venue, and headcount. We cater gatherings from 10 to 100+ guests with precision portions so you never run short or waste food.',
    icon: Calendar,
    highlights: ['10 to 100+ guest capacity', 'Direct venue delivery in Hyderabad', 'Custom date & timing selection'],
  },
  {
    number: '03',
    title: 'Select Dietary Splits & Cuisines',
    tag: 'PREFERENCES',
    narrative:
      'Customize your guest dietary split: Vegetarian, Non-Vegetarian, or Jain. We ensure pure vegetarian dishes are prepared and packed with strict separation.',
    icon: Sliders,
    highlights: ['Pure Veg & Jain separation', 'Adjustable spice levels', 'Balanced multi-course structure'],
  },
  {
    number: '04',
    title: 'Customize Your Courses',
    tag: 'CUSTOMIZATION',
    narrative:
      'Mix and match starters, biryanis, main curries, fresh breads, and desserts across different restaurants. Swap items, adjust quantities, and see clear per-person pricing.',
    icon: CheckSquare,
    highlights: ['Combine dishes from multiple kitchens', 'Real-time per-person pricing', 'Custom chef & packaging notes'],
  },
  {
    number: '05',
    title: 'Single Consolidated Checkout',
    tag: 'ONE PAYMENT',
    narrative:
      'Pay once for your entire order. Food Tailor manages all kitchen orders, production schedules, and supplier payments behind the scenes.',
    icon: CreditCard,
    highlights: ['1 bill for all restaurants', 'Secure digital payment', 'Instant order confirmation'],
  },
  {
    number: '06',
    title: 'Synchronized On-Time Delivery',
    tag: 'EVENT DELIVERY',
    narrative:
      'On event day, courses from all chosen kitchens arrive simultaneously, fresh and temperature-maintained, ready to serve to your guests.',
    icon: PartyPopper,
    highlights: ['Simultaneous arrival', 'Neat temperature-controlled packaging', 'Dedicated event coordinator support'],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Header */}
      <section className="bg-white pt-28 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DC]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
            The Process
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            How Food Tailor Works
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            We simplify multi-restaurant catering so you can serve dishes from Hyderabad&apos;s best kitchens with zero coordination stress.
          </p>
        </div>
      </section>

      {/* 6 Stages Timeline Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.number}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE5DC] shadow-xs"
              >
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C85419] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C85419] block">
                        Step {stage.number} • {stage.tag}
                      </span>
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                        {stage.title}
                      </h2>
                    </div>
                  </div>

                  <span className="font-serif text-2xl sm:text-3xl font-bold text-slate-300">
                    {stage.number}
                  </span>
                </div>

                <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  <p className="md:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {stage.narrative}
                  </p>

                  <div className="md:col-span-5 bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-100 space-y-2">
                    {stage.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-8 sm:p-10 bg-[#0D2418] rounded-2xl text-white text-center">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl mb-3">
            Ready to plan your menu?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            Select your favorite dishes from top restaurants and receive a tailored quote with synchronized delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/build-menu"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-xs uppercase tracking-wider font-bold text-white transition-colors"
            >
              Start Building Menu
            </Link>
            <Link
              to="/partners"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider font-bold text-white border border-white/20 transition-colors"
            >
              View Restaurants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
