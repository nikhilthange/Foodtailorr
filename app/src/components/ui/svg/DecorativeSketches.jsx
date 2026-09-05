import React from 'react';

/**
 * Handcrafted Decorative Sketch Accents
 * Arrows, underlines, circles, flourishes, and rough borders.
 */

export function HandDrawnArrow({
  className = 'w-12 h-6',
  color = '#C55418',
  direction = 'right', // 'right' | 'left' | 'down' | 'curve-down'
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 72 32"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'right' && (
        <>
          <path d="M4 16C22 14.5 48 17.5 64 16" />
          <path d="M54 8C58 12 63 15 66 16C63 17 58 20 54 24" />
        </>
      )}
      {direction === 'down' && (
        <>
          <path d="M36 4C34.5 14 37.5 22 36 28" />
          <path d="M28 22C32 24 35 27 36 29C37 27 40 24 44 22" />
        </>
      )}
      {direction === 'curve-down' && (
        <>
          <path d="M8 8C20 4 52 8 56 22" />
          <path d="M46 18C50 20 54 22 56 24C57 21 59 16 62 14" />
        </>
      )}
    </svg>
  );
}

export function SketchCircle({
  className = 'w-16 h-16',
  color = '#C55418',
  strokeWidth = 2,
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M32 8C18 8 9 19 9 32C9 46 19 56 32 56C47 56 57 45 56 30C55 17 44 7 30 8C26 8.5 15 13 14 24" />
    </svg>
  );
}

export function FlourishAccent({
  className = 'w-24 h-6',
  color = '#173E23',
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 120 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 12C20 12 30 18 42 12C54 6 66 18 78 12C90 6 100 12 114 12" />
      <circle cx="60" cy="12" r="2.5" fill={color} />
      <circle cx="42" cy="12" r="1.5" fill={color} />
      <circle cx="78" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

export function SketchStar({
  className = 'w-5 h-5',
  color = '#C55418',
  fill = false,
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 24 24"
      fill={fill ? color : 'none'}
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  );
}

export function RoughBorderBox({
  className = 'w-full h-full',
  color = '#173E23',
  children,
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-1"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3 C 25 1, 75 3, 98 2 C 99 25, 97 75, 98 98 C 75 97, 25 99, 2 98 C 1 75, 3 25, 2 3 Z" />
      </svg>
      {children}
    </div>
  );
}
