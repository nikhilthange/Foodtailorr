import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Tell Us Your Occasion',
    description: 'Birthday, wedding, corporate event — share your guest count, budget, and food preferences.',
  },
  {
    number: '02',
    title: 'AI Customizes Your Menu',
    description: 'Our AI curates a multi-brand menu pulling signature dishes from Hyderabad\'s finest kitchens.',
  },
  {
    number: '03',
    title: 'You Choose & Adjust',
    description: 'Select your favourite dishes, swap brands, fine-tune portions — complete creative control.',
  },
  {
    number: '04',
    title: 'Food Tailor Arranges',
    description: 'We coordinate with every brand, handle delivery and setup — food arrives before your event.',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function StepChain() {
  return (
    <section className="section section--tint" id="step-chain">
      <div className="container">
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2>From occasion to plate in <span className="text-accent">four steps</span></h2>
          <p>No endless scrolling. No fixed packages. Just guided, curated choice.</p>
        </div>

        <div className="step-chain">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="step-chain__item"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="step-chain__number">{step.number}</div>
              <h3 className="step-chain__title">{step.title}</h3>
              <p className="step-chain__desc">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
