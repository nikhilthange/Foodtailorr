import React from 'react';
import { motion } from 'framer-motion';
import chefImage from '../../assets/chef-kitchen.jpg';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StorySection() {
  return (
    <section className="l-story" id="our-story">
      <div className="container">
        <div className="l-story__grid">
          <motion.div
            className="l-story__content"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="l-story__label">Our Story</p>

            <h2 className="l-story__title">
              The Art of <em>Curated</em> Feasting
            </h2>

            <p className="l-story__text">
              In Hyderabad, every occasion deserves food that tells a story.
              Food Tailor was born from a simple idea — what if you could bring
              together the city's finest signature kitchens into one unforgettable
              feast, tailored precisely to your celebration?
            </p>

            <p className="l-story__text">
              Our AI understands your occasion, your guests, and your preferences.
              It curates a multi-brand menu pulling the best from Paradise, Bawarchi,
              Shah Ghouse, and more — brands that have defined Hyderabad's culinary
              heritage for decades. We handle the coordination, so you can focus
              on the celebration.
            </p>

            <p className="l-story__signature">— The Food Tailor Team</p>
          </motion.div>

          <motion.div
            className="l-story__image"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={chefImage}
              alt="A chef preparing traditional Hyderabadi biryani over charcoal"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
