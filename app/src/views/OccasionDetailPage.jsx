'use client';

import React from 'react';
import { Link, useParams } from '../lib/navigation';
import { OCCASIONS_DATA } from './OccasionsPage';
import { ArrowRight, Check, Users, ArrowLeft, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';

export default function OccasionDetailPage() {
  const { slug } = useParams();
  
  const occasion = OCCASIONS_DATA.find((o) => o.slug === slug || o.id === slug) || OCCASIONS_DATA[0];
  const Icon = occasion.IconComponent;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      {/* Editorial Hero Banner */}
      <section className="relative h-[48vh] min-h-[380px] bg-slate-950 text-white flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={occasion.image}
          alt={occasion.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <Link
            to="/occasions"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-terracotta hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Occasions</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-brand-forest shadow-md">
              <Icon className="w-7 h-7" color={occasion.accentColor} />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white border border-white/15 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{occasion.guestRange}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-2">
            {occasion.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl font-normal">
            &ldquo;{occasion.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* Main Content Workspace */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card-soft">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-terracotta" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-terracotta font-bold">
                  Atmosphere & Gastronomy
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-brand-forest mb-4">
                The Banquet Philosophy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                {occasion.narrative}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                Every Food Tailor experience includes coordinated multi-kitchen delivery, dietary accommodations, and our signature presentation setup.
              </p>
            </div>

            {/* Curated Partner Lineup Details */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card-soft">
              <h3 className="font-serif font-bold text-lg text-brand-forest mb-4">
                Recommended Culinary Institutions
              </h3>
              <div className="space-y-3">
                {occasion.lineup.map((partner, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-brand-forest flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-brand-forest">{partner.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{partner.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-brand-forest sticky top-24 shadow-card-soft">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-terracotta block mb-1">
                Degustation Staging
              </span>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mb-3">
                Tailor This Feast
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">
                Activate the automated curation engine calibrated around this occasion to build your custom multi-brand tasting folio.
              </p>

              <div className="space-y-3 pb-6 border-b border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-forest" />
                  <span>Dietary Separation Accommodations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-terracotta" />
                  <span>Synchronized Multi-Brand Logistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-forest" />
                  <span>Dedicated Event Support</span>
                </div>
              </div>

              <Link
                to={`/build-menu?occasion=${encodeURIComponent(occasion.id)}`}
                className="btn-accent w-full mt-6 h-12 flex items-center justify-center gap-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md"
              >
                <span>Tailor This Banquet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
