import React from 'react';

/**
 * SpiceScatter component renders scattered chili flakes and peppercorns
 * in Tailor Orange (#C55418) or custom color, adding artisanal culinary flair.
 */
export default function SpiceScatter({ 
  className = 'w-32 h-32', 
  color = '#C55418' 
}) {
  return (
    <svg 
      className={`pointer-events-none select-none ${className}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cluster of peppercorns & crushed chili flakes */}
      <circle cx="12" cy="18" r="2.5" fill={color} opacity="0.9" />
      <circle cx="22" cy="14" r="1.5" fill={color} opacity="0.7" />
      <circle cx="8" cy="30" r="1.8" fill={color} opacity="0.8" />
      <ellipse cx="28" cy="26" rx="3.5" ry="2" transform="rotate(25 28 26)" fill={color} opacity="0.95" />
      <circle cx="18" cy="38" r="1.2" fill={color} opacity="0.6" />
      <ellipse cx="36" cy="16" rx="2.5" ry="1.2" transform="rotate(-15 36 16)" fill={color} opacity="0.85" />
      <circle cx="44" cy="24" r="2" fill={color} opacity="0.75" />
      <circle cx="32" cy="42" r="3" fill={color} opacity="0.9" />
      <ellipse cx="48" cy="36" rx="3" ry="1.5" transform="rotate(40 48 36)" fill={color} opacity="0.8" />
      <circle cx="58" cy="18" r="1.5" fill={color} opacity="0.7" />
      <ellipse cx="64" cy="28" rx="3" ry="1.8" transform="rotate(-30 64 28)" fill={color} opacity="0.9" />
      <circle cx="72" cy="14" r="2.2" fill={color} opacity="0.85" />
      <circle cx="52" cy="48" r="1.6" fill={color} opacity="0.6" />
      <ellipse cx="62" cy="44" rx="2.8" ry="1.4" transform="rotate(15 62 44)" fill={color} opacity="0.75" />
      <circle cx="78" cy="32" r="1.4" fill={color} opacity="0.65" />
      <circle cx="84" cy="22" r="2" fill={color} opacity="0.8" />
      <ellipse cx="88" cy="38" rx="3.2" ry="1.6" transform="rotate(-20 88 38)" fill={color} opacity="0.9" />
      <circle cx="74" cy="52" r="2.5" fill={color} opacity="0.8" />
      <circle cx="86" cy="58" r="1.8" fill={color} opacity="0.7" />
    </svg>
  );
}
