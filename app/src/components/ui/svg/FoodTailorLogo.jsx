import React from 'react';

/**
 * FoodTailorLogo renders the official Food Tailor brand logo:
 * - 'food' in Deep Heritage Forest Green (#143823)
 * - 'tailor' in Warm Artisan Terracotta/Orange (#C85419)
 */
export default function FoodTailorLogo({
  className = 'h-8 w-auto',
  variant = 'default',
  alt = 'Food Tailor',
  ...props
}) {
  return (
    <img
      src="/food-tailor-logo.png"
      alt={alt}
      className={`block object-contain select-none ${className}`}
      loading="eager"
      {...props}
    />
  );
}

