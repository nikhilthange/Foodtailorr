import React from 'react';

/**
 * ArrowPointer component renders directional indicator arrows
 * pointing towards the centrepiece tasting platter from left or right.
 */
export default function ArrowPointer({ 
  direction = 'right', // 'right' or 'left'
  className = 'w-12 h-6', 
  color = '#C55418' 
}) {
  const isRight = direction === 'right';

  return (
    <svg 
      className={className} 
      viewBox="0 0 50 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {isRight ? (
        <>
          <line x1="2" y1="10" x2="42" y2="10" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M38 4L48 10L38 16" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <line x1="48" y1="10" x2="8" y2="10" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M12 4L2 10L12 16" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
