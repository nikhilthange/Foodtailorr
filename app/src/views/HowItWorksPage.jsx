'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import BotanicalSprig from '../components/ui/svg/BotanicalSprig';
import {
  CalendarHeartSketch,
  PlateForkTasteSketch,
  CelebrationTableSketch,
} from '../components/ui/svg/ExperienceSketches';
import {
  PersonalizedMenuSketch,
  PaymentShieldSketch,
  KitchenAtelierSketch,
} from '../components/ui/svg/PlatformSketches';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STAGES = [
  {
    number: '01',
    title: 'Discover',
    tag: 'EXPLORATION',
    narrative:
      "Explore Hyderabad's most venerated culinary houses in one curated atelier directory. From the 1953 Old City copper-pot biryanis of Hotel Shadab to the single-origin craft chocolate of Manam, browse verified provenance and approved banquet repertoires.",
    IconComponent: KitchenAtelierSketch,
    color: '#173E23',
    highlights: ['11 Verified Culinary Institutions', 'Zero Ghost Kitchens', 'Audited Banquet Staging'],
  },
  {
    number: '02',
    title: 'Tell Us Your Moment',
    tag: 'INTENT & SCALE',
    narrative:
      'Every gathering possesses its own tempo. Share your occasion format—wedding banquet, milestone birthday, family feast, or corporate gala—along with headcount, event date, and dietary splits.',
    IconComponent: CalendarHeartSketch,
    color: '#C55418',
    highlights: ['Headcount & Venue Calibration', 'Pure Veg, Jain & Halal Ratios', 'Spice Tolerance Calibration'],
  },
  {
    number: '03',
    title: 'Tailor Your Menu',
    tag: 'CURATION INTELLIGENCE',
    narrative:
      'Our AI curation engine cross-references your dietary requirements against hundreds of authenticated recipes from approved institutions, synthesizing balanced multi-course degustation options with zero palate fatigue.',
    IconComponent: PersonalizedMenuSketch,
    color: '#173E23',
    highlights: ['Multi-Brand Course Balancing', 'Course Pacing Architecture', 'Transparent Per-Head Costing'],
  },
  {
    number: '04',
    title: 'Review',
    tag: 'REFINEMENT',
    narrative:
      'Examine your tailored folio with complete transparency. Swap or add signature dishes, inspect allergen isolations, adjust portion weights, and verify that both vegetarian and non-vegetarian guests receive an imperial spread.',
    IconComponent: PlateForkTasteSketch,
    color: '#C55418',
    highlights: ['Full Item-Level Customization', 'Segregated Kitchen Notes', 'Save Multiple Folio Drafts'],
  },
  {
    number: '05',
    title: 'Order',
    tag: 'SECURE COMMISSION',
    narrative:
      'Commission your feast with one consolidated payment. Behind the scenes, our platform issues synchronized kitchen tickets, reserves banquet production slots, and assigns a dedicated Food Tailor event concierge.',
    IconComponent: PaymentShieldSketch,
    color: '#173E23',
    highlights: ['Instant Payment Verification', 'Direct Kitchen Confirmation', 'Consolidated Event Invoicing'],
  },
  {
    number: '06',
    title: 'Enjoy',
    tag: 'FLAWLESS FEAST',
    narrative:
      'On celebration day, multiple kitchens deliver simultaneously in temperature-calibrated transit ware with tamper-evident seals. Your guests enjoy an unrivaled multi-brand feast without logistical chaos.',
    IconComponent: CelebrationTableSketch,
    color: '#C55418',
    highlights: ['Synchronized Warm Arrival', 'Signature Presentation Staging', 'Dedicated Concierge On Call'],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Header */}
      <section className="bg-[#173E23] text-[#FDF9F2] pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#C55418]" />
            The Six-Stage Methodology
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white leading-none">
            How Food Tailor Works
          </h1>
          <PencilUnderline className="w-56 h-3 my-3 mx-auto" color="#C55418" />
          <p className="mt-3 text-[#FDF9F2]/80 text-sm sm:text-lg max-w-2xl mx-auto font-serif italic font-light leading-relaxed">
            We replaced generic bulk catering contracts with culinary curation and a guild of master specialty kitchens.
          </p>
        </div>
      </section>

      {/* Visual Storytelling Pipeline with continuous hand-drawn line */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        <div className="relative">
          
          {/* Continuous Hand-drawn Connecting Spine Line (Desktop) */}
          <div className="hidden md:block absolute left-8 top-12 bottom-12 w-[3px] border-l-2 border-dashed border-[#C55418]/40 pointer-events-none -z-0" />

          <div className="space-y-12 md:space-y-16 relative z-10">
            {STAGES.map((stage) => {
              const Icon = stage.IconComponent;
              return (
                <div
                  key={stage.number}
                  className="sketch-card flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-[#FAF6EF] p-6 sm:p-8 rounded-2xl border border-[#EBE3D5] hover:border-[#173E23]/40 shadow-sm group transition-all"
                >
                  {/* Step Badge & Icon */}
                  <div className="flex-shrink-0 flex md:flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#173E23] text-white flex items-center justify-center font-display text-2xl uppercase tracking-wider shadow-md group-hover:bg-[#C55418] transition-colors">
                      {stage.number}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EBE3D5] flex items-center justify-center text-[#173E23] shadow-sm">
                      <Icon className="w-7 h-7" color={stage.color} />
                    </div>
                  </div>

                  {/* Narrative Body */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418]">
                        {stage.tag}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23] group-hover:text-[#C55418] transition-colors mb-3">
                      {stage.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#424941] leading-relaxed font-light mb-6">
                      {stage.narrative}
                    </p>

                    {/* Highlights Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#EBE3D5]">
                      {stage.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg text-xs text-[#173E23] font-medium border border-[#EBE3D5]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 p-8 bg-[#173E23] text-white rounded-2xl shadow-xl text-center relative overflow-hidden flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <BotanicalSprig className="w-7 h-7 text-white" color="#FFFFFF" />
          </div>

          <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wider mb-2">
            Ready to tailor your next feast?
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mb-6 font-light font-serif italic">
            Launch our interactive concierge wizard and configure your multi-course banquet in minutes.
          </p>

          <Link
            to="/build-menu"
            className="px-8 py-4 bg-[#C55418] hover:bg-[#a33e00] text-white font-display text-xl uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2.5"
          >
            <span>Commission Your Menu</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
