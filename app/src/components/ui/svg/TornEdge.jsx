import React from 'react';

/**
 * TornEdge component creates the jagged, organic die-cut edge divider
 * seen above and below photography banners in the reference design.
 */
export default function TornEdge({ 
  position = 'top', 
  fill = '#FDF9F2', 
  className = '', 
  height = 24 
}) {
  const isTop = position === 'top';

  return (
    <div 
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className={`w-full h-full block ${isTop ? '' : 'rotate-180'}`}
      >
        <path 
          d="M0,0 L35,28 L72,6 L118,34 L162,10 L210,38 L256,12 L302,36 L348,8 L396,35 L444,14 L492,40 L538,9 L586,37 L632,15 L680,42 L728,12 L774,38 L820,16 L868,44 L914,10 L962,36 L1008,18 L1056,42 L1102,12 L1150,38 L1200,8 L1200,0 L0,0 Z" 
          fill={fill} 
        />
      </svg>
    </div>
  );
}
