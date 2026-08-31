import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CulinaryBlueprintPreloader.css';

const MESSAGES = [
  'Curating your experience',
  'Tailoring every flavor',
  'Crafting your perfect menu',
  'Bringing your preferences together',
  'Preparing something exceptional',
];

const CIRCUMFERENCE = 2 * Math.PI * 210; // r=210 for progress ring

// Easing curve matching the brand
const ease = [0.22, 1, 0.36, 1];

/* ── SVG Culinary Sketches (line-art, editorial style) ── */
const HerbSVG = () => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 38 C20 28 8 22 6 12 C6 6 14 4 20 14 C26 4 34 6 34 12 C32 22 20 28 20 38Z" />
    <path d="M20 18 L20 36" opacity="0.5" />
    <path d="M14 20 L20 24 M26 20 L20 24" opacity="0.4" />
  </svg>
);

const SpiceSVG = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="16" cy="16" r="6" />
    <circle cx="16" cy="16" r="3" opacity="0.5" />
    <circle cx="16" cy="5" r="2" opacity="0.6" />
    <circle cx="16" cy="27" r="2" opacity="0.6" />
    <circle cx="5" cy="16" r="1.5" opacity="0.4" />
    <circle cx="27" cy="16" r="1.5" opacity="0.4" />
  </svg>
);

const SpoonSVG = () => (
  <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 38 L22 24" />
    <ellipse cx="28" cy="16" rx="9" ry="12" transform="rotate(-35 28 16)" opacity="0.8" />
    <path d="M22 10 Q28 6 32 14" opacity="0.4" />
  </svg>
);

const AniseSVG = () => (
  <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <path
        key={angle}
        d={`M18 18 L${18 + 12 * Math.cos((angle * Math.PI) / 180)} ${18 + 12 * Math.sin((angle * Math.PI) / 180)}`}
        opacity="0.5"
      />
    ))}
    {[30, 90, 150, 210, 270, 330].map((angle) => (
      <circle
        key={angle}
        cx={18 + 10 * Math.cos((angle * Math.PI) / 180)}
        cy={18 + 10 * Math.sin((angle * Math.PI) / 180)}
        r="1.2"
        opacity="0.4"
      />
    ))}
  </svg>
);

const SaffronSVG = () => (
  <svg viewBox="0 0 20 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10 4 Q8 12 10 20 Q12 28 10 34" />
    <path d="M6 10 Q10 14 14 10" opacity="0.5" />
    <circle cx="10" cy="6" r="2" opacity="0.6" />
  </svg>
);

const MenuCardSVG = () => (
  <svg viewBox="0 0 34 42" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
    <rect x="3" y="3" width="28" height="36" rx="2" opacity="0.7" />
    <line x1="9" y1="12" x2="25" y2="12" opacity="0.4" />
    <line x1="9" y1="18" x2="22" y2="18" opacity="0.3" />
    <line x1="9" y1="24" x2="20" y2="24" opacity="0.3" />
    <line x1="9" y1="30" x2="18" y2="30" opacity="0.2" />
  </svg>
);

const ELEMENTS = [
  { id: 'herb', Component: HerbSVG, cls: 'cb-element--herb', delay: 0.5 },
  { id: 'spice', Component: SpiceSVG, cls: 'cb-element--spice', delay: 0.7 },
  { id: 'spoon', Component: SpoonSVG, cls: 'cb-element--spoon', delay: 0.9 },
  { id: 'anise', Component: AniseSVG, cls: 'cb-element--anise', delay: 1.1 },
  { id: 'saffron', Component: SaffronSVG, cls: 'cb-element--saffron', delay: 1.3 },
  { id: 'card', Component: MenuCardSVG, cls: 'cb-element--card', delay: 1.5 },
];

export default function CulinaryBlueprintPreloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  // Generate stable random particles
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: `${10 + Math.random() * 80}%`,
      y: `${10 + Math.random() * 80}%`,
      size: `${1 + Math.random() * 2.5}px`,
      dur: `${4 + Math.random() * 4}s`,
      delay: `${Math.random() * 3}s`,
      drift: `${-20 - Math.random() * 40}px`,
    })), []
  );

  useEffect(() => {
    // Accessibility: skip animation entirely
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Rotate loading messages
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1400);

    // Minimum display duration — enough for entrance + settle
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    // Hard failsafe — never block indefinitely
    const failsafe = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 6000);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(exitTimer);
      clearTimeout(failsafe);
    };
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="cb-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.65, ease },
          }}
          aria-live="polite"
          aria-label="Loading Food Tailor — preparing your culinary experience"
          role="status"
        >
          {/* ── Ambient Particles ── */}
          <div className="cb-particles" aria-hidden="true">
            {particles.map((p) => (
              <div
                key={p.id}
                className="cb-particle"
                style={{
                  '--x': p.x, '--y': p.y,
                  '--size': p.size, '--dur': p.dur,
                  '--delay': p.delay, '--drift': p.drift,
                }}
              />
            ))}
          </div>

          {/* ── Main Composition ── */}
          <motion.div
            className="cb-composition"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease }}
          >
            {/* Progress Ring */}
            <svg className="cb-progress-ring" viewBox="0 0 440 440" aria-hidden="true">
              <circle className="cb-progress-track" cx="220" cy="220" r="210" />
              <motion.circle
                className="cb-progress-fill"
                cx="220" cy="220" r="210"
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3.0, ease: 'easeInOut' }}
              />
            </svg>

            {/* 3D Plate Scene */}
            <div className="cb-scene" aria-hidden="true">
              <div className="cb-plate-group">
                <div className="cb-plate" />
                <motion.div
                  className="cb-plate-glow"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease }}
                />
              </div>
            </div>

            {/* AI Connection Lines */}
            <motion.div
              className="cb-connections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 400 400">
                {/* Thin connecting lines from elements toward center */}
                <line x1="70" y1="50" x2="180" y2="170" className="cb-connection-line" />
                <line x1="330" y1="60" x2="220" y2="170" className="cb-connection-line" />
                <line x1="50" y1="260" x2="170" y2="210" className="cb-connection-line" />
                <line x1="350" y1="280" x2="230" y2="210" className="cb-connection-line" />
                <line x1="30" y1="180" x2="165" y2="195" className="cb-connection-line" />
                <line x1="370" y1="175" x2="235" y2="195" className="cb-connection-line" />

                {/* Traveling glow dots */}
                {[
                  { cx1: 70, cy1: 50, cx2: 180, cy2: 170, delay: 2.0 },
                  { cx1: 330, cy1: 60, cx2: 220, cy2: 170, delay: 2.3 },
                  { cx1: 50, cy1: 260, cx2: 170, cy2: 210, delay: 2.6 },
                ].map((d, i) => (
                  <motion.circle
                    key={i}
                    r="2.5"
                    className="cb-connection-dot"
                    initial={{ cx: d.cx1, cy: d.cy1, opacity: 0 }}
                    animate={{
                      cx: [d.cx1, d.cx2],
                      cy: [d.cy1, d.cy2],
                      opacity: [0, 0.8, 0.8, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: d.delay,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />
                ))}
              </svg>
            </motion.div>

            {/* Surrounding Culinary Elements */}
            <div className="cb-elements" aria-hidden="true">
              {ELEMENTS.map(({ id, Component, cls, delay }) => (
                <motion.div
                  key={id}
                  className={`cb-element ${cls}`}
                  style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                  initial={{ opacity: 0, scale: 0.6, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay, ease }}
                >
                  <Component />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Brand & Message ── */}
          <motion.div
            className="cb-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.0, ease }}
          >
            <h1 className="cb-brand">FOOD TAILOR</h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className="cb-message"
                initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                transition={{ duration: 0.35 }}
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
