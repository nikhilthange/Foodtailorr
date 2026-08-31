import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TornEdgeTop, TornEdgeBottom } from './EditorialDecorations';
import guestPortrait from '../../assets/guest-portrait.jpg';

const reviews = [
  {
    quote:
      'Instead of ordering from four different restaurants or settling for generic banquet food, Food Tailor brought our favorite dishes together into one unforgettable wedding spread. Authentic, seamless, and loved by every single guest.',
    author: 'ANANYA & VIKRAM',
    avatar: guestPortrait,
  },
  {
    quote:
      "From Cafe Niloufer's Irani chai during our high-tea reception to Hotel Shadab's legendary dum biryani for dinner, the curation was absolute perfection. Flawless timing and unforgettable taste.",
    author: 'ROHIT & MEERA',
    avatar: guestPortrait,
  },
  {
    quote:
      'Coordinating food from multiple iconic brands used to be impossible for our annual corporate gala. Food Tailor delivered every single signature item hot, fresh, and beautifully presented.',
    author: 'SAMEER REDDY',
    avatar: guestPortrait,
  },
];

export default function TestimonialStorySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const prevReview = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Optional subtle auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      nextReview();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = reviews[currentIndex];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="ed-testi" id="testimonial">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-testi__container">
        {/* Full-width Slider Row with flanking red arrows */}
        <div className="ed-testi__slider-row">
          {/* Left Arrow Button (<..) */}
          <button
            className="ed-testi__arrow ed-testi__arrow--left"
            onClick={prevReview}
            aria-label="Previous review"
          >
            <span className="ed-testi__arrow-sym">&lt;</span>
            <span className="ed-testi__arrow-dots">..</span>
          </button>

          {/* Central Animated Content */}
          <div className="ed-testi__center-wrap">
            {/* Hand-drawn Botanical Leaves Branch behind Avatar */}
            <div className="ed-testi__avatar-wrapper">
              <svg
                className="ed-testi__botanical-branch"
                viewBox="0 0 280 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Left Branch Leaves */}
                <path
                  d="M105 85 Q75 55 35 45"
                  stroke="#1A1A1A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M85 72 C65 52 45 56 32 68 C45 74 68 70 85 72 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M65 58 C50 38 32 42 22 52 C35 58 52 54 65 58 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M48 48 C38 28 20 32 12 40 C22 45 38 42 48 48 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />

                {/* Right Branch Leaves */}
                <path
                  d="M175 85 Q205 55 245 45"
                  stroke="#1A1A1A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M195 72 C215 52 235 56 248 68 C235 74 212 70 195 72 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M215 58 C230 38 248 42 258 52 C245 58 228 54 215 58 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M232 48 C242 28 260 32 268 40 C258 45 242 42 232 48 Z"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  fill="none"
                />
              </svg>

              {/* Circular Portrait with Crimson Ring */}
              <div className="ed-testi__avatar-circle">
                <img src={current.avatar} alt={current.author} />
              </div>
            </div>

            {/* Dynamic Quote & Author with smooth animation */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="ed-testi__slide"
              >
                <blockquote className="ed-testi__quote">
                  "{current.quote}"
                </blockquote>

                <p className="ed-testi__author">
                  {current.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Button (..>) */}
          <button
            className="ed-testi__arrow ed-testi__arrow--right"
            onClick={nextReview}
            aria-label="Next review"
          >
            <span className="ed-testi__arrow-dots">..</span>
            <span className="ed-testi__arrow-sym">&gt;</span>
          </button>
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
