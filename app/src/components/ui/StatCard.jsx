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
  accentColor = '#173E23',
  className = '',
}) {
  return (
    <div
      className={`sketch-card p-5 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-3 gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={2} />
          </div>
        )}
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C55418] text-right flex-1 truncate">
          {label}
        </span>
      </div>

      <div className="mt-1">
        <div className="font-serif text-2xl sm:text-3xl font-bold text-[#173E23] tracking-tight">
          {value}
        </div>
        {supportingText && (
          <p className="text-xs text-[#1c1c18]/70 mt-1 font-sans leading-relaxed">
            {supportingText}
          </p>
        )}
      </div>
    </div>
  );
}
