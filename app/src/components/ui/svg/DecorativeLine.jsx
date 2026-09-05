import React from 'react';

/**
 * DecorativeLine component renders an elegant separator rule
 * with a diamond or dot in the center.
 */
export default function DecorativeLine({ 
  className = 'w-48 h-4', 
  color = '#C55418',
  variant = 'diamond'
}) {
  return (
    <svg 
      className={`mx-auto block ${className}`} 
      viewBox="0 0 200 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="10" y1="10" x2="90" y2="10" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {variant === 'diamond' ? (
        <rect x="96" y="6" width="8" height="8" transform="rotate(45 100 10)" fill={color} />
      ) : (
        <circle cx="100" cy="10" r="3" fill={color} />
      )}
      <line x1="110" y1="10" x2="190" y2="10" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}
