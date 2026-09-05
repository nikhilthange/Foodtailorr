'use client';

import React from 'react';
import { Link, useParams } from '../lib/navigation';
import { OCCASIONS_DATA } from './OccasionsPage';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import BotanicalSprig from '../components/ui/svg/BotanicalSprig';
import { ArrowRight, Check, Users, ArrowLeft } from 'lucide-react';

export default function OccasionDetailPage() {
  const { slug } = useParams();
  
  const occasion = OCCASIONS_DATA.find((o) => o.slug === slug || o.id === slug) || OCCASIONS_DATA[0];
  const Icon = occasion.IconComponent;

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Hero Banner */}
      <section className="relative h-[48vh] min-h-[360px] bg-[#0A0D0B] text-white flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={occasion.image}
          alt={occasion.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0B] via-[#0A0D0B]/50 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <Link
            to="/occasions"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C55418] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Occasions</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#173E23]">
              <Icon className="w-7 h-7" color={occasion.accentColor} />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#173E23]/90 text-white border border-white/10 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{occasion.guestRange}</span>
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white leading-none">
            {occasion.title}
          </h1>
          <PencilUnderline className="w-56 h-3 my-2" color="#C55418" />
          <p className="font-serif italic text-base sm:text-lg text-[#FDF9F2]/90 max-w-2xl font-light">
            &ldquo;{occasion.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* Main Content Workspace */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BotanicalSprig className="w-6 h-6 text-[#173E23]" color="#173E23" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C55418] font-bold">
                  Atmosphere & Gastronomy
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#173E23] mb-4">
                The Banquet Philosophy
              </h2>
              <p className="text-sm sm:text-base text-[#424941] leading-relaxed font-light mb-6">
                {occasion.narrative}
              </p>
              <p className="text-xs sm:text-sm text-[#595347] leading-relaxed font-light">
                Every Food Tailor commission includes dedicated staging logistics, dietary segregation guarantees, minute-accurate timing, and our signature presentation chafers.
              </p>
            </div>

            {/* Curated Partner Lineup Details */}
            <div className="p-6 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5]">
              <h3 className="font-serif font-bold text-lg text-[#173E23] mb-4">
                Recommended Culinary Institutions
              </h3>
              <div className="space-y-3.5">
                {occasion.lineup.map((partner, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#EBE3D5]">
                    <div className="w-6 h-6 rounded-full bg-[#173E23]/10 text-[#173E23] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#173E23]">{partner.name}</h4>
                      <p className="text-xs text-[#7C6F5A] mt-0.5">{partner.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Action & Pre-fill Card */}
          <div className="lg:col-span-5">
            <div className="sketch-card p-6 sm:p-8 rounded-2xl border-2 border-[#173E23] sticky top-24 shadow-xl">
              <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold block mb-1">
                Private Concierge Desk
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#173E23] mb-3">
                Tailor This Banquet
              </h3>
              <p className="text-xs text-[#595347] leading-relaxed font-light mb-6">
                Launch the interactive Menu Builder with pre-calibrated defaults for {occasion.title}. Customize courses, guests, spice profiles, and dietary splits.
              </p>

              <div className="space-y-3 mb-6 text-xs text-[#424941]">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Format</span>
                  <strong className="text-[#173E23]">{occasion.title}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Scale</span>
                  <strong className="text-[#173E23]">{occasion.guestRange}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Partners</span>
                  <strong className="text-[#173E23]">{occasion.lineup.length} Verified Houses</strong>
                </div>
              </div>

              <Link
                to={`/build-menu?occasion=${encodeURIComponent(occasion.id)}`}
                className="w-full py-3.5 px-6 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Launch Menu Builder</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
