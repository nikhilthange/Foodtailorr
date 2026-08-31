import React from 'react';

export default function TrustStrip() {
  const brands = ['Paradise', 'Bawarchi', 'Cafe Bahar', 'Shah Ghouse', 'Pista House', 'Jewel of Nizam', 'Meridian'];

  return (
    <div className="trust-strip" id="trust-strip">
      <div className="container">
        <p className="trust-strip__label">
          Signature dishes from Hyderabad's most loved kitchens
        </p>
        <div className="trust-strip__brands">
          {brands.map(name => (
            <span key={name} className="trust-strip__brand">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
