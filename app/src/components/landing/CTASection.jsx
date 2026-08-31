import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import haleemImg from '../../assets/haleem.jpg';

const featuredDishes = [
  { name: 'Dum Biryani', price: '₹250', image: biryaniImg },
  { name: 'Seekh Kebab', price: '₹180', image: kebabsImg },
  { name: 'Haleem', price: '₹220', image: haleemImg },
];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CTASection() {
  return (
    <section className="l-featured" id="cta-band">
      <div className="container">
        <div className="l-featured__inner">
          <motion.p
            className="l-featured__label"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            Featured Selection
          </motion.p>

          {/* Circular Dish Images Row */}
          <motion.div
            className="l-featured__dishes"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {featuredDishes.map((dish) => (
              <div key={dish.name} className="l-featured__dish">
                <div className="l-featured__dish-img">
                  <img src={dish.image} alt={dish.name} />
                </div>
                <span className="l-featured__dish-name">{dish.name}</span>
                <span className="l-featured__dish-price">{dish.price}/head</span>
              </div>
            ))}
          </motion.div>

          <motion.h2
            className="l-featured__title"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            Start Planning Your Feast
          </motion.h2>

          <motion.p
            className="l-featured__text"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            Tell us your occasion and let our AI craft a multi-brand feast
            your guests will remember.
          </motion.p>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <Link to="/menu-builder" className="btn btn--cream btn--large">
              Build Your Event Menu
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
