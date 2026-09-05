'use client';

import React, { useState } from 'react';
import { Link } from '../lib/navigation';

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
    <div className="group relative bg-[#FAFAF8] rounded-2xl overflow-hidden border border-[#E5E5E0] hover:border-[#173E23]/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Aspect-Ratio Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#F2EFE6]">
        <img
          src={imgError ? FALLBACK_IMAGE : imgSrc}
          alt={name}
          loading="lazy"
          onError={() => {
            setImgError(true);
            setImgSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges: Verified Indicator & Heritage Est */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#173E23] text-white backdrop-blur-md shadow-xs border border-white/10">
            <i className="bi bi-patch-check-fill text-emerald-300 text-xs" />
            <span>Verified Atelier</span>
          </span>

          {established && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider uppercase bg-[#1A1A1A]/85 text-[#FAFAF8] backdrop-blur-md border border-white/10">
              {established}
            </span>
          )}
        </div>

        {/* Bottom Cuisine Pill */}
        <div className="absolute bottom-3 left-3 text-xs">
          <span className="px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-[#C65518] text-white shadow-xs">
            {cuisine}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#FAFAF8]">
        <div>
          {/* Partner Name & Tagline */}
          <div className="mb-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173E23] group-hover:text-[#C65518] transition-colors leading-tight">
              {name}
            </h3>
            {partner.tagline && (
              <p className="text-xs italic text-[#1A1A1A]/70 mt-1 font-sans line-clamp-1">
                &ldquo;{partner.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Location with Icon */}
          <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/75 mb-3.5">
            <i className="bi bi-geo-alt text-[#C65518] text-sm shrink-0" />
            <span className="truncate font-medium">{location}</span>
          </div>

          {/* Heritage Description */}
          <p className="text-xs text-[#1A1A1A]/80 leading-relaxed line-clamp-2 mb-5 font-normal">
            {partner.description || partner.whyWePicked || 'Exquisite banquet dining crafted with traditional Hyderabadi culinary heritage.'}
          </p>
        </div>

        {/* Action Button: VIEW KITCHEN */}
        <div className="pt-4 border-t border-[#E5E5E0] flex items-center justify-between gap-3">
          <Link
            href={`/partners/${slug}`}
            to={`/partners/${slug}`}
            className="btn-primary w-full py-2.5 text-xs text-center"
          >
            <span>View Kitchen</span>
            <i className="bi bi-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
