import React from 'react';

/**
 * CutleryIcon component renders the vintage restaurant crest
 * with crossed fork, knife, and ornamental cloche/rooster details.
 */
export default function CutleryIcon({ 
  className = 'w-10 h-10', 
  color = '#C55418' 
}) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer subtle circular aura */}
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      
      {/* Fork */}
      <path 
        d="M22 14v10c0 3 2.5 5 5 5v21a2 2 0 1 0 4 0V29c2.5 0 5-2 5-5V14" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <line x1="27" y1="14" x2="27" y2="22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <line x1="31" y1="14" x2="31" y2="29" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <line x1="35" y1="14" x2="35" y2="22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />

      {/* Decorative stars / dots */}
      <circle cx="16" cy="32" r="2" fill={color} opacity="0.8" />
      <circle cx="48" cy="32" r="2" fill={color} opacity="0.8" />
      <circle cx="32" cy="10" r="2" fill={color} opacity="0.8" />
    </svg>
  );
}
