'use client';

import React from 'react';
import Link from 'next/link';

/**
 * EmptyState — Standardized empty state message with sketch accents and action CTA.
 */
export default function EmptyState({
  icon: Icon,
  sketch: Sketch,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`py-14 px-6 text-center bg-[#FAF6EF] rounded-3xl border border-[#EBE3D5] flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {Sketch ? (
        <div className="w-16 h-16 rounded-2xl bg-[#173E23]/5 flex items-center justify-center mb-4 p-2">
          <Sketch className="w-12 h-12 text-[#173E23]" color="#173E23" />
        </div>
      ) : Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-[#173E23]/10 text-[#173E23] flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-[#173E23]" strokeWidth={1.8} />
        </div>
      ) : null}
      <h3 className="font-serif text-xl font-bold text-[#173E23] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#1c1c18]/70 max-w-md font-sans leading-relaxed mb-6">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="px-5 py-2.5 bg-[#C55418] hover:bg-[#d95d1c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
        >
          {actionLabel}
        </Link>
      )}

      {onAction && !actionHref && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#C55418] hover:bg-[#d95d1c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
