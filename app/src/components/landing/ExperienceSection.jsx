import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Tell Us Your Occasion',
    description: 'Birthday, wedding, corporate event — share your guest count, budget, and preferences.',
  },
  {
    number: '02',
    title: 'AI Curates Your Menu',
    description: 'Our AI pulls signature dishes from Hyderabad\'s finest kitchens into one cohesive menu.',
  },
  {
    number: '03',
    title: 'You Choose & Adjust',
    description: 'Select your favourites, swap brands, fine-tune portions — complete creative control.',
  },
  {
    number: '04',
    title: 'We Arrange Everything',
    description: 'We coordinate with every brand, handle delivery and setup — food arrives before your event.',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExperienceSection() {
  return (
    <section className="l-experience" id="how-it-works">
      <div className="container">
        <motion.div
          className="l-experience__header"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="l-experience__label">How It Works</p>
          <h2 className="l-experience__title">
            From Occasion to <em>Plate</em>
          </h2>
          <p className="l-experience__subtitle">
            No endless scrolling. No fixed packages. Just guided, curated choice
            from Hyderabad's signature kitchens.
          </p>
        </motion.div>

        <div className="l-experience__steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="l-experience__step"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="l-experience__step-number">{step.number}</div>
              <h3 className="l-experience__step-title">{step.title}</h3>
              <p className="l-experience__step-desc">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
