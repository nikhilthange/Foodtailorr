import React from 'react';

/**
 * FoodTailorLogo renders the official Food Tailor brand logo:
 * - 'default': Dark green 'food' (#143823) + Orange 'tailor' (#C85419) on transparent bg (for light backgrounds)
 * - 'light': Crisp white 'food' (#FFFFFF) + Orange 'tailor' (#E8601C) on transparent bg (for dark backgrounds)
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


