'use client';

import React, { useState } from 'react';
import { Link } from '../lib/navigation';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { getPartnerCoverImage } from '../lib/brandImageMap';

export default function PartnerCard({ partner }) {
  const authenticImg = getPartnerCoverImage(partner);
  const [imgSrc, setImgSrc] = useState(authenticImg);
  const [imgError, setImgError] = useState(false);

  const name = partner.businessName || partner.name || 'Restaurant';
  const cuisine = partner.cuisine || 'Curated Dining';
  const location = partner.location || 'Hyderabad';
  const established = partner.established ? `Est. ${partner.established}` : null;
  const slug = partner.slug || partner.id || '';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#EAE5DC] hover:border-[#D1C9BC] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={imgError ? authenticImg : imgSrc}
          alt={name}
          loading="lazy"
          onError={() => {
            setImgError(true);
            setImgSrc(authenticImg);
          }}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
            {cuisine}
          </span>

          {established && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white backdrop-blur-xs">
              {established}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C85419] transition-colors leading-snug">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0 pt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {partner.description || partner.whyWePicked || 'Iconic dishes prepared fresh and coordinated for your event.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100">
          <Link
            to={`/partners/${slug}`}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-[#0D2418] text-slate-800 hover:text-white border border-slate-200 hover:border-transparent text-xs font-semibold tracking-normal flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

