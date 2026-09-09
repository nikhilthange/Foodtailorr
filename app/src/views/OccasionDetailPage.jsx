'use client';

import React, { useState } from 'react';
import { Link, useParams } from '../lib/navigation';
import { OCCASIONS_DATA } from './OccasionsPage';
import {
  ArrowRight,
  Check,
  Users,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  Utensils,
  ChefHat,
  Flame,
  CheckCircle2,
  Calendar,
  Building2,
  Info,
} from 'lucide-react';

export default function OccasionDetailPage() {
  const { slug } = useParams();
  
  const occasion =
    OCCASIONS_DATA.find(
      (o) =>
        o.slug === slug ||
        o.id === slug ||
        o.aliases?.includes(slug)
    ) || OCCASIONS_DATA[0];

  const Icon = occasion.IconComponent;
  const [guestCount, setGuestCount] = useState(25);
  const [dietaryPreference, setDietaryPreference] = useState('ALL');

  const basePricePerHead = occasion.estimatedPerHead || 980;
  const estimatedSubtotal = basePricePerHead * guestCount;
  const conciergeFee = Math.round(estimatedSubtotal * 0.05);
  const estimatedTotal = estimatedSubtotal + conciergeFee;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900 selection:bg-[#C85419] selection:text-white pb-20">
      {/* ============================================================ */}
      {/* SECTION 1 — CINEMATIC LUXURY HERO BANNER                     */}
      {/* ============================================================ */}
      <section className="relative min-h-[52vh] sm:min-h-[58vh] bg-[#07190F] text-white flex flex-col justify-end pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Ambient Glows */}
        <div className="absolute inset-0 z-0">
          <img
            src={occasion.image}
            alt={occasion.title}
            className="w-full h-full object-cover object-center brightness-[0.85] contrast-[1.08] scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07190F] via-[#07190F]/65 to-[#07190F]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(7,25,15,0.8)_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Back Navigation Breadcrumb */}
          <Link
            to="/occasions"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors mb-6 backdrop-blur-md px-3 py-1.5 rounded-full bg-white/10 border border-white/15 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Occasions</span>
          </Link>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Icon className="w-5 h-5" color={occasion.accentColor} />
            </div>
            
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>{occasion.guestRange}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C85419] text-white shadow-sm">
              {occasion.badge}
            </span>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-100 border border-emerald-600/30">
              {occasion.category}
            </span>
          </div>

          {/* Master Occasion Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-3 drop-shadow-md">
            {occasion.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-3xl font-normal leading-relaxed mb-8 drop-shadow-sm">
            &ldquo;{occasion.tagline}&rdquo;
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/build-menu?occasion=${encodeURIComponent(occasion.id)}`}
              className="btn-accent px-7 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-100 transition-transform"
            >
              <span>Tailor This Banquet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#dishes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-bold backdrop-blur-md border border-white/25 transition-all"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Browse Curated Dishes</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — QUICK METRICS STRIP                              */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-[#E8E5DD] py-5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center divide-x divide-slate-100">
          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
              Curated Institutions
            </span>
            <p className="font-serif font-extrabold text-lg sm:text-xl text-[#0D381E]">
              {occasion.lineup?.length || 4} Heritage Brands
            </p>
          </div>

          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
              Course Structure
            </span>
            <p className="font-serif font-extrabold text-lg sm:text-xl text-[#0D381E]">
              {occasion.signatureDishes?.length || 5} Bespoke Courses
            </p>
          </div>

          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
              Estimated Budget
            </span>
            <p className="font-serif font-extrabold text-lg sm:text-xl text-[#0D381E]">
              ₹{basePricePerHead} / cover
            </p>
          </div>

          <div className="px-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
              White-Glove Support
            </span>
            <p className="font-serif font-extrabold text-lg sm:text-xl text-[#0D381E]">
              Captain & Staging
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — MAIN WORKSPACE GRID                              */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* ======================================================== */}
          {/* LEFT CONTENT COLUMN (8 COLUMNS)                         */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Atmosphere & Philosophy Editorial Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C85419]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C85419] font-bold">
                  Atmosphere & Gastronomy
                </span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0D381E] mb-4">
                The Banquet Philosophy
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mb-4">
                {occasion.narrative}
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Strict Dietary Segregation:</strong> All vegetarian courses (such as Almond House sweets and Maharaja Chaat counters) are prepared, packed, and staged in 100% segregated thermal containers to ensure religious and dietary peace of mind.
                </p>
              </div>
            </div>

            {/* 2. Signature Dishes Showcase (With Food Images) */}
            <div id="dishes" className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C85419] font-bold block mb-1">
                    Degustation Lineup
                  </span>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0D381E]">
                    Curated Signature Courses
                  </h2>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline-block">
                  {occasion.signatureDishes?.length || 4} Dishes Pre-Configured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {occasion.signatureDishes?.map((dish, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl overflow-hidden border border-[#EDE8DF] hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Dish Visual Header */}
                    <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      {/* Dietary & Price Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            dish.dietary === 'VEG'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-700 text-white'
                          }`}
                        >
                          {dish.dietary === 'VEG' ? 'Pure Veg' : 'Non-Veg'}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md border border-white/20">
                          ₹{dish.pricePerHead}/head
                        </span>
                      </div>

                      {/* Partner Brand Name */}
                      <div className="absolute bottom-2.5 left-3">
                        <span className="text-xs font-bold text-amber-200 drop-shadow-sm flex items-center gap-1">
                          <ChefHat className="w-3 h-3 text-amber-300" />
                          {dish.partner}
                        </span>
                      </div>
                    </div>

                    {/* Dish Description */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 mb-1 group-hover:text-[#C85419] transition-colors">
                          {dish.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Calibrated for Banquet
                        </span>
                        <span className="font-bold text-[#0D381E]">Course {idx + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tasting Menu Structure & Course Pacing */}
            {occasion.courseStructure && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#C85419]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C85419] font-bold">
                    Banquet Choreography
                  </span>
                </div>
                <h3 className="font-serif font-extrabold text-2xl text-[#0D381E] mb-6">
                  Course Pacing & Service Flow
                </h3>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                  {occasion.courseStructure.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-1">
                      <div className="w-7 h-7 rounded-full bg-[#0D381E] text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white shadow-xs z-10">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE8DF]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="font-serif font-bold text-sm text-[#0D381E]">
                            {step.phase}
                          </h4>
                          <span className="text-[11px] font-semibold text-[#C85419]">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Featured Partner Institutions */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE8DF] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-[#C85419]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C85419] font-bold">
                  Heritage Guild
                </span>
              </div>
              <h3 className="font-serif font-extrabold text-2xl text-[#0D381E] mb-6">
                Culinary Partners in this Folio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {occasion.lineup.map((partner, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF] flex items-start gap-3.5 hover:border-emerald-600/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-[#0D381E] font-extrabold text-sm">
                      {partner.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {partner.role}
                      </p>
                      {partner.location && (
                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          📍 {partner.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Hospitality & White-Glove Inclusions */}
            <div className="bg-gradient-to-br from-[#0D381E] to-[#061A0E] text-white p-6 sm:p-8 rounded-3xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-bold">
                  Atelier Standards
                </span>
              </div>
              <h3 className="font-serif font-extrabold text-2xl text-white mb-6">
                Included in Every Food Tailor Banquet
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Synchronized multi-brand hot delivery in thermal insulated carriers.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Dedicated banquet captain overseeing setup & course pacing.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Chafing dishes, brass serveware, and elegant food labels.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Unified consolidated billing & corporate GST invoices.</span>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT ACTION SIDEBAR (4 COLUMNS)                        */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#0D381E] shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419]">
                  Degustation Staging
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Instant Estimate
                </span>
              </div>

              <h3 className="font-serif font-extrabold text-2xl text-slate-900 mb-2">
                Tailor This Feast
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">
                Calibrate this curated menu to your guest count, refine dishes, and activate multi-brand staging.
              </p>

              {/* Guest Count Slider */}
              <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8DF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Guest Count:</span>
                  <span className="font-serif text-lg font-bold text-[#0D381E]">
                    {guestCount} Covers
                  </span>
                </div>
                
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C85419]"
                />

                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>10 Guests</span>
                  <span>50 Guests</span>
                  <span>100 Guests</span>
                </div>
              </div>

              {/* Dietary Toggle */}
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Dietary Focus:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['ALL', 'PURE_VEG', 'NON_VEG'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietaryPreference(diet)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        dietaryPreference === diet
                          ? 'bg-[#0D381E] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-600 border border-[#EDE8DF] hover:border-slate-400'
                      }`}
                    >
                      {diet === 'ALL' ? 'Balanced' : diet === 'PURE_VEG' ? 'Pure Veg' : 'Non-Veg'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-2.5 pb-6 border-b border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Tasting Menu ({guestCount} × ₹{basePricePerHead})</span>
                  <span className="font-semibold text-slate-900">₹{estimatedSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Concierge & Staging Protocol (5%)</span>
                  <span className="font-semibold text-[#C85419]">₹{conciergeFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                  <span className="text-[#0D381E]">Estimated Total</span>
                  <span className="font-serif text-lg text-[#0D381E]">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <Link
                to={`/build-menu?occasion=${encodeURIComponent(occasion.id)}&guests=${guestCount}&diet=${dietaryPreference}`}
                className="btn-accent w-full mt-6 h-13 flex items-center justify-center gap-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg hover:scale-[1.02] active:scale-100 transition-transform"
              >
                <span>Proceed with This Curation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-center text-slate-400 mt-3 font-normal">
                No immediate payment required • Free consultation
              </p>
            </div>

            {/* Need Assistance Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C85419] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Custom Dietary or 100+ Guests?</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Our Culinary Concierge can curate personalized multi-city bakes & live counters.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
