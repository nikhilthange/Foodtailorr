import React from 'react';

/**
 * SketchDivider renders an organic hand-drawn decorative horizontal separator
 * with subtle uneven pencil stroke widths and a center starburst or diamond.
 */
export default function SketchDivider({
  className = 'w-64 h-5',
  color = '#C55418',
  variant = 'star'
}) {
  return (
    <svg
      className={`mx-auto block ${className}`}
      viewBox="0 0 300 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left hand-drawn pencil line */}
      <path
        d="M10 12C50 11.2 90 12.8 135 11.5M15 13C55 12.3 85 11.8 130 12.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Center Motif */}
      {variant === 'star' ? (
        <g transform="translate(150, 12)">
          <path
            d="M0 -7L1.8 -2.2L6.8 -1.8L3.2 1.6L4.2 6.5L0 3.8L-4.2 6.5L-3.2 1.6L-6.8 -1.8L-1.8 -2.2Z"
            fill={color}
            opacity="0.9"
          />
          <circle cx="0" cy="0" r="1.5" fill="#FDF9F2" />
        </g>
      ) : (
        <g transform="translate(150, 12)">
          <rect
            x="-4"
            y="-4"
            width="8"
            height="8"
            transform="rotate(45)"
            fill={color}
            opacity="0.85"
          />
          <circle cx="-12" cy="0" r="1.5" fill={color} opacity="0.6" />
          <circle cx="12" cy="0" r="1.5" fill={color} opacity="0.6" />
        </g>
      )}

      {/* Right hand-drawn pencil line */}
      <path
        d="M165 11.5C210 12.8 250 11.2 290 12M170 12.5C215 11.8 245 12.3 285 13"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
