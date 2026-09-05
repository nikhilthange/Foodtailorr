import React from 'react';

/**
 * Handcrafted Experience & Occasion Sketch SVG System
 * Used for the 4 How-It-Works Steps and the 8 Occasion cards.
 */

// STEP 01: Calendar + Hand-drawn Heart
export function CalendarHeartSketch({ className = 'w-12 h-12', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Calendar Frame */}
      <rect x="12" y="14" width="40" height="38" rx="6" />
      {/* Binder Rings */}
      <line x1="22" y1="10" x2="22" y2="16" strokeWidth="2.2" />
      <line x1="42" y1="10" x2="42" y2="16" strokeWidth="2.2" />
      {/* Header Divider */}
      <line x1="12" y1="24" x2="52" y2="24" strokeWidth="1.4" />
      {/* Hand-drawn Heart in center */}
      <path
        d="M32 44C32 44 22 37 22 31C22 28 24.5 26 27.5 26C29.5 26 31.5 27.5 32 29C32.5 27.5 34.5 26 36.5 26C39.5 26 42 28 42 31C42 37 32 44 32 44Z"
        fill="#C55418"
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

// STEP 02: Plate + Fork + Taste Profile
export function PlateForkTasteSketch({ className = 'w-12 h-12', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Plate Circles */}
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="16" strokeDasharray="2 3" opacity="0.6" />
      <circle cx="32" cy="32" r="9" strokeWidth="1.2" opacity="0.4" />
      {/* Fork Silhouette overlay */}
      <path d="M26 20V27M29 20V27M32 20V27" strokeWidth="1.3" />
      <path d="M26 27C26 30 32 30 32 27" strokeWidth="1.3" />
      <path d="M29 30V44" strokeWidth="1.6" />
      {/* Taste Sparkle Stars */}
      <path d="M42 22L44 26L48 27L44 29L43 33L40 30L36 30L39 27L38 23L42 25Z" fill="#C55418" fillOpacity="0.2" stroke="#C55418" strokeWidth="1.2" />
    </svg>
  );
}

// STEP 03: Chef + Menu
export function ChefMenuSketch({ className = 'w-12 h-12', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Mini Chef Hat */}
      <path d="M26 24C23 22 21 17 23 13C25 11 28 11 30 12C30 8 34 5 39 5C43 5 46 8 45 12C47 11 50 12 51 14C52 18 50 22 46 24" />
      <path d="M26 24H46V28H26V24Z" />
      {/* Menu Folio / Parchment Sheet */}
      <rect x="14" y="24" width="26" height="34" rx="3" fill="#FDF9F2" />
      {/* Menu Lines */}
      <line x1="20" y1="32" x2="34" y2="32" strokeWidth="1.5" />
      <line x1="20" y1="38" x2="32" y2="38" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="44" x2="35" y2="44" strokeWidth="1.2" opacity="0.6" />
      <line x1="20" y1="50" x2="28" y2="50" strokeWidth="1.2" opacity="0.6" />
      {/* Quill / Pen */}
      <path d="M44 36L48 48L42 46Z" strokeWidth="1.4" />
    </svg>
  );
}

// STEP 04: Celebration Table
export function CelebrationTableSketch({ className = 'w-12 h-12', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Table Surface & Drape */}
      <ellipse cx="32" cy="36" rx="24" ry="7" />
      <path d="M8 36V46C8 49 56 49 56 46V36" strokeWidth="1.5" />
      {/* Table Legs */}
      <line x1="16" y1="48" x2="14" y2="58" strokeWidth="2" />
      <line x1="48" y1="48" x2="50" y2="58" strokeWidth="2" />
      {/* Candles & Wine Glasses */}
      <path d="M22 26V35M42 26V35" strokeWidth="1.4" />
      <path d="M22 23C23 21 21 19 22 17C23 19 23 21 22 23Z" fill="#C55418" stroke="#C55418" />
      <path d="M42 23C43 21 41 19 42 17C43 19 43 21 42 23Z" fill="#C55418" stroke="#C55418" />
      {/* Center Cloche */}
      <path d="M28 34C28 29 36 29 36 34" strokeWidth="1.4" />
      <circle cx="32" cy="28.5" r="1.5" />
      {/* Sparkles of Joy */}
      <path d="M12 18L14 20M52 18L50 20M32 10V14" strokeWidth="1.2" opacity="0.75" />
    </svg>
  );
}

// Birthday Occasion Card Artwork
export function BirthdayCakeSketch({ className = 'w-10 h-10', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* 2-tier Cake */}
      <rect x="14" y="34" width="36" height="18" rx="3" />
      <rect x="20" y="22" width="24" height="12" rx="2" />
      {/* Icing drips */}
      <path d="M20 27C22 29 24 26 26 28C28 29 30 26 32 28C34 29 36 26 38 28C40 29 42 26 44 27" strokeWidth="1.2" />
      {/* Candles */}
      <line x1="26" y1="16" x2="26" y2="22" strokeWidth="1.6" />
      <line x1="32" y1="16" x2="32" y2="22" strokeWidth="1.6" />
      <line x1="38" y1="16" x2="38" y2="22" strokeWidth="1.6" />
      {/* Candle flames */}
      <circle cx="26" cy="13" r="1.5" fill="#C55418" />
      <circle cx="32" cy="13" r="1.5" fill="#C55418" />
      <circle cx="38" cy="13" r="1.5" fill="#C55418" />
      {/* Platter base */}
      <line x1="10" y1="52" x2="54" y2="52" strokeWidth="2" />
    </svg>
  );
}

// Anniversary Occasion Card Artwork
export function AnniversaryRingsSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Interlocking Rings */}
      <circle cx="25" cy="34" r="14" strokeWidth="2.2" />
      <circle cx="39" cy="34" r="14" strokeWidth="2.2" />
      {/* Diamond Gem on Top */}
      <path d="M25 15L29 20L25 24L21 20Z" fill="#C55418" stroke="#C55418" strokeWidth="1.4" />
      {/* Shine lines */}
      <line x1="25" y1="10" x2="25" y2="12" stroke="#C55418" strokeWidth="1.4" />
      <line x1="19" y1="13" x2="21" y2="15" stroke="#C55418" strokeWidth="1.4" />
      <line x1="31" y1="13" x2="29" y2="15" stroke="#C55418" strokeWidth="1.4" />
    </svg>
  );
}

// Family Gathering Card Artwork
export function FamilyFeastSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Round Dastarkhwan Banquet Table */}
      <ellipse cx="32" cy="36" rx="22" ry="12" />
      <ellipse cx="32" cy="36" rx="14" ry="7" strokeDasharray="2 3" opacity="0.6" />
      {/* Multiple Dishes */}
      <ellipse cx="24" cy="34" rx="4" ry="2.5" fill="#C55418" fillOpacity="0.2" />
      <ellipse cx="40" cy="34" rx="4" ry="2.5" fill="#C55418" fillOpacity="0.2" />
      <ellipse cx="32" cy="38" rx="5" ry="3" />
      {/* Surrounding Guests Heads */}
      <circle cx="16" cy="22" r="4" strokeWidth="1.5" />
      <circle cx="32" cy="18" r="4" strokeWidth="1.5" />
      <circle cx="48" cy="22" r="4" strokeWidth="1.5" />
    </svg>
  );
}

// Corporate Gathering Card Artwork
export function CorporateMeetingSketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Briefcase / Executive Bento Box */}
      <rect x="14" y="24" width="36" height="26" rx="4" />
      <path d="M24 24V18C24 16 26 14 28 14H36C38 14 40 16 40 18V24" strokeWidth="2" />
      <line x1="14" y1="36" x2="50" y2="36" strokeWidth="1.4" />
      {/* Lock latch */}
      <rect x="29" y="33" width="6" height="6" rx="1" fill={color} />
      {/* Modern Skyline Silhouette */}
      <path d="M18 20V16H22V24M42 24V14H46V20" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

// Romantic Dinner Card Artwork
export function RomanticDinnerSketch({ className = 'w-10 h-10', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Two Wine Glasses Clinking */}
      <path d="M22 20C22 28 28 32 30 32V46M30 46H24M30 46H36" />
      <ellipse cx="25" cy="20" rx="5" ry="2" />
      <path d="M42 20C42 28 36 32 34 32V46M34 46H40" />
      <ellipse cx="39" cy="20" rx="5" ry="2" />
      {/* Heart floating above */}
      <path d="M32 18C32 18 26 13 26 9C26 7 28 5 30 5C31.5 5 32 6 32 7C32 6 32.5 5 34 5C36 5 38 7 38 9C38 13 32 18 32 18Z" fill="#C55418" stroke="#C55418" strokeWidth="1.2" />
    </svg>
  );
}

// Festival Lamp Card Artwork
export function FestivalLampSketch({ className = 'w-10 h-10', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Traditional Diya / Deepam */}
      <path d="M12 38C14 46 22 50 32 50C42 50 50 46 52 38H12Z" />
      <ellipse cx="32" cy="38" rx="20" ry="4" />
      {/* Base */}
      <path d="M26 50L24 56H40L38 50" strokeWidth="1.6" />
      {/* Flame */}
      <path d="M32 14C35 20 38 24 38 29C38 33 35 36 32 36C29 36 26 33 26 29C26 24 29 20 32 14Z" fill="#C55418" fillOpacity="0.25" stroke="#C55418" strokeWidth="1.8" />
      {/* Radiating Light Rays */}
      <line x1="32" y1="8" x2="32" y2="11" strokeWidth="1.4" />
      <line x1="22" y1="14" x2="25" y2="17" strokeWidth="1.4" />
      <line x1="42" y1="14" x2="39" y2="17" strokeWidth="1.4" />
    </svg>
  );
}

// Weekend Celebration Card Artwork
export function WeekendPartySketch({ className = 'w-10 h-10', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Confetti & Streamers with Cocktail */}
      <path d="M20 22L32 36V48M26 48H38" strokeWidth="1.8" />
      <line x1="16" y1="22" x2="48" y2="22" strokeWidth="1.8" />
      <circle cx="32" cy="18" r="2.5" fill="#C55418" stroke="#C55418" />
      {/* Confetti spirals */}
      <path d="M12 14C16 12 14 8 18 8M46 14C50 12 48 8 52 8" strokeWidth="1.4" stroke="#C55418" />
      <polygon points="14,32 16,35 12,36" fill="#173E23" />
      <polygon points="50,32 52,35 48,36" fill="#C55418" />
    </svg>
  );
}
