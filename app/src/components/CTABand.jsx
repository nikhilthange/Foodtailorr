import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABand() {
  return (
    <section className="cta-band" id="cta-band">
      <div className="container">
        <h2>Start planning your menu</h2>
        <p>
          Tell us your occasion and let our AI craft a multi-brand feast
          your guests will remember.
        </p>
        <Link to="/menu-builder" className="btn btn--cream btn--large">
          Build Your Event Menu
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
