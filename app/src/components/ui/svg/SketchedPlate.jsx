import React from 'react';

/**
 * SketchedPlate renders a hand-drawn cloche / plate illustration
 * with organic pencil strokes and steam curls.
 */
export default function SketchedPlate({
  className = 'w-12 h-12',
  color = '#C55418'
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Plate Base Rim */}
      <ellipse
        cx="32"
        cy="48"
        rx="26"
        ry="6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse
        cx="32"
        cy="50"
        rx="22"
        ry="4"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.6"
      />

      {/* Cloche Dome */}
      <path
        d="M14 47C14 31 22 22 32 22C42 22 50 31 50 47"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Dome Top Handle */}
      <circle cx="32" cy="18" r="3" stroke={color} strokeWidth="1.6" />
      <path d="M32 21L32 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Steam Wisps */}
      <path
        d="M26 14C24 10 27 7 26 4"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M38 14C40 10 37 7 38 4"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Subtle Hatching Shading */}
      <path
        d="M19 43C21 37 24 32 28 29"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M22 45C24 40 27 36 30 33"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
