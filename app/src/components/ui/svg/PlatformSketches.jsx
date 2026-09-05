import React from 'react';

/**
 * Platform & Concierge Architecture Sketch SVG System
 */

export function PersonalizedMenuSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Bound Leather Menu Folio */}
      <rect x="14" y="10" width="36" height="44" rx="4" />
      <line x1="22" y1="10" x2="22" y2="54" strokeWidth="1.5" />
      {/* Ribbon Bookmark */}
      <path d="M28 10V28L32 25L36 28V10" fill="#C55418" stroke="#C55418" strokeWidth="1.2" />
      {/* Editorial Content Lines */}
      <line x1="26" y1="34" x2="44" y2="34" strokeWidth="1.4" />
      <line x1="26" y1="40" x2="40" y2="40" strokeWidth="1.2" opacity="0.6" />
      <line x1="26" y1="46" x2="42" y2="46" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export function AiMagicWandSketch({ className = 'w-10 h-10', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Stylized Architectural Pencil / Calibrator Wand */}
      <line x1="12" y1="52" x2="44" y2="20" strokeWidth="2.4" />
      <polygon points="12,52 14,46 18,50" fill={color} />
      <line x1="40" y1="16" x2="48" y2="24" strokeWidth="1.5" />
      {/* Sparks & Creative Nodes */}
      <path d="M46 14L48 8L50 14L56 16L50 18L48 24L46 18L40 16Z" fill="#C55418" fillOpacity="0.3" stroke="#C55418" strokeWidth="1.4" />
      <circle cx="34" cy="14" r="1.5" fill="#173E23" stroke="#173E23" />
      <circle cx="52" cy="30" r="1.5" fill="#173E23" stroke="#173E23" />
      <circle cx="24" cy="32" r="1.2" fill="#C55418" stroke="#C55418" />
    </svg>
  );
}

export function KitchenAtelierSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Traditional Heritage Kitchen Canopy */}
      <path d="M10 24L32 12L54 24" strokeWidth="2" />
      <path d="M14 24V50H50V24" />
      {/* Awning stripes */}
      <line x1="14" y1="24" x2="18" y2="34" strokeWidth="1.2" />
      <line x1="26" y1="24" x2="26" y2="34" strokeWidth="1.2" />
      <line x1="38" y1="24" x2="38" y2="34" strokeWidth="1.2" />
      <line x1="50" y1="24" x2="46" y2="34" strokeWidth="1.2" />
      <path d="M14 34C18 36 22 36 26 34C30 36 34 36 38 34C42 36 46 36 50 34" strokeWidth="1.4" />
      {/* Counter & Copper Pot */}
      <line x1="20" y1="44" x2="44" y2="44" strokeWidth="1.4" />
      <ellipse cx="32" cy="42" rx="6" ry="2" />
    </svg>
  );
}

export function OrderTrackingTimelineSketch({ className = 'w-10 h-10', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Wavy Hand-drawn Progression Line */}
      <path d="M10 32C16 26 22 38 32 32C42 26 48 38 54 32" strokeWidth="2" strokeDasharray="3 3" />
      {/* Milestone Nodes */}
      <circle cx="12" cy="32" r="4" fill="#173E23" stroke="#173E23" />
      <circle cx="32" cy="32" r="5" fill="#C55418" stroke="#C55418" />
      <circle cx="52" cy="32" r="4" fill="#FFFFFF" stroke="#173E23" strokeWidth="2" />
      {/* Flag at destination */}
      <line x1="52" y1="32" x2="52" y2="16" strokeWidth="1.5" />
      <polygon points="52,16 60,20 52,24" fill="#173E23" stroke="#173E23" />
    </svg>
  );
}

export function PaymentShieldSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Heritage Heraldic Seal / Shield */}
      <path d="M32 10L48 16V30C48 42 32 52 32 52C32 52 16 42 16 30V16L32 10Z" />
      <path d="M32 14L44 19V29C44 38 32 46 32 46C32 46 20 38 20 29V19L32 14Z" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      {/* Checkmark in center */}
      <path d="M26 31L30 35L38 27" strokeWidth="2.2" stroke={color} />
    </svg>
  );
}
