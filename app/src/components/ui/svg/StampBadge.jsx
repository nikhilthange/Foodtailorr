import React from 'react';

/**
 * StampBadge component renders a circular vintage seal stamp
 * with jagged/scalloped border and center text/icon.
 */
export default function StampBadge({ 
  text = 'BON APPÉTIT', 
  subtext = 'TAILORED ATELIER',
  className = 'w-24 h-24', 
  color = '#C55418',
  bg = 'transparent'
}) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full animate-[spin_30s_linear_infinite]"
        aria-hidden="true"
      >
        {/* Scalloped Stamp Edge */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke={color} 
          strokeWidth="1.5" 
          strokeDasharray="4 2" 
          fill={bg} 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="41" 
          stroke={color} 
          strokeWidth="0.75" 
          fill="none" 
          opacity="0.6"
        />

        {/* Circular text path */}
        <path 
          id="badgeCirclePath" 
          d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" 
          fill="none" 
        />
        <text 
          fill={color} 
          fontSize="7" 
          fontWeight="700" 
          letterSpacing="0.25em" 
          className="uppercase tracking-widest"
        >
          <textPath href="#badgeCirclePath" startOffset="0%">
            {text} • {subtext} •
          </textPath>
        </text>
      </svg>

      {/* Center Star / Fork Glyph */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          style={{ color }} 
          className="font-serif italic font-bold text-sm"
        >
          FT
        </span>
      </div>
    </div>
  );
}
