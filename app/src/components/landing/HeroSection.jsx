import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import heroBg from '../../assets/hero-dark.jpg';

export default function HeroSection() {
  const scrollToContent = () => {
    const el = document.getElementById('book-occasion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="gastro-hero" id="hero">
      {/* 1. SINGLE FULL-BLEED CINEMATIC PHOTOGRAPH */}
      <div className="gastro-hero__bg">
        <img
          src={heroBg}
          alt="Artisanal Hyderabadi culinary feast with aromatic dum biryani, charred kebabs, and traditional sides"
        />
        <div className="gastro-hero__overlay" />
      </div>

      {/* 2. CENTERED EDITORIAL POSTER CONTENT (NO FOREGROUND DISH / NO CIRCLE) */}
      <div className="container gastro-hero__container">
        <div className="gastro-hero__content">
          <motion.h1
            className="gastro-hero__title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            FOOD TAIL<span className="gastro-hero__umlaut">Ö</span>R
          </motion.h1>

          <motion.p
            className="gastro-hero__tagline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            From your favorite brands to your special moments.
          </motion.p>

          <motion.div
            className="gastro-hero__action"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/menu-builder" className="gastro-hero__btn">
              • START YOUR MENU •
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 3. SCROLL DOWN INDICATOR */}
      <button
        className="gastro-hero__scroll"
        onClick={scrollToContent}
        aria-label="Scroll down to booking section"
      >
        <span className="gastro-hero__scroll-text">SCROLL</span>
        <ChevronDown size={18} className="gastro-hero__scroll-icon" />
      </button>
    </section>
  );
}
