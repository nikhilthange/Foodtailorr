import React from 'react';
import { motion } from 'framer-motion';

import stripBbq from '../../assets/strip-bbq.jpg';
import stripSandwich from '../../assets/strip-sandwich.jpg';
import stripBurger from '../../assets/strip-burger.jpg';

export default function TriplePhotoStrip() {
  const images = [
    { src: stripBbq, alt: 'Sizzling tandoori meats and sausage links on smoking charcoal grill' },
    { src: stripSandwich, alt: 'Artisanal baguette roll filled with fresh greens and grilled steak' },
    { src: stripBurger, alt: 'Gourmet artisanal burger with aged cheddar cheese and brioche bun' },
  ];

  return (
    <section className="ed-strip" id="photo-strip">
      <div className="ed-strip__grid">
        {images.map((item, index) => (
          <motion.div
            key={index}
            className="ed-strip__item"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          >
            <img src={item.src} alt={item.alt} loading="lazy" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
