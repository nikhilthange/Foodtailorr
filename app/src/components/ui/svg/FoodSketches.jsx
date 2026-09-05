import React from 'react';

/**
 * Hand-drawn Culinary & Food Sketch SVG System
 * High-fidelity vector pencil art with authentic ink/graphite aesthetic.
 */

export function ClocheSketch({ className = 'w-8 h-8', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Handle */}
      <circle cx="32" cy="18" r="3.5" strokeWidth="1.6" />
      <path d="M32 21.5V25" />
      {/* Dome */}
      <path d="M12 45C13 32 21 25 32 25C43 25 51 32 52 45" />
      <path d="M16 43C17 34 23 28 32 28C41 28 47 34 48 43" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      {/* Base Platter */}
      <path d="M8 48C18 47.2 46 47.2 56 48M10 51C20 50.2 44 50.2 54 51" />
      <path d="M8 48L10 51M56 48L54 51" />
      {/* Texture hatch */}
      <path d="M38 32C41 35 43 39 44 43" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function BiryaniBowlSketch({ className = 'w-8 h-8', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Dum Handi Pot Rim */}
      <ellipse cx="32" cy="28" rx="20" ry="6" />
      <ellipse cx="32" cy="28" rx="17" ry="4.5" strokeWidth="1" opacity="0.5" />
      {/* Aromatic steam swirls */}
      <path d="M26 18C25 14 28 11 27 8M32 19C33 15 31 12 33 7M38 18C39 14 36 11 37 8" strokeWidth="1.4" opacity="0.75" />
      {/* Pot Belly */}
      <path d="M12 29C13 38 18 48 32 48C46 48 51 38 52 29" />
      {/* Side Handles */}
      <path d="M11 32C7 32 7 36 12 36M53 32C57 32 57 36 52 36" />
      {/* Pot Base */}
      <path d="M22 48C24 52 40 52 42 48" />
      {/* Rice Grains & Garnish */}
      <circle cx="28" cy="27" r="0.8" fill={color} />
      <circle cx="33" cy="29" r="0.8" fill={color} />
      <circle cx="37" cy="26" r="0.8" fill={color} />
    </svg>
  );
}

export function SamosaSketch({ className = 'w-8 h-8', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Triangular crisp pastry */}
      <path d="M32 12C31 15 15 44 14 47C17 50 47 50 50 47C49 44 33 15 32 12Z" />
      {/* Pinched Pleat Base */}
      <path d="M14 47C20 45 28 48 34 46C40 48 45 45 50 47" strokeWidth="1.4" />
      {/* Pastry Fold & Texture Hatch */}
      <path d="M32 13V45" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      <path d="M22 36L26 40M25 31L30 36M38 33L42 37" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function DosaSketch({ className = 'w-8 h-8', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Cylindrical rolled roast dosa */}
      <path d="M12 36L48 20C52 18 55 22 52 25L16 41C12 43 9 39 12 36Z" />
      <ellipse cx="15" cy="38.5" rx="3.5" ry="3.5" />
      <path d="M24 31C28 29 33 32 37 30M38 25C42 23 45 26 48 24" strokeWidth="1" opacity="0.6" />
      {/* Serving Banana Leaf Base */}
      <path d="M8 48C24 45 44 45 56 48" strokeWidth="1.5" />
    </svg>
  );
}

export function KebabSkewerSketch({ className = 'w-8 h-8', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Skewer Sword Rod */}
      <line x1="10" y1="54" x2="54" y2="10" strokeWidth="2" />
      {/* Skewer Handle Ring */}
      <circle cx="10" cy="54" r="3" strokeWidth="1.5" />
      {/* Kebab Cubes */}
      <rect x="18" y="38" width="8" height="8" rx="2" transform="rotate(-45 18 38)" />
      <rect x="27" y="29" width="8" height="8" rx="2" transform="rotate(-45 27 29)" />
      <rect x="36" y="20" width="8" height="8" rx="2" transform="rotate(-45 36 20)" />
      {/* Grill Char Marks */}
      <line x1="22" y1="41" x2="25" y2="44" strokeWidth="1.2" />
      <line x1="31" y1="32" x2="34" y2="35" strokeWidth="1.2" />
      <line x1="40" y1="23" x2="43" y2="26" strokeWidth="1.2" />
    </svg>
  );
}

export function DessertBowlSketch({ className = 'w-8 h-8', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Coupe Glass / Bowl */}
      <path d="M16 22C16 34 26 40 32 40C38 40 48 34 48 22H16Z" />
      <ellipse cx="32" cy="22" rx="16" ry="3" />
      {/* Stem & Base */}
      <line x1="32" y1="40" x2="32" y2="50" strokeWidth="2" />
      <path d="M24 52C28 50 36 50 40 52" strokeWidth="2" />
      {/* Scoops & Mint Sprig */}
      <circle cx="28" cy="18" r="4.5" />
      <circle cx="36" cy="18" r="4.5" />
      <path d="M32 14C32 10 34 9 36 9" strokeWidth="1.2" />
    </svg>
  );
}

export function BeverageCupSketch({ className = 'w-8 h-8', color = '#C55418' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Traditional Glass / Irani Chai Cup */}
      <path d="M20 20L23 48C23 50 41 50 41 48L44 20" />
      <ellipse cx="32" cy="20" rx="12" ry="3" />
      {/* Fluted Facets */}
      <line x1="26" y1="23" x2="27.5" y2="47" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="23" x2="32" y2="48" strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="23" x2="36.5" y2="47" strokeWidth="1" opacity="0.6" />
      {/* Saucer */}
      <path d="M14 54C22 52 42 52 50 54" strokeWidth="1.5" />
      {/* Steam */}
      <path d="M30 14C29 11 31 9 30 7M35 14C36 11 34 9 35 7" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

export function SpoonForkKnifeSketch({ className = 'w-8 h-8', color = '#173E23' }) {
  return (
    <svg className={`block ${className}`} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Fork (Left) */}
      <path d="M18 12V24M22 12V24M26 12V24" strokeWidth="1.4" />
      <path d="M18 24C18 28 26 28 26 24V18" />
      <path d="M22 28V52" strokeWidth="2" />
      {/* Knife (Right) */}
      <path d="M42 12C46 16 46 30 42 32V52" strokeWidth="2" />
    </svg>
  );
}
