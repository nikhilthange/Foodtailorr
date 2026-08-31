import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const painPoints = [
  {
    icon: '🤷',
    title: '"What should we serve?"',
    description: 'Event planning starts with food anxiety — too many options, no clear direction.',
  },
  {
    icon: '📱',
    title: 'Endless restaurant scrolling',
    description: 'Delivery apps force you to pick one restaurant — not designed for events or groups.',
  },
  {
    icon: '📦',
    title: 'Fixed catering packages',
    description: 'Traditional caterers offer generic menus with no brand transparency or customization.',
  },
  {
    icon: '🔀',
    title: 'Multi-brand coordination chaos',
    description: 'Ordering from multiple brands yourself means juggling timing, quantities, and deliveries.',
  },
];

export default function PainPoints() {
  return (
    <section className="section section--cream" id="pain-points">
      <div className="container">
        <div className="section-header">
          <span className="section-label">The Problem</span>
          <h2>Event food planning is <span className="text-accent">broken</span></h2>
          <p>None of the existing options are designed for someone planning an event menu.</p>
        </div>

        <div className="pain-grid">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="pain-card"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="pain-card__icon">{point.icon}</div>
              <h3 className="pain-card__title">{point.title}</h3>
              <p className="pain-card__desc">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
