import React from 'react';

/**
 * FOOD TAILOR Logo — wordmark with double-O rendered as a terracotta infinity loop.
 * The word reads "FOOD TAILOR" with the two O's replaced by an ∞ symbol.
 *
 * @param {'default'|'light'} variant - 'light' for use on dark backgrounds (footer)
 */
export default function Logo({ size = 'default', variant = 'default', className = '' }) {
  const heights = { small: 24, default: 32, large: 44 };
  const h = heights[size] || heights.default;
  const scale = h / 32;

  /* On dark bg (default for new theme), text is white. 'light' variant is also white. */
  const textColor = '#FFFFFF';
  const accentColor = '#c41e3a';

  return (
    <a href="/" className={`logo-link ${className}`} aria-label="Food Tailor — Home">
      <svg
        width={Math.round(200 * scale)}
        height={h}
        viewBox="0 0 200 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        {/* "F" */}
        <text
          x="0" y="25"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="800"
          fontSize="26"
          fill={textColor}
          letterSpacing="-0.5"
        >F</text>

        {/* Infinity symbol for "OO" — positioned where the two O's would be */}
        <g transform="translate(14.5, 4.5)">
          <path
            d="M9.5 11.5C7.2 11.5 5 9.8 5 7.5C5 5.2 7 3.5 9.5 3.5C11.2 3.5 12.7 4.4 13.5 5.8C14.3 4.4 15.8 3.5 17.5 3.5C20 3.5 22 5.2 22 7.5C22 9.8 19.8 11.5 17.5 11.5C15.8 11.5 14.3 10.6 13.5 9.2C12.7 10.6 11.2 11.5 9.5 11.5Z"
            stroke={accentColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            transform="scale(1.15) translate(-2, 2)"
          />
        </g>

        {/* "D" */}
        <text
          x="46" y="25"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="800"
          fontSize="26"
          fill={textColor}
          letterSpacing="-0.5"
        >D</text>

        {/* "TAILOR" — lighter weight for hierarchy */}
        <text
          x="72" y="25"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="400"
          fontSize="26"
          fill={textColor}
          letterSpacing="1.5"
        >TAILOR</text>
      </svg>
    </a>
  );
}

/**
 * Favicon SVG — standalone infinity-O mark
 */
export function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#1a1a1a" />
      <g transform="translate(3.5, 8)">
        <path
          d="M8 8c-2.2 0-4-1.8-4-4s1.8-4 4-4c1.4 0 2.6.7 3.3 1.8C12.1.7 13.3 0 14.7 0c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.4 0-2.6-.7-3.3-1.8C10.6 7.3 9.4 8 8 8z"
          stroke="#c41e3a"
          strokeWidth="2"
          fill="none"
          transform="translate(2, 4) scale(1.2)"
        />
      </g>
    </svg>
  );
}
