import React from 'react';

/**
 * Organic Torn Paper Edge Divider — Top edge of a cream section
 * Creates an authentic hand-torn paper effect transitioning from dark to cream
 */
export function TornEdgeTop({ color = '#F7F3EE', className = '' }) {
  return (
    <div className={`torn-edge torn-edge--top ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '40px', display: 'block' }}
      >
        <path
          d="M0,40 L0,18 Q35,8 70,22 T140,12 T210,25 T280,10 T350,24 T420,14 T490,26 T560,9 T630,22 T700,12 T770,27 T840,11 T910,23 T980,14 T1050,26 T1120,8 T1190,23 T1260,11 T1330,24 T1400,10 L1440,18 L1440,40 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/**
 * Organic Torn Paper Edge Divider — Bottom edge of a cream section
 * Transitions cleanly from cream back to dark
 */
export function TornEdgeBottom({ color = '#F7F3EE', className = '' }) {
  return (
    <div className={`torn-edge torn-edge--bottom ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '40px', display: 'block' }}
      >
        <path
          d="M0,0 L0,22 Q35,32 70,18 T140,28 T210,15 T280,30 T350,16 T420,26 T490,14 T560,31 T630,18 T700,28 T770,13 T840,29 T910,17 T980,26 T1050,14 T1120,32 T1190,17 T1260,29 T1330,16 T1400,30 L1440,22 L1440,0 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn Botanical / Wheat stalk illustration
 */
export function WheatIllustration({ className = '', color = '#151515' }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20,80 Q50,50 80,20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Wheat grains */}
      <path d="M45,45 C35,40 32,30 40,25 C45,32 48,40 45,45 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M55,35 C65,30 68,20 60,15 C55,22 52,30 55,35 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M60,30 C50,25 48,15 55,10 C60,18 63,25 60,30 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M70,20 C80,15 82,5 75,2 C70,9 67,16 70,20 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M35,55 C25,50 22,40 30,35 C35,42 38,50 35,55 Z" stroke={color} strokeWidth="2" fill="none" />
      <path d="M45,65 C55,60 58,50 50,45 C45,52 42,60 45,65 Z" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

/**
 * Red handwritten signature brush mark
 */
export function SignatureMark({ className = '' }) {
  return (
    <svg
      width="160"
      height="45"
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10,40 C30,10 45,15 55,35 C65,55 70,20 85,25 C100,30 110,45 130,20 C145,5 155,30 170,25 C185,20 190,40 195,35"
        stroke="#B91C1C"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25,25 Q70,45 120,30 T180,45"
        stroke="#B91C1C"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn Fork & Knife line art for "You are what you eat"
 */
export function ForkKnifeIllustration({ className = '', color = '#FFFFFF' }) {
  return (
    <svg
      width="80"
      height="120"
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Fork */}
      <g transform="translate(15, 0)">
        <path d="M15,10 L15,45 M25,10 L25,45 M35,10 L35,45" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15,45 C15,60 35,60 35,45 L35,45" stroke={color} strokeWidth="2.5" />
        <path d="M25,58 L25,140" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Knife */}
      <g transform="translate(55, 0)">
        <path d="M20,10 C35,25 35,55 20,65 L20,140" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M20,10 L20,65" stroke={color} strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/**
 * "Bon Appétit" red burst stamp from reference
 */
export function BonAppetitBadge({ className = '' }) {
  return (
    <div className={`bon-appetit-badge ${className}`} aria-hidden="true">
      <svg width="180" height="100" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Radiating sunburst dots & lines */}
        <g stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" opacity="0.85">
          <line x1="110" y1="10" x2="110" y2="20" />
          <line x1="80" y1="15" x2="85" y2="25" />
          <line x1="140" y1="15" x2="135" y2="25" />
          <line x1="55" y1="28" x2="65" y2="35" />
          <line x1="165" y1="28" x2="155" y2="35" />
          <line x1="40" y1="50" x2="52" y2="52" />
          <line x1="180" y1="50" x2="168" y2="52" />
          <circle cx="95" cy="18" r="2" fill="#B91C1C" />
          <circle cx="125" cy="18" r="2" fill="#B91C1C" />
          <circle cx="70" cy="24" r="2" fill="#B91C1C" />
          <circle cx="150" cy="24" r="2" fill="#B91C1C" />
        </g>
        {/* Hand-drawn cursive text */}
        <text
          x="110"
          y="65"
          textAnchor="middle"
          fill="#B91C1C"
          fontFamily="'Caveat', cursive, serif"
          fontSize="46"
          fontWeight="700"
          fontStyle="italic"
        >
          Bon
        </text>
        <text
          x="110"
          y="105"
          textAnchor="middle"
          fill="#B91C1C"
          fontFamily="'Caveat', cursive, serif"
          fontSize="48"
          fontWeight="700"
          fontStyle="italic"
        >
          Appétit
        </text>
      </svg>
    </div>
  );
}

/**
 * Hand-drawn Burger / Taco / Handi food sketch header (reference "BRUNCH")
 */
export function FoodSketchHeader({ label = 'FEAST', className = '' }) {
  return (
    <div className={`food-sketch-header ${className}`} aria-hidden="true">
      <svg width="150" height="75" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hand-drawn bun/dish */}
        <path
          d="M30,45 C30,20 130,20 130,45 Z"
          stroke="#151515"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Sesame seeds/dots */}
        <line x1="60" y1="28" x2="65" y2="28" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="24" x2="85" y2="24" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="28" x2="105" y2="28" stroke="#151515" strokeWidth="2" strokeLinecap="round" />
        {/* Fillings wavy line */}
        <path
          d="M25,48 Q40,55 55,48 T85,50 T115,48 T135,50"
          stroke="#151515"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Bottom bun */}
        <path
          d="M35,55 C40,65 120,65 125,55 Z"
          stroke="#151515"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Label stamped in middle */}
        <text
          x="80"
          y="48"
          textAnchor="middle"
          fill="#151515"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="16"
          fontWeight="800"
          letterSpacing="3"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

/**
 * Crimson circular price badge / stamp (like the reference "12$", "8$", "4$")
 */
export function RedPriceBadge({ price = '₹250', className = '' }) {
  return (
    <div className={`red-price-badge ${className}`} aria-hidden="true">
      <svg width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="30" fill="#B91C1C" />
        <circle cx="35" cy="35" r="33" stroke="#B91C1C" strokeWidth="1.5" strokeDasharray="3 3" />
        <text
          x="35"
          y="43"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Caveat', cursive, serif"
          fontSize="22"
          fontWeight="700"
        >
          {price}
        </text>
      </svg>
    </div>
  );
}

/**
 * Hand-drawn Chicken / Rooster outline (reference "New Menu Every Day")
 */
export function ChickenSketch({ color = '#FFFFFF', className = '' }) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40,75 L40,85 M45,85 L35,85 M55,75 L55,85 M60,85 L50,85"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M35,75 C25,60 25,45 35,35 C40,30 45,20 50,15 C52,10 58,12 60,16 C63,14 66,16 65,20 C70,22 75,25 72,30 C68,32 75,40 70,55 C65,70 50,75 35,75 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Comb and beak */}
      <path d="M60,16 Q65,10 68,14 Q72,12 70,18" stroke={color} strokeWidth="2" />
      <path d="M72,22 L80,24 L72,27" stroke={color} strokeWidth="2" />
      {/* Wing */}
      <path d="M42,45 C55,42 60,52 50,62 C42,65 38,55 42,45 Z" stroke={color} strokeWidth="2" />
      <circle cx="62" cy="22" r="1.5" fill={color} />
    </svg>
  );
}

/**
 * Hand-drawn Guitar outline (reference "Gigs Every Tuesday")
 */
export function GuitarSketch({ color = '#FFFFFF', className = '' }) {
  return (
    <svg
      width="80"
      height="100"
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Headstock & Neck */}
      <path d="M47,10 L53,10 L53,60 L47,60 Z" stroke={color} strokeWidth="2" />
      <line x1="50" y1="10" x2="50" y2="60" stroke={color} strokeWidth="1" />
      {/* Body */}
      <path
        d="M47,60 C35,62 25,75 30,90 C33,100 25,115 35,130 C45,140 55,140 65,130 C75,115 67,100 70,90 C75,75 65,62 53,60"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Sound hole */}
      <circle cx="50" cy="85" r="8" stroke={color} strokeWidth="2" />
      {/* Strings bridge */}
      <line x1="42" y1="115" x2="58" y2="115" stroke={color} strokeWidth="3" />
    </svg>
  );
}

/**
 * Hand-drawn Bottle outline (reference "A Lot Of Booze")
 */
export function BottleSketch({ color = '#FFFFFF', className = '' }) {
  return (
    <svg
      width="70"
      height="110"
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cap/Cork */}
      <rect x="44" y="10" width="12" height="10" rx="2" stroke={color} strokeWidth="2" />
      {/* Neck */}
      <path d="M42,20 L42,50 C42,65 25,75 25,95 L25,135 C25,142 75,142 75,135 L75,95 C75,75 58,65 58,50 L58,20 Z" stroke={color} strokeWidth="2.5" />
      {/* Label outline on bottle */}
      <rect x="35" y="85" width="30" height="35" rx="3" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

/**
 * Hand-drawn "Brew" / "Feast" wordmark with background red dot
 */
export function BrewFeastBadge({ word = 'Feast', className = '' }) {
  return (
    <div className={`brew-feast-badge ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Red offset circle */}
      <div
        style={{
          position: 'absolute',
          top: '-15px',
          left: '-10px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#B91C1C',
          zIndex: 1,
        }}
      />
      {/* Script text over it */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Caveat', cursive, serif",
          fontSize: '3.4rem',
          fontWeight: '700',
          color: '#151515',
          display: 'block',
          transform: 'rotate(-6deg)',
          lineHeight: 1,
        }}
      >
        {word}
      </span>
    </div>
  );
}

/**
 * 1. BIRYANI HANDI ART
 * Traditional dum handi, long rice grains, gentle steam swirls, mint garnish
 */
export function BiryaniHandiArt({ className = '', size = 70, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--biryani ${className}`}
      aria-hidden="true"
    >
      <path d="M22,50 C22,42 78,42 78,50 C78,58 22,58 22,50 Z" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25,54 C22,82 78,82 75,54" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20,48 C14,48 14,56 21,57 M80,48 C86,48 86,56 79,57" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M36,49 Q50,45 64,48" stroke="#B45309" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M42,53 Q52,50 60,52" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32,50 L35,52 M52,53 L55,55 M66,50 L68,48" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48,45 C44,38 52,35 56,40 C52,43 49,44 48,45 Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
      <path d="M42,38 Q38,26 44,18 M58,36 Q64,24 56,16" stroke="#78716C" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

/**
 * 2. IRANI CHAI GLASS & SAUCER ART
 * Classic Irani tea glass, rich foam, cardamom steam, tea leaves
 */
export function IraniChaiArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--chai ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="82" rx="36" ry="7" stroke={color} strokeWidth="2.2" />
      <path d="M32,38 L38,78 C38,81 62,81 62,78 L68,38 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M34,46 Q50,44 66,46" stroke="#B91C1C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M36,54 Q50,52 64,54" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="48" x2="44" y2="74" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <line x1="50" y1="48" x2="50" y2="75" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <line x1="56" y1="48" x2="56" y2="74" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <ellipse cx="44" cy="42" rx="4" ry="2.2" transform="rotate(-15 44 42)" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1" />
      <path d="M46,30 Q40,20 48,12 M56,28 Q62,18 54,10" stroke="#78716C" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

/**
 * 3. CRISPY SAMOSA & CHUTNEY ART
 * Flaky triangular samosa, crimped pastry edge, mint chutney cup
 */
export function CrispySamosaArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--samosa ${className}`}
      aria-hidden="true"
    >
      <path
        d="M20,72 L48,22 L76,72 C60,78 35,78 20,72 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FDE68A"
        fillOpacity="0.25"
      />
      <path d="M48,22 L46,74" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30,62 Q40,54 58,60" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24,70 Q32,66 42,71" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="80" cy="72" rx="14" ry="7" stroke={color} strokeWidth="1.8" />
      <path d="M68,73 C68,82 92,82 92,73" stroke={color} strokeWidth="1.8" />
      <ellipse cx="80" cy="72" rx="10" ry="4" fill="#059669" fillOpacity="0.5" />
      <path d="M78,66 C75,60 82,58 85,63 Z" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * 4. SKEWERED SEEKH KEBAB ART
 * Sizzling iron skewer, charred tandoori cuts, onion rings & lime
 */
export function SkeweredKebabArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--kebab ${className}`}
      aria-hidden="true"
    >
      <line x1="15" y1="85" x2="85" y2="15" stroke="#44403C" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="32" cy="68" rx="8" ry="12" transform="rotate(-45 32 68)" fill="#DC2626" fillOpacity="0.25" stroke={color} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="8" ry="12" transform="rotate(-45 50 50)" fill="#DC2626" fillOpacity="0.25" stroke={color} strokeWidth="2" />
      <ellipse cx="68" cy="32" rx="8" ry="12" transform="rotate(-45 68 32)" fill="#DC2626" fillOpacity="0.25" stroke={color} strokeWidth="2" />
      <line x1="28" y1="66" x2="36" y2="70" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="46" y1="48" x2="54" y2="52" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="64" y1="30" x2="72" y2="34" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M68,76 A 14 14 0 0 0 88,86 L68,76" stroke={color} strokeWidth="1.6" fill="#FACC15" fillOpacity="0.5" />
    </svg>
  );
}

/**
 * 5. GOLDEN DOSA & CHUTNEY ART
 * Crispy rolled dosa, porcelain bowls of sambar & coconut chutney
 */
export function GoldenDosaArt({ className = '', size = 70, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--dosa ${className}`}
      aria-hidden="true"
    >
      <path d="M10,65 C30,78 70,78 90,65 C70,55 30,55 10,65 Z" fill="#10B981" fillOpacity="0.2" stroke="#047857" strokeWidth="1.5" />
      <ellipse cx="25" cy="52" rx="9" ry="16" transform="rotate(-15 25 52)" fill="#FDE68A" stroke={color} strokeWidth="2" />
      <path d="M26,36 L78,44 C84,45 84,66 78,67 L24,68" stroke={color} strokeWidth="2" fill="#FEF08A" fillOpacity="0.4" />
      <ellipse cx="78" cy="55" rx="7" ry="12" transform="rotate(-15 78 55)" stroke={color} strokeWidth="1.8" />
      <path d="M38,44 Q55,47 70,49" stroke="#B45309" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M42,54 Q58,56 68,58" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="50" cy="74" rx="10" ry="5" stroke={color} strokeWidth="1.5" fill="#FAF5FF" />
      <circle cx="50" cy="74" r="2" fill="#D97706" />
    </svg>
  );
}

/**
 * 6. GULAB JAMUN ROYAL BOWL ART
 * Earthen bowl with 2-3 sweet syrup jamuns, pistachio slivers
 */
export function GulabJamunArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--jamun ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="58" rx="32" ry="12" stroke={color} strokeWidth="2.2" />
      <path d="M20,60 C24,84 76,84 80,60" stroke={color} strokeWidth="2.2" />
      <circle cx="42" cy="52" r="11" fill="#78350F" stroke={color} strokeWidth="1.8" />
      <circle cx="58" cy="52" r="11" fill="#92400E" stroke={color} strokeWidth="1.8" />
      <circle cx="50" cy="44" r="10" fill="#78350F" stroke={color} strokeWidth="1.8" />
      <path d="M40,40 L44,38" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M54,41 L58,43" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="49" cy="48" r="1.5" fill="#E11D48" />
    </svg>
  );
}

/**
 * 7. ARTISANAL ICE CREAM GOBLET ART
 * Vintage glass coupe with scoops & natural fruit waffle wafer
 */
export function ArtisanalIceCreamArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--icecream ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="85" rx="18" ry="4" stroke={color} strokeWidth="2" />
      <line x1="50" y1="68" x2="50" y2="85" stroke={color} strokeWidth="2.2" />
      <path d="M26,48 C26,68 74,68 74,48 Z" stroke={color} strokeWidth="2.2" />
      <circle cx="42" cy="42" r="12" fill="#FDE68A" fillOpacity="0.4" stroke={color} strokeWidth="1.8" />
      <circle cx="58" cy="42" r="12" fill="#F43F5E" fillOpacity="0.3" stroke={color} strokeWidth="1.8" />
      <circle cx="50" cy="32" r="10" fill="#10B981" fillOpacity="0.3" stroke={color} strokeWidth="1.8" />
      <path d="M60,34 L78,16 L68,14 Z" stroke="#B45309" strokeWidth="1.5" fill="#FDE68A" />
      <circle cx="50" cy="22" r="3.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      <path d="M50,18 Q54,12 58,14" stroke="#047857" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * 8. TRADITIONAL FILTER COFFEE TUMBLER ART
 * Brass davarah & tumbler, frothy top, morning steam
 */
export function FilterCoffeeArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--coffee ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="75" rx="34" ry="9" stroke={color} strokeWidth="2.2" fill="#FEF08A" fillOpacity="0.3" />
      <path d="M18,76 C20,86 80,86 82,76" stroke={color} strokeWidth="2.2" />
      <path d="M38,40 L42,70 C42,73 58,73 58,70 L62,40 Z" stroke={color} strokeWidth="2.2" fill="#FEF08A" fillOpacity="0.4" />
      <ellipse cx="50" cy="40" rx="12" ry="4" stroke={color} strokeWidth="1.8" fill="#FBBF24" fillOpacity="0.5" />
      <path d="M42,39 Q50,37 58,39" stroke="#78350F" strokeWidth="1.5" />
      <path d="M46,30 Q42,20 48,12 M54,28 Q58,18 52,10" stroke="#78716C" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

/**
 * 9. FOOD DELIVERY PARCEL BOX ART
 * Handcrafted delivery package with Food Tailor ribbon seal
 */
export function FoodDeliveryBoxArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--delivery ${className}`}
      aria-hidden="true"
    >
      <path d="M50,22 L82,36 L50,50 L18,36 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="#FAF5FF" />
      <path d="M18,36 L18,68 L50,82 L50,50 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="#F3E8FF" fillOpacity="0.4" />
      <path d="M82,36 L82,68 L50,82 L50,50 Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="#EDE9FE" fillOpacity="0.6" />
      <path d="M50,22 L50,50 L50,82" stroke="#B91C1C" strokeWidth="2.4" />
      <circle cx="50" cy="50" r="6" fill="#B91C1C" />
      <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 10. CELEBRATION BANQUET PLATE ART
 * Plate with fork, knife, and celebratory sparkle stars
 */
export function CelebrationPlateArt({ className = '', size = 65, color = '#1A1A1A' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--celebration ${className}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="2.2" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" />
      <path d="M12,32 L12,46 M15,32 L15,46 M18,32 L18,46" stroke={color} strokeWidth="1.4" />
      <path d="M12,46 C12,52 18,52 18,46 L15,68" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M85,32 C88,40 88,52 85,56 L85,68" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38,20 L40,14 L42,20 L48,22 L42,24 L40,30 L38,24 L32,22 Z" fill="#D97706" />
      <path d="M64,22 L65,18 L66,22 L70,23 L66,24 L65,28 L64,24 L60,23 Z" fill="#B91C1C" />
      <circle cx="50" cy="50" r="5" fill="#B91C1C" fillOpacity="0.2" />
    </svg>
  );
}

/**
 * 11. DECORATIVE FOOD ART DIVIDER
 * Elegant horizontal divider with hand-drawn food accents
 */
export function FoodArtDivider({ className = '', label = '', icon = 'biryani' }) {
  return (
    <div className={`ft-food-divider ${className}`} aria-hidden="true">
      <div className="ft-food-divider__line" />
      <div className="ft-food-divider__icon-wrap">
        {icon === 'biryani' && <BiryaniHandiArt size={36} />}
        {icon === 'chai' && <ChaiCupSketch size={36} />}
        {icon === 'teaglass' && <CuttingTeaGlassSketch size={34} />}
        {icon === 'chicken' && <RoastChickenSketch size={38} />}
        {icon === 'chickenleg' && <ChickenLegSketch size={36} />}
        {icon === 'kebab' && <ChickenTikkaSketch size={36} />}
        {icon === 'samosa' && <CrispySamosaArt size={36} />}
        {icon === 'celebration' && <CelebrationPlateArt size={36} />}
        {label && <span className="ft-food-divider__label">{label}</span>}
      </div>
      <div className="ft-food-divider__line" />
    </div>
  );
}

/**
 * 12. ROAST CHICKEN / TANDOORI POULTRY SKETCH
 * Hand-drawn fine-ink roast chicken on serving platter with lemon & aroma lines
 */
export function RoastChickenSketch({ className = '', size = 80, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--chicken ${className}`}
      aria-hidden="true"
    >
      {/* Platter base */}
      <ellipse cx="60" cy="85" rx="46" ry="12" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      <ellipse cx="60" cy="88" rx="40" ry="8" stroke={color} strokeWidth="1.2" opacity="0.6" />

      {/* Roast Chicken Body */}
      <path
        d="M32,75 C24,65 28,48 42,42 C48,40 56,38 68,40 C80,42 92,54 88,72 C86,80 75,82 60,82 C45,82 36,80 32,75 Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Drumstick 1 */}
      <path
        d="M74,52 C84,46 94,48 98,56 C100,60 98,66 90,68 L84,70"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Drumstick Bone & Cap */}
      <path d="M98,56 L108,50" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="108" cy="48" r="3" stroke={color} strokeWidth="1.8" />
      <circle cx="110" cy="52" r="3" stroke={color} strokeWidth="1.8" />

      {/* Wing Curve */}
      <path
        d="M44,58 C38,62 36,70 42,74 C48,76 54,72 56,66"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Crispy Roast Marks (Fine-ink hatching) */}
      <path d="M52,48 Q58,54 64,50" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M48,56 Q56,62 62,58" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M60,64 Q68,70 76,66" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M70,54 Q78,58 82,54" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

      {/* Spiced Tandoori Paprika Marks (Crimson Accent) */}
      <circle cx="56" cy="50" r="1.8" fill={accent} />
      <circle cx="68" cy="58" r="2" fill={accent} />
      <circle cx="78" cy="62" r="1.8" fill={accent} />
      <circle cx="48" cy="64" r="1.8" fill={accent} />

      {/* Garnish Lemon Slice & Mint */}
      <path d="M22,78 C25,72 32,74 34,80 C32,84 25,84 22,78 Z" stroke={accent} strokeWidth="1.6" fill="none" />
      <line x1="28" y1="76" x2="28" y2="82" stroke={accent} strokeWidth="1.2" />

      {/* Steam / Aroma Curls */}
      <path d="M50,32 C48,24 54,20 52,14" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
      <path d="M64,30 C62,22 68,18 66,10" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      <path d="M78,34 C76,26 82,22 80,16" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

/**
 * 13. TANDOORI CHICKEN LEG SKETCH
 * Hand-drawn chicken drumstick with charred tikka marinade cuts & steam
 */
export function ChickenLegSketch({ className = '', size = 70, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--leg ${className}`}
      aria-hidden="true"
    >
      {/* Chicken Leg Meat Bulb */}
      <path
        d="M25,70 C16,56 22,34 38,26 C54,18 72,28 76,44 C78,54 72,64 64,68 L50,78 C42,82 30,80 25,70 Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Diagonal Marinade Cut Marks */}
      <path d="M36,36 L48,46" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M44,48 L56,58" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M52,38 L64,48" stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Red Marinade Dots */}
      <circle cx="42" cy="42" r="1.8" fill={accent} />
      <circle cx="58" cy="52" r="2" fill={accent} />
      <circle cx="34" cy="56" r="1.8" fill={accent} />
      <circle cx="62" cy="40" r="1.6" fill={accent} />

      {/* Bone Shaft */}
      <path d="M64,68 L78,82" stroke={color} strokeWidth="3" strokeLinecap="round" />

      {/* Bone End Knuckles */}
      <circle cx="80" cy="80" r="3.5" stroke={color} strokeWidth="2" fill="#FFFFFF" />
      <circle cx="84" cy="84" r="3.5" stroke={color} strokeWidth="2" fill="#FFFFFF" />

      {/* Sizzle & Flavor Sparks */}
      <path d="M18,34 L14,30" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28,18 L26,12" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M54,14 L56,8" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 14. SKEWERED CHICKEN TIKKA / KEBAB SKETCH
 * Hand-drawn chicken tikka on charcoal skewer with onion & pepper
 */
export function ChickenTikkaSketch({ className = '', size = 75, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--tikka ${className}`}
      aria-hidden="true"
    >
      {/* Iron Skewer Rod */}
      <line x1="12" y1="88" x2="88" y2="12" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="12" cy="88" r="4" stroke={color} strokeWidth="2" />

      {/* Tikka Chunk 1 */}
      <path
        d="M24,72 C22,66 28,58 34,60 C40,62 44,70 38,76 C32,80 26,78 24,72 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FFF7ED"
      />
      <path d="M28,66 L34,72" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* Onion Slice */}
      <path d="M38,58 C42,54 48,56 46,62" stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Tikka Chunk 2 (Middle) */}
      <path
        d="M42,54 C40,46 48,40 56,42 C62,44 64,54 58,60 C50,64 44,60 42,54 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FFF7ED"
      />
      <path d="M46,48 L54,54" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="52" cy="46" r="1.6" fill={accent} />

      {/* Bell Pepper Cube */}
      <path d="M58,40 L64,36 L68,42 L62,46 Z" stroke={color} strokeWidth="1.8" fill="#ECFDF5" />

      {/* Tikka Chunk 3 (Top) */}
      <path
        d="M62,36 C60,28 68,22 76,24 C82,26 84,34 78,40 C72,44 64,42 62,36 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="#FFF7ED"
      />
      <path d="M68,28 L74,34" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* Charred Grill Hatchings */}
      <path d="M30,68 L36,66" stroke={color} strokeWidth="1.4" />
      <path d="M50,50 L56,48" stroke={color} strokeWidth="1.4" />
      <path d="M70,32 L76,30" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

/**
 * 15. IRANI CHAI CUP & SAUCER SKETCH
 * Hand-drawn vintage porcelain chai cup with aromatic tea vapor curls
 */
export function ChaiCupSketch({ className = '', size = 75, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--chai ${className}`}
      aria-hidden="true"
    >
      {/* Saucer */}
      <ellipse cx="50" cy="78" rx="36" ry="7" stroke={color} strokeWidth="2.2" fill="#FFFFFF" />
      <ellipse cx="50" cy="80" rx="26" ry="4" stroke={color} strokeWidth="1.4" opacity="0.6" />

      {/* Cup Body */}
      <path
        d="M26,44 C28,68 36,74 50,74 C64,74 72,68 74,44 Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="#FFFFFF"
      />
      {/* Cup Rim & Tea Level */}
      <ellipse cx="50" cy="44" rx="24" ry="5.5" stroke={color} strokeWidth="2.2" fill="#FDE68A" />
      <ellipse cx="50" cy="44" rx="18" ry="3.5" stroke={accent} strokeWidth="1.4" fill="#D97706" fillOpacity="0.4" />

      {/* Cup Handle */}
      <path
        d="M74,48 C84,48 86,62 72,66"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Editorial Cup Accent Stripe */}
      <path d="M30,56 Q50,62 70,56" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* Aromatic Steam Trails */}
      <path d="M42,34 C40,26 46,22 44,14" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      <path d="M52,32 C50,22 56,18 54,10" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M62,34 C60,26 66,22 64,15" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />

      {/* Cardamom Pod Accent */}
      <path d="M18,72 C16,68 20,66 22,70 C24,74 20,76 18,72 Z" stroke={color} strokeWidth="1.4" fill="#FEF08A" />
    </svg>
  );
}

/**
 * 16. CUTTING TEA GLASS SKETCH
 * Authentic roadside & Irani cafe ribbed glass with warm cutting chai
 */
export function CuttingTeaGlassSketch({ className = '', size = 70, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--glass ${className}`}
      aria-hidden="true"
    >
      {/* Cutting Glass Rim */}
      <ellipse cx="50" cy="25" rx="20" ry="4.5" stroke={color} strokeWidth="2.2" fill="#FFFFFF" />

      {/* Faceted Glass Body */}
      <path
        d="M30,25 L36,82 C37,86 63,86 64,82 L70,25"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glass Base Ring */}
      <ellipse cx="50" cy="83" rx="14" ry="3" stroke={color} strokeWidth="2" fill="#FFFFFF" />

      {/* Tea Liquid Fill Level */}
      <path
        d="M33,45 L36,80 C37,84 63,84 64,80 L67,45 Z"
        fill="#F59E0B"
        fillOpacity="0.35"
      />
      <ellipse cx="50" cy="45" rx="17" ry="3.5" stroke={accent} strokeWidth="1.8" fill="#F59E0B" />

      {/* Vertical Glass Rib Facets */}
      <line x1="42" y1="30" x2="44" y2="80" stroke={color} strokeWidth="1.4" strokeDasharray="3 2" opacity="0.6" />
      <line x1="50" y1="30" x2="50" y2="81" stroke={color} strokeWidth="1.6" opacity="0.7" />
      <line x1="58" y1="30" x2="56" y2="80" stroke={color} strokeWidth="1.4" strokeDasharray="3 2" opacity="0.6" />

      {/* Frothy Steam Lines */}
      <path d="M46,18 C44,12 48,9 46,4" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
      <path d="M54,16 C52,10 56,7 54,2" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/**
 * 17. ARTISANAL TEAPOT / BRASS KETTLE SKETCH
 * Handcrafted chai kettle with curved handle, spout & ornate lid
 */
export function ArtisanalTeapotSketch({ className = '', size = 80, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--teapot ${className}`}
      aria-hidden="true"
    >
      {/* Kettle Body */}
      <path
        d="M32,46 C24,56 22,76 34,86 C42,92 68,92 76,86 C88,76 86,56 78,46 Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="#FFFFFF"
      />

      {/* Kettle Lid & Knob */}
      <ellipse cx="55" cy="46" rx="23" ry="5" stroke={color} strokeWidth="2.2" fill="#FFFFFF" />
      <path d="M50,42 C50,38 60,38 60,42" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="55" cy="36" r="3.5" stroke={accent} strokeWidth="2" fill={accent} />

      {/* Pouring Spout */}
      <path
        d="M32,60 C20,58 14,46 16,38 C20,40 24,48 30,52"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tea Drop from Spout */}
      <circle cx="15" cy="44" r="2" fill={accent} />

      {/* Overhead Kettle Handle */}
      <path
        d="M36,46 C36,24 74,24 74,46"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <rect x="48" y="22" width="14" height="6" rx="2" stroke={color} strokeWidth="1.6" fill="#FDE68A" />

      {/* Belly Engraving Pattern */}
      <path d="M38,66 Q55,74 72,66" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M42,74 Q55,80 68,74" stroke={color} strokeWidth="1.4" strokeDasharray="3 2" />

      {/* Steam Wisp */}
      <path d="M12,32 C10,24 16,20 14,12" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/**
 * 18. SPICES & HERBS SKETCH
 * Star anise, cinnamon stick, cardamom and fresh mint sprig
 */
export function SpicesHerbsSketch({ className = '', size = 70, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--spices ${className}`}
      aria-hidden="true"
    >
      {/* Star Anise (8 Petals) */}
      <g transform="translate(48, 48) scale(0.9)">
        <circle cx="0" cy="0" r="4" stroke={color} strokeWidth="2" fill={accent} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={i}
            d="M-3,-6 C-5,-16 0,-20 0,-20 C0,-20 5,-16 3,-6 Z"
            stroke={color}
            strokeWidth="1.8"
            fill="#FEF3C7"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>

      {/* Cinnamon Quill */}
      <path d="M15,75 L35,25 C37,20 42,22 40,27 L20,77 Z" stroke={color} strokeWidth="2" fill="#FDE68A" />
      <line x1="22" y1="65" x2="38" y2="28" stroke={color} strokeWidth="1.4" />

      {/* Fresh Mint Sprig */}
      <path d="M70,75 C75,65 85,62 88,70 C84,78 75,80 70,75 Z" stroke={color} strokeWidth="1.8" fill="#D1FAE5" />
      <path d="M78,82 C82,74 90,75 92,82 C88,88 80,88 78,82 Z" stroke={color} strokeWidth="1.8" fill="#A7F3D0" />
      <line x1="68" y1="84" x2="86" y2="68" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 19. VINTAGE SPOON & FORK SKETCH
 * Handcrafted banquet cutlery
 */
export function SpoonForkSketch({ className = '', size = 65, color = '#151515', accent = '#B91C1C' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ft-food-art ft-food-art--cutlery ${className}`}
      aria-hidden="true"
    >
      {/* Spoon */}
      <g transform="translate(10, 0) rotate(15 45 45)">
        <ellipse cx="35" cy="24" rx="10" ry="14" stroke={color} strokeWidth="2.2" fill="#FFFFFF" />
        <ellipse cx="35" cy="24" rx="6" ry="10" stroke={accent} strokeWidth="1.2" opacity="0.6" />
        <path d="M35,38 L35,85" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="35" cy="85" r="2.5" fill={color} />
      </g>

      {/* Fork */}
      <g transform="translate(10, 0) rotate(-15 55 45)">
        <path d="M58,12 L58,28 M63,12 L63,28 M68,12 L68,28" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M58,28 C58,38 68,38 68,28" stroke={color} strokeWidth="2.2" fill="none" />
        <path d="M63,38 L63,85" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="63" cy="85" r="2.5" fill={color} />
      </g>
    </svg>
  );
}

