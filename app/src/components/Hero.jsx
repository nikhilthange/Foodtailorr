import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import heroImage from '../assets/hero-feast.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Hero() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="hero__content"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="hero__label" variants={fadeUp}>
            AI-Customized Event Menus
          </motion.p>

          <motion.h1 className="hero__title" variants={fadeUp}>
            Food, <span>tailored</span> from your favourite brands to your occasion.
          </motion.h1>

          <motion.p className="hero__subtitle" variants={fadeUp}>
            Tell us your occasion, guest count, and preferences — our AI curates a
            multi-brand menu of Hyderabad's most loved signature dishes, delivered
            as one seamless event experience.
          </motion.p>

          <motion.div className="hero__actions" variants={fadeUp}>
            <Link to="/menu-builder" className="btn btn--primary btn--large">
              Start Your Menu
            </Link>
            <Link to="/how-it-works" className="btn btn--secondary btn--large">
              See How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Image */}
      <div className="hero__image">
        <img src={heroImage} alt="A stunning spread of Hyderabadi biryani, kebabs, haleem, and festive dishes" />
      </div>

      {/* Scroll Cue */}
      <motion.button
        className="hero__scroll-cue"
        onClick={scrollToContent}
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Scroll
        <span></span>
        <ChevronDown size={16} />
      </motion.button>
    </section>
  );
}
