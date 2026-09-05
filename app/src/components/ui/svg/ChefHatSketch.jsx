import React from 'react';

/**
 * ChefHatSketch renders a hand-drawn chef toque illustration
 * with pencil-sketch contours and subtle interior cross-hatch shading.
 */
export default function ChefHatSketch({
  className = 'w-10 h-10',
  color = '#173E23',
  fill = 'none'
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 64 64"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hat Base Band */}
      <path
        d="M18 46C26 44.8 38 44.8 46 46M17 52C26 50.8 38 50.8 47 52M18 46L17 52M46 46L47 52"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Hand-drawn band folds */}
      <line x1="24" y1="46" x2="23.5" y2="51.5" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="46" x2="32" y2="51.5" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="40" y1="46" x2="40.5" y2="51.5" stroke={color} strokeWidth="1" opacity="0.6" />

      {/* Cloud-like Toque Outline */}
      <path
        d="M18 46C14 43 11 36 14 30C16 26 21 26 24 28C23 21 28 14 35 14C41 14 45 19 44 25C47 23 52 25 53 29C55 35 52 42 46 46"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Interior Sketch Folds / Hatching */}
      <path
        d="M26 30C28 35 29 41 28 45"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M34 23C36 30 36 38 35 45"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M42 28C41 34 39 40 40 45"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
