import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const columns = [
  {
    title: 'Restaurant Delivery Apps',
    icon: '📱',
    highlight: false,
    items: [
      { text: 'Pick a restaurant first', positive: false },
      { text: 'Single brand per order', positive: false },
      { text: 'No event planning support', positive: false },
      { text: 'Individual portions only', positive: false },
      { text: 'No coordination for large groups', positive: false },
    ],
  },
  {
    title: 'Food Tailor',
    icon: '✨',
    highlight: true,
    items: [
      { text: 'Start with your occasion', positive: true },
      { text: 'AI-curated multi-brand menu', positive: true },
      { text: 'Signature dishes from trusted names', positive: true },
      { text: 'Scaled for 10 to 500+ guests', positive: true },
      { text: 'End-to-end coordination & delivery', positive: true },
    ],
  },
  {
    title: 'Traditional Catering',
    icon: '🍽️',
    highlight: false,
    items: [
      { text: 'Fixed, generic menus', positive: false },
      { text: 'No brand transparency', positive: false },
      { text: 'Limited customization', positive: false },
      { text: 'Quality varies widely', positive: false },
      { text: 'No signature dish curation', positive: false },
    ],
  },
];

export default function PositioningMatrix() {
  return (
    <section className="section section--tint" id="positioning">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Why Food Tailor</span>
          <h2>Not a delivery app. <span className="text-accent">Not catering.</span></h2>
          <p>A new category — AI-customized event menus from the brands you already love.</p>
        </div>

        <div className="comparison-grid">
          {columns.map((col, i) => (
            <motion.div
              key={col.title}
              className={`comparison-col ${col.highlight ? 'comparison-col--highlight' : ''}`}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="comparison-col__icon">{col.icon}</div>
              <h3 className="comparison-col__title">{col.title}</h3>
              <div className="comparison-col__list">
                {col.items.map((item, j) => (
                  <div key={j} className="comparison-col__item">
                    {item.positive ? (
                      <Check size={16} color="#C1633A" style={{ flexShrink: 0, marginTop: 2 }} />
                    ) : (
                      <X size={16} color="rgba(35, 31, 26, 0.3)" style={{ flexShrink: 0, marginTop: 2 }} />
                    )}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
