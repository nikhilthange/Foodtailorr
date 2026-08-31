import React from 'react';
import { Link } from 'react-router-dom';

export default function EditorialFooter() {
  return (
    <footer className="ed-footer" id="footer">
      <div className="container ed-footer__container">
        <div className="ed-footer__grid">
          {/* Column 1: Brand Philosophy */}
          <div className="ed-footer__col">
            <h4 className="ed-footer__heading">FOOD TAILOR</h4>
            <p className="ed-footer__text">
              Your favorite brands. Your special moments. We bring iconic food brands and authentic signature dishes together into curated event feasts.
            </p>
            <p className="ed-footer__subtext" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              From legendary kitchens to your celebrations across Hyderabad.
            </p>
          </div>

          {/* Column 2: Real Contact Info */}
          <div className="ed-footer__col">
            <h4 className="ed-footer__heading">CONTACT</h4>
            <div className="ed-footer__contact-item">
              <span className="ed-footer__icon">✉️</span>
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--ft-red)', fontWeight: 700, letterSpacing: '0.1em' }}>GENERAL &amp; EVENTS</span>
                <a href="mailto:contact@foodtailor.in" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                  contact@foodtailor.in
                </a>
              </div>
            </div>
            <div className="ed-footer__contact-item" style={{ marginTop: '1rem' }}>
              <span className="ed-footer__icon">👑</span>
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--ft-red)', fontWeight: 700, letterSpacing: '0.1em' }}>FOUNDER &amp; PARTNERSHIPS</span>
                <a href="mailto:founder@foodtailor.in" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                  founder@foodtailor.in
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Occasions */}
          <div className="ed-footer__col">
            <h4 className="ed-footer__heading">OCCASIONS</h4>
            <ul className="ed-footer__links">
              <li><Link to="/menu-builder">Celebrations &amp; Birthdays</Link></li>
              <li><Link to="/menu-builder">Weddings &amp; Receptions</Link></li>
              <li><Link to="/menu-builder">Corporate Events &amp; Galas</Link></li>
              <li><Link to="/menu-builder">Private Gatherings &amp; Socials</Link></li>
              <li><Link to="/menu-builder">Festive Feasts</Link></li>
            </ul>
          </div>

          {/* Column 4: Platform Navigation */}
          <div className="ed-footer__col">
            <h4 className="ed-footer__heading">NAVIGATION</h4>
            <ul className="ed-footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/brands">Our Brands</Link></li>
              <li><Link to="/menu-builder">Menu Builder</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="ed-footer__bottom">
          <p className="ed-footer__copy">
            FOOD TAILOR — Curated Food Brands for Your Special Moments
          </p>
          <p className="ed-footer__rights">
            © {new Date().getFullYear()} Food Tailor. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
