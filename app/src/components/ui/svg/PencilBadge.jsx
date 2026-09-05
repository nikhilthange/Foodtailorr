import React from 'react';

/**
 * PencilBadge renders a circular hand-sketched seal badge with
 * irregular pencil border, rotating ring, and center text or icon.
 */
export default function PencilBadge({
  text = '11 VERIFIED MASTERS',
  subtext = 'HYDERABAD ATELIER',
  className = 'w-24 h-24',
  color = '#C55418',
  bg = '#FDF9F2'
}) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background Circle */}
        <circle cx="50" cy="50" r="46" fill={bg} />

        {/* Outer Hand-drawn Sketch Ring 1 */}
        <path
          d="M50 4C75 3.5 96 24 96 50C95.5 76 74 96 50 96C24 95.5 4 75 4 50C4.5 24 25 4.5 50 4"
          stroke={color}
          strokeWidth="1.8"
          strokeDasharray="4 2"
          opacity="0.85"
        />

        {/* Inner Hand-drawn Sketch Ring 2 */}
        <path
          d="M50 10C72 9.5 90 27 90 50C89.5 73 71 90 50 90C27 89.5 10 72 10 50C10.5 27 28 10.5 50 10"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Sunburst Rays / Hatch Marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="6"
            x2="50"
            y2="9"
            stroke={color}
            strokeWidth="1.2"
            transform={`rotate(${deg} 50 50)`}
            opacity="0.75"
          />
        ))}

        {/* Circular text path for top curve */}
        <path
          id="pencilBadgePath"
          d="M 18, 50 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
          fill="none"
        />
        <text fill={color} fontSize="6.5" fontWeight="800" letterSpacing="0.16em">
          <textPath href="#pencilBadgePath" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>

        {/* Center Star & Subtext */}
        <g transform="translate(50, 50)">
          <circle cx="0" cy="-3" r="3.5" fill={color} opacity="0.9" />
          <path
            d="M0 -5L0.8 -3.8L2.2 -3.6L1.1 -2.6L1.4 -1.2L0 -1.9L-1.4 -1.2L-1.1 -2.6L-2.2 -3.6L-0.8 -3.8Z"
            fill={bg}
          />
        </g>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill={color}
          fontSize="5.5"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          {subtext}
        </text>
      </svg>
    </div>
  );
}
