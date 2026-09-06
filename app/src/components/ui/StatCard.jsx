'use client';

import React from 'react';

/**
 * StatCard — Structured metric card for Food Tailor dashboards.
 * Ensures zero collision between icon, label, and numerical values.
 * Layout:
 * ┌──────────────────────────────────────────────┐
 * │ [ICON]                                       │
 * │ LABEL                                        │
 * │ VALUE                                        │
 * │ Supporting text                              │
 * └──────────────────────────────────────────────┘
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  supportingText,
  accentColor = '#0D381E',
  className = '',
}) {
  return (
    <div
      className={`p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card-soft hover:shadow-card-hover hover:border-brand-forest/30 flex flex-col justify-between h-full transition-all group ${className}`}
    >
      <div className="flex items-center justify-between mb-4 gap-3">
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={2} />
          </div>
        )}
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-terracotta text-right flex-1 truncate">
          {label}
        </span>
      </div>

      <div>
        <div className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        {supportingText && (
          <p className="text-xs text-slate-500 mt-1 font-sans leading-relaxed">
            {supportingText}
          </p>
        )}
      </div>
    </div>
  );
}
