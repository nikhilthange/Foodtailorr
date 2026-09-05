import React from 'react';

/**
 * FoodTailorLogo renders the official Food Tailor vector mark
 * with high-precision typography and mark geometry.
 */
export default function FoodTailorLogo({
  className = 'h-9 w-auto',
  variant = 'default', // 'default' (on light) | 'light' (on dark)
  showTagline = true,
}) {
  const isLight = variant === 'light';
  const primaryTextColor = isLight ? '#FFFFFF' : '#173E23';
  const markBg = isLight ? '#C55418' : '#173E23';
  const markStroke = '#FFFFFF';
  const markAccent = isLight ? '#FFFFFF' : '#C55418';
  const taglineColor = isLight ? '#A6D1AC' : '#5C7262';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 64"
      className={`block ${className}`}
      fill="none"
      aria-label="Food Tailor Culinary Concierge"
      role="img"
    >
      {/* Brand Icon Tile */}
      <rect x="2" y="2" width="60" height="60" rx="12" fill={markBg} />
      {/* Stylized 'F' and 'T' Monogram */}
      <path
        d="M22 18H42M22 28H38M22 18V46"
        stroke={markStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Artisanal Seal Accent Dot */}
      <circle cx="40" cy="42" r="4.5" fill={markAccent} />

      {/* Typography */}
      <text
        x="74"
        y="32"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="2"
        fill={primaryTextColor}
      >
        FOOD
      </text>
      <text
        x="146"
        y="32"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="2"
        fill="#C55418"
      >
        TAILOR
      </text>

      {showTagline && (
        <text
          x="75"
          y="48"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing="2.5"
          fill={taglineColor}
        >
          CULINARY CONCIERGE
        </text>
      )}
    </svg>
  );
}
