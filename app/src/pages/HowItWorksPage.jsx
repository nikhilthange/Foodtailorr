import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const steps = [
  {
    number: '01',
    title: 'Choose Your Brands & Occasion',
    description: 'Tell us about your celebration — birthday, wedding, family gathering, or corporate event. Explore authentic dishes and signature favorites from renowned food brands.',
    detail: 'From intimate family functions to grand celebrations.',
  },
  {
    number: '02',
    title: 'Tailor Your Menu',
    description: 'Build a curated menu around your guests, tastes, and preferences. Combine appetizers from Samosa King, biryani from Hotel Shadab, chai from Cafe Niloufer, and mithai from Almond House in one menu.',
    detail: 'Complete flexibility. Real authentic brands you already love.',
  },
  {
    number: '03',
    title: 'We Bring It To You',
    description: 'Food Tailor coordinates directly with each brand\'s kitchen. Every dish is prepared fresh and delivered together to your venue on schedule.',
    detail: 'One seamless order. Multiple iconic brands. Zero coordination hassle.',
  },
  {
    number: '04',
    title: 'Celebrate Together',
    description: 'Enjoy an unforgettable feast built entirely around the signature flavors and beloved food brands your guests know and trust.',
    detail: 'Your favorite brands, thoughtfully brought together for your event.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="section" style={{ paddingTop: 'calc(var(--nav-height) + var(--space-3xl))' }}>
      <div className="container">
        <motion.div
          className="section-header"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <span className="section-label">The Process</span>
          <h1>How Food Tailor <span className="text-accent">Works</span></h1>
          <p>Four simple steps from "what should we serve?" to a perfectly coordinated multi-brand feast.</p>
        </motion.div>

        <div className="stepper stepper--vertical" style={{ maxWidth: 700, margin: '0 auto' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="stepper__item"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stepper__marker">{step.number}</div>
              <div className="stepper__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <p style={{ marginTop: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--terracotta)' }}>
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link to="/menu-builder" className="btn btn--primary btn--large">
            Start Building Your Menu
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
