import React from 'react';
import BrandShowcase from '../components/BrandShowcase';
import CTABand from '../components/CTABand';

export default function BrandsPage() {
  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <BrandShowcase showHeader={true} />
      <CTABand />
    </div>
  );
}
