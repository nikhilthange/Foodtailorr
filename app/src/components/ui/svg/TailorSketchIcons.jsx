import React from 'react';

/**
 * TailorSketchIcons — Hand-drawn single-weight sketch illustrations & doodle icons.
 * Adheres strictly to:
 *   --color-ink-green:  #173E23
 *   --color-ink-orange: #C65518
 *   --color-paper:      #FAFAF8
 *   --color-paper-alt:  #F2EFE6
 *   --color-text:       #1A1A1A
 */

/**
 * 1. TailorPlateSketch — Hero illustration for Home.
 * Table being set with a tailor's measuring tape wrapped around a grand dining plate.
 */
export function TailorPlateSketch({ className = 'w-48 h-48 sm:w-64 sm:h-64', greenColor = '#173E23', orangeColor = '#C65518' }) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Outer Ceramic Platter with wobbly hand-drawn rims */}
      <path
        d="M25 125C26 155 60 178 100 178C140 178 174 155 175 125C175 110 145 95 100 95C55 95 25 110 25 125Z"
        stroke={greenColor}
        strokeWidth="2.2"
      />
      <path
        d="M38 126C39 148 68 165 100 165C132 165 161 148 162 126C162 114 135 103 100 103C65 103 38 114 38 126Z"
        stroke={greenColor}
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.65"
      />

      {/* Cloche Dome Rim & Lid */}
      <path
        d="M48 120C50 75 72 50 100 50C128 50 150 75 152 120"
        stroke={greenColor}
        strokeWidth="2.2"
      />
      <path
        d="M56 116C58 82 76 60 100 60C124 60 142 82 144 116"
        stroke={greenColor}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Dome Top Ring Handle */}
      <circle cx="100" cy="40" r="7" stroke={greenColor} strokeWidth="2.2" />
      <path d="M100 47V50" stroke={greenColor} strokeWidth="2" />

      {/* Aromatic Herb Garnish / Sprig at top */}
      <path d="M93 34C89 30 86 31 83 29" stroke={greenColor} strokeWidth="1.4" />
      <path d="M107 34C111 30 114 31 117 29" stroke={greenColor} strokeWidth="1.4" />

      {/* Tailor's Measuring Tape wrapping diagonally around the platter & dome */}
      <path
        d="M18 110C35 130 75 148 120 135C155 125 178 105 182 85C184 75 175 68 162 70C140 73 118 85 95 100C65 120 30 130 12 115"
        stroke={orangeColor}
        strokeWidth="7"
        strokeLinecap="square"
        opacity="0.92"
      />
      <path
        d="M18 110C35 130 75 148 120 135C155 125 178 105 182 85C184 75 175 68 162 70C140 73 118 85 95 100C65 120 30 130 12 115"
        stroke="#FAFAF8"
        strokeWidth="4.5"
        strokeLinecap="square"
      />
      {/* Measuring Tape Tick Marks / Stitches */}
      <path
        d="M30 119L32 124M44 126L46 131M58 132L60 137M72 136L74 141M86 138L88 143M100 137L102 142M114 135L116 140M128 130L130 135M142 123L144 128M156 114L158 119M168 102L170 107M176 90L178 95"
        stroke={orangeColor}
        strokeWidth="1.5"
      />

      {/* Tailor's Sewing Needle / Chalk Pin accent */}
      <line x1="155" y1="35" x2="180" y2="60" stroke={orangeColor} strokeWidth="2" />
      <circle cx="153" cy="33" r="3" fill={orangeColor} stroke={orangeColor} />
      <path d="M178 58L183 63" stroke={orangeColor} strokeWidth="1" />

      {/* Silverware Setting: Fork on left, Knife on right */}
      {/* Fork */}
      <path d="M16 80V135M12 80V96C12 101 20 101 20 96V80" stroke={greenColor} strokeWidth="1.6" />
      {/* Knife */}
      <path d="M184 80V135M184 80C190 85 190 105 184 110" stroke={greenColor} strokeWidth="1.6" />

      {/* Pencil Hash Shading below base */}
      <path d="M60 182C75 186 125 186 140 182" stroke={greenColor} strokeWidth="1.5" opacity="0.4" />
      <path d="M75 186L82 190M95 187L102 191M115 187L122 191" stroke={greenColor} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

/**
 * 2. PencilDrawingPlateSketch — Looping sketch animation for Customizing / Loading.
 * A pencil drawing an artisanal cloche & plate outline in a continuous loop.
 */
export function PencilDrawingPlateSketch({ className = 'w-24 h-24', color = '#173E23', pencilColor = '#C65518' }) {
  return (
    <div className={`relative inline-block ${className} flex items-center justify-center`}>
      <svg
        className="w-full h-full animate-pulse"
        viewBox="0 0 100 100"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Animated base plate drawing path */}
        <path
          d="M15 65C16 80 35 90 50 90C65 90 84 80 85 65C85 58 70 52 50 52C30 52 15 58 15 65Z"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="220"
          strokeDashoffset="0"
          className="animate-[dash_2s_ease-in-out_infinite]"
        />

        {/* Animated Dome path */}
        <path
          d="M26 62C27 40 38 25 50 25C62 25 73 40 74 62"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="140"
          strokeDashoffset="0"
          className="animate-[dash_2.5s_ease-in-out_infinite]"
        />

        {/* Dome Ring Handle */}
        <circle cx="50" cy="20" r="4.5" stroke={color} strokeWidth="1.8" />

        {/* Measuring tape stitch arc */}
        <path
          d="M20 60C35 70 65 70 80 60"
          stroke={pencilColor}
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Pencil drawing nib */}
        <g className="animate-bounce" style={{ transformOrigin: '75px 25px' }}>
          <polygon points="76,28 84,20 88,24 80,32" fill="#F2EFE6" stroke={pencilColor} strokeWidth="1.4" />
          <polygon points="74,30 76,28 80,32 75,34" fill={color} />
          <line x1="84" y1="20" x2="94" y2="10" stroke={pencilColor} strokeWidth="2.5" />
        </g>
      </svg>
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 220;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -220;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 3. Dietary Sketch Doodles — Single-weight line icons for Menu Review.
 */
export function VegLeafDoodle({ className = 'w-4 h-4', color = '#173E23' }) {
  return (
    <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Pure Vegetarian">
      <path d="M4 20C4 20 7 15 11 11C15 7 20 4 20 4C20 4 17 9 13 13C9 17 4 20 4 20Z" />
      <path d="M4 20C8 17 12 12 15 8" strokeWidth="1.2" />
      <path d="M11 11L14 14" strokeWidth="1.2" />
      <path d="M8 14L10 16" strokeWidth="1.2" />
    </svg>
  );
}

export function ChiliDoodle({ className = 'w-4 h-4', color = '#C65518' }) {
  return (
    <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Spiced / Spicy">
      {/* Pepper Stem */}
      <path d="M16 3C17 2 19 3 20 5M17 5L15 8" strokeWidth="1.4" />
      {/* Pepper Body */}
      <path d="M15 8C14 12 11 18 6 21C4 22 3 20 4 18C7 13 10 9 14 7L15 8Z" />
      {/* Texture streak */}
      <path d="M12 10C10 13 8 16 6 18" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

export function HalalCrestDoodle({ className = 'w-4 h-4', color = '#173E23' }) {
  return (
    <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Halal Certified">
      <circle cx="12" cy="12" r="9" strokeWidth="1.4" />
      <path d="M10 7C12 9 12 15 10 17C14 16 16 12 15 8C13 7 11 7 10 7Z" strokeWidth="1.4" />
      <circle cx="15" cy="10" r="0.8" fill={color} />
    </svg>
  );
}

export function HandDrawnStampSketch({ className = 'w-16 h-16', label = 'TAILORED', color = '#173E23' }) {
  return (
    <svg
      className={`inline-block ${className} transform -rotate-6`}
      viewBox="0 0 100 60"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Rough outer double border */}
      <path
        d="M6 8C35 6 65 6 94 8C95 24 95 38 94 52C65 54 35 54 6 52C5 38 5 24 6 8Z"
        stroke={color}
        strokeWidth="2.4"
        strokeDasharray="2 1"
      />
      <path
        d="M10 12C36 10 64 10 90 12C91 25 91 37 90 48C64 50 36 50 10 48C9 37 9 25 10 12Z"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.8"
      />
      {/* Stamp text */}
      <text
        x="50"
        y="34"
        textAnchor="middle"
        fill={color}
        fontFamily="Caveat, cursive"
        fontSize="17"
        fontWeight="bold"
        letterSpacing="2"
      >
        {label}
      </text>
      {/* Checkmark flourish */}
      <path d="M22 33L28 39L38 25" stroke={color} strokeWidth="2.2" />
    </svg>
  );
}

export function HandDrawnCircleHighlight({ className = 'w-12 h-12', color = '#C65518' }) {
  return (
    <svg className={`inline-block ${className}`} viewBox="0 0 60 60" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M30 6C15 6 6 18 6 32C6 46 18 54 32 54C48 54 56 42 54 26C52 14 42 6 28 8" strokeDasharray="180" />
    </svg>
  );
}
