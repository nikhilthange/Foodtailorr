import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="l-footer" id="footer">
      <div className="container">
        <div className="l-footer__inner">
          <div>
            <div className="l-footer__brand-name">
              FOOD <span>TAILOR</span>
            </div>
            <p className="l-footer__brand-text">
              They bring the occasion. Brands bring the signature.
              We bring them together — AI-customized event menus
              from Hyderabad's most loved kitchens.
            </p>
          </div>

          <div>
            <h4 className="l-footer__heading">Platform</h4>
            <Link to="/how-it-works" className="l-footer__link">How It Works</Link>
            <Link to="/menu-builder" className="l-footer__link">Menu Builder</Link>
            <Link to="/brands" className="l-footer__link">Our Brands</Link>
            <Link to="/about" className="l-footer__link">About</Link>
          </div>

          <div>
            <h4 className="l-footer__heading">Occasions</h4>
            <Link to="/menu-builder" className="l-footer__link">Birthday</Link>
            <Link to="/menu-builder" className="l-footer__link">House Party</Link>
            <Link to="/menu-builder" className="l-footer__link">Wedding</Link>
            <Link to="/menu-builder" className="l-footer__link">Corporate Event</Link>
          </div>

          <div>
            <h4 className="l-footer__heading">Contact</h4>
            <a href="mailto:contact@foodtailor.in" className="l-footer__link">
              contact@foodtailor.in
            </a>
            <a href="mailto:founder@foodtailor.in" className="l-footer__link">
              founder@foodtailor.in
            </a>
          </div>
        </div>

        <div className="l-footer__bottom">
          <p>© {new Date().getFullYear()} Food Tailor. All rights reserved.</p>
          <p>Crafted in Hyderabad</p>
        </div>
      </div>
    </footer>
  );
}
