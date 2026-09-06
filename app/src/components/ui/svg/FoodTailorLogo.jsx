import React from 'react';

/**
 * FoodTailorLogo renders the official Food Tailor brand wordmark logo.
 * 
 * @param {string} className - Tailwind CSS classes for sizing and spacing
 * @param {'default' | 'light'} variant - 'default' (dark green & terracotta on light backgrounds) or 'light' (off-white & terracotta on dark backgrounds)
 * @param {string} alt - Accessible image description
 */
export default function FoodTailorLogo({
  className = 'h-8 w-auto',
  variant = 'default',
  alt = 'Food Tailor',
  ...props
}) {
  const isLight = variant === 'light';
  const logoSrc = isLight ? '/food-tailor-logo-light.png' : '/food-tailor-logo.png';

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`block object-contain select-none ${className}`}
      loading="eager"
      {...props}
    />
  );
}
