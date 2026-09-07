'use client';

import React, { useState } from 'react';
import { Link } from '../lib/navigation';
import { MapPin, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop';

export default function PartnerCard({ partner }) {
  const [imgSrc, setImgSrc] = useState(partner.coverImageUrl || partner.imageUrl || FALLBACK_IMAGE);
  const [imgError, setImgError] = useState(false);

  const name = partner.businessName || partner.name || 'Artisanal Kitchen';
  const cuisine = partner.cuisine || 'Curated Culinary';
  const location = partner.location || 'Hyderabad, Telangana';
  const established = partner.established ? `Est. ${partner.established}` : null;
  const slug = partner.slug || partner.id || '';

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#EDE8DF] hover:border-amber-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Aspect-Ratio Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={imgError ? FALLBACK_IMAGE : imgSrc}
          alt={name}
          loading="lazy"
          onError={() => {
            setImgError(true);
            setImgSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges: Verified Indicator & Heritage Est */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D381E]/90 text-amber-200 backdrop-blur-md shadow-sm border border-amber-400/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Atelier</span>
          </span>

          {established && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/10">
              {established}
            </span>
          )}
        </div>

        {/* Bottom Cuisine Pill & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider bg-[#C85419] text-white shadow-sm text-[11px]">
            {cuisine}
          </span>
          <div className="flex items-center gap-1 bg-black/60 text-amber-300 px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10 text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Partner Name & Tagline */}
          <div className="mb-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#C85419] transition-colors leading-tight">
              {name}
            </h3>
            {partner.tagline && (
              <p className="text-xs italic text-slate-500 mt-1 line-clamp-1">
                &ldquo;{partner.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Location with Icon */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-[#C85419] shrink-0" />
            <span className="truncate font-medium">{location}</span>
          </div>

          {/* Heritage Description */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-5 font-normal">
            {partner.description || partner.whyWePicked || 'Exquisite banquet dining crafted with traditional Hyderabadi culinary heritage.'}
          </p>
        </div>

        {/* Action Button: VIEW KITCHEN */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            to={`/partners/${slug}`}
            className="btn-primary w-full py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:shadow-lg transition-all"
          >
            <span>Explore Atelier</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

