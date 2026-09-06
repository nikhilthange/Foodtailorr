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
      className={`py-14 px-6 text-center bg-white rounded-3xl border border-slate-200/80 shadow-card-soft flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {Sketch ? (
        <div className="w-16 h-16 rounded-2xl bg-brand-forest/5 flex items-center justify-center mb-4 p-2">
          <Sketch className="w-12 h-12 text-brand-forest" color="#0D381E" />
        </div>
      ) : Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-brand-forest" strokeWidth={1.8} />
        </div>
      ) : null}
      <h3 className="font-serif text-xl font-bold text-slate-900 mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md font-sans leading-relaxed mb-6">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="btn-accent px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
        >
          {actionLabel}
        </Link>
      )}

      {onAction && !actionHref && (
        <button
          onClick={onAction}
          className="btn-accent px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
