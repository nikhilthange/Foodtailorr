import React from 'react';

/**
 * PencilUnderline renders an organic hand-drawn swoosh/underline
 * for editorial headlines, mimicking a chef's hand-sketched notebook mark.
 */
export default function PencilUnderline({ 
  className = 'w-48 h-3', 
  color = '#C55418',
  variant = 'curve'
}) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {variant === 'curve' ? (
        <path
          d="M3 11.5C38.5 4.5 125 3.5 197 12C155 8.5 75 7.5 4 14"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      ) : (
        <path
          d="M2 9.5C52 4.5 110 13.5 198 7C140 10 60 6.5 5 11"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      )}
    </svg>
  );
}
