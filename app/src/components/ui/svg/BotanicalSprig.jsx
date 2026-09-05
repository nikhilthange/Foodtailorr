import React from 'react';

/**
 * BotanicalSprig renders a delicate hand-sketched herb branch (rosemary/mint)
 * that evokes a botanical food illustration from an editorial culinary notebook.
 */
export default function BotanicalSprig({
  className = 'w-12 h-12',
  color = '#173E23',
  opacity = 0.85
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central Curved Stem */}
      <path
        d="M12 52C22 45 34 32 48 12M13 51C23 44.5 34.5 32 47.5 12.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Hand-drawn Leaves / Needles */}
      {/* Leaf Pair 1 */}
      <path
        d="M20 46C17 42 16 38 18 36C20 38 22 42 22 45"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M24 43C28 41 32 42 34 44C32 45 28 46 25 44"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Leaf Pair 2 */}
      <path
        d="M28 36C25 32 24 28 27 26C28 28 30 32 30 35"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M33 33C37 31 41 32 43 34C41 35 37 36 34 34"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Leaf Pair 3 */}
      <path
        d="M37 25C34 21 34 17 37 15C38 17 40 21 39 24"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M41 22C45 20 48 21 50 23C48 24 45 25 42 23"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        opacity={opacity}
      />

      {/* Tip Leaves */}
      <path
        d="M48 12C47 8 48 5 50 4C51 6 51 9 49 12"
        stroke={color}
        strokeWidth="1.1"
        fill={color}
        fillOpacity="0.2"
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}
