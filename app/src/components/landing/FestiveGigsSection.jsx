import React from 'react';
import { motion } from 'framer-motion';
import restaurantNight from '../../assets/restaurant-night.jpg';

export default function FestiveGigsSection() {
  return (
    <section className="ed-gigs" id="festive-gigs">
      <div className="ed-gigs__bg">
        <img
          src={restaurantNight}
          alt="Festive celebration gathering with ambient lighting and music"
        />
        <div className="ed-gigs__overlay" />
      </div>

      <div className="container ed-gigs__container">
        {/* Stylized Rock & Roll / Festive Banner */}
        <motion.div
          className="ed-gigs__badge"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="ed-gigs__stamp-wrap">
            <svg width="220" height="70" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="230" height="70" rx="4" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 3" />
              <text x="120" y="38" textAnchor="middle" fill="#FFFFFF" fontFamily="'Playfair Display', serif" fontSize="22" fontWeight="800" letterSpacing="4">
                FEAST &amp; CELEBRATE
              </text>
              <text x="120" y="60" textAnchor="middle" fill="#B91C1C" fontFamily="'Caveat', cursive, serif" fontSize="20" fontWeight="700">
                LIVE KITCHENS
              </text>
            </svg>
          </div>

          <p className="ed-gigs__script">
            Gigs every friday
          </p>
        </motion.div>
      </div>
    </section>
  );
}
