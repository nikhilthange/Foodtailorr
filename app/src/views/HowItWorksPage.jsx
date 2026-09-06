'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import { ArrowRight, CheckCircle2, Sparkles, Compass, Calendar, Sliders, CheckSquare, CreditCard, PartyPopper } from 'lucide-react';

const STAGES = [
  {
    number: '01',
    title: 'Discover Heritage Houses',
    tag: 'EXPLORATION',
    narrative:
      "Explore Hyderabad's most venerated culinary houses in one curated atelier directory. From the 1953 Old City copper-pot biryanis of Hotel Shadab to the single-origin craft chocolate of Manam, browse verified provenance and approved banquet repertoires.",
    icon: Compass,
    highlights: ['11 Verified Culinary Institutions', 'Zero Ghost Kitchens', 'Audited Banquet Staging'],
  },
  {
    number: '02',
    title: 'Tell Us Your Moment',
    tag: 'INTENT & SCALE',
    narrative:
      'Every gathering possesses its own tempo. Share your occasion format—wedding banquet, milestone birthday, family feast, or corporate gala—along with headcount, event date, and dietary splits.',
    icon: Calendar,
    highlights: ['Headcount & Venue Calibration', 'Pure Veg, Jain & Halal Ratios', 'Spice Tolerance Calibration'],
  },
  {
    number: '03',
    title: 'Tailor Your Menu',
    tag: 'CURATION INTELLIGENCE',
    narrative:
      'Our AI curation engine cross-references your dietary requirements against hundreds of authenticated recipes from approved institutions, synthesizing balanced multi-course degustation options with zero palate fatigue.',
    icon: Sliders,
    highlights: ['Multi-Brand Course Balancing', 'Course Pacing Architecture', 'Transparent Per-Head Costing'],
  },
  {
    number: '04',
    title: 'Review & Customize',
    tag: 'REFINEMENT',
    narrative:
      'Examine your tailored folio with complete transparency. Swap or add signature dishes, inspect allergen isolations, adjust portion weights, and verify that both vegetarian and non-vegetarian guests receive an imperial spread.',
    icon: CheckSquare,
    highlights: ['Full Item-Level Customization', 'Segregated Kitchen Notes', 'Save Multiple Folio Drafts'],
  },
  {
    number: '05',
    title: 'Commission With One Payment',
    tag: 'SECURE COMMISSION',
    narrative:
      'Commission your feast with one consolidated payment. Behind the scenes, our platform issues synchronized kitchen tickets, reserves banquet production slots, and assigns a dedicated Food Tailor event concierge.',
    icon: CreditCard,
    highlights: ['Instant Payment Verification', 'Direct Kitchen Confirmation', 'Consolidated Event Invoicing'],
  },
  {
    number: '06',
    title: 'Enjoy The Flawless Feast',
    tag: 'FLAWLESS FEAST',
    narrative:
      'On celebration day, multiple kitchens deliver simultaneously in temperature-calibrated transit ware with tamper-evident seals. Your guests enjoy an unrivaled multi-brand feast without logistical chaos.',
    icon: PartyPopper,
    highlights: ['Synchronized Warm Arrival', 'Signature Presentation Staging', 'Dedicated Concierge On Call'],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Luxury Porcelain Editorial Header */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>The Six-Stage Methodology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            How Food Tailor Works
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            We replaced generic bulk catering contracts with culinary curation and a verified guild of master specialty kitchens.
          </p>
        </div>
      </section>

      {/* 6 Stages Timeline Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.number}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card-soft hover:shadow-card-hover hover:border-brand-forest/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-terracotta flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-terracotta">
                          Stage {stage.number} • {stage.tag}
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                        {stage.title}
                      </h2>
                    </div>
                  </div>

                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-200 self-start md:self-center">
                    {stage.number}
                  </span>
                </div>

                <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <p className="lg:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {stage.narrative}
                  </p>

                  <div className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    {stage.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
        <div className="mt-14 p-8 sm:p-12 bg-white rounded-3xl border-2 border-brand-forest text-center relative overflow-hidden shadow-card-soft">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta block mb-2">
              Ready To Orchestrate?
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 mb-4">
              Tailor Your Multi-Brand Feast Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
              Experience the unmatched luxury of iconic dishes from Hyderabad's premier institutions, calibrated to your exact guest count and dietary needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/build-menu"
                className="btn-accent w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Start Tailoring A Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="btn-secondary w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                <span>Browse All Kitchens</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
