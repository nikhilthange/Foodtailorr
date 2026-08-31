import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../lib/apiClient';

import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import haleemImg from '../../assets/haleem.jpg';
import heroImg from '../../assets/hero-dark.jpg';

const categoryImages = {
  Biryani: biryaniImg,
  Starter: kebabsImg,
  'Main Course': haleemImg,
  Dessert: heroImg,
  Beverage: haleemImg,
};

const categories = ['All', 'Biryani', 'Starter', 'Main Course', 'Dessert'];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MenuShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [seedDishes, setSeedDishes] = useState([]);

  useEffect(() => {
    // Fetch dishes and include partner relationship
    api.getDishes({ limit: 50, includePartner: true }).then(data => {
      setSeedDishes(data.dishes || data);
    }).catch(console.error);
  }, []);

  const filteredDishes =
    activeCategory === 'All'
      ? seedDishes.filter((d) => d.isSignature).slice(0, 8)
      : seedDishes
          .filter((d) => d.category?.name === activeCategory && d.isSignature)
          .slice(0, 8);

  return (
    <section className="l-menu" id="menu-showcase">
      <div className="container">
        <motion.div
          className="l-menu__header"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="l-menu__label">Menu Offers</p>
          <h2 className="l-menu__title">
            Signature <em>Dishes</em>
          </h2>
        </motion.div>

        {/* Category Tabs */}
        <div className="l-menu__categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`l-menu__cat-btn ${activeCategory === cat ? 'l-menu__cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <motion.div
          className="l-menu__grid"
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredDishes.map((dish, i) => {
            const brand = dish.partner;
            const categoryName = dish.category?.name || 'Biryani';
            return (
              <motion.div
                key={dish.id}
                className="l-menu-item"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="l-menu-item__image">
                  <img
                    src={categoryImages[categoryName] || biryaniImg}
                    alt={dish.name}
                  />
                </div>
                <div className="l-menu-item__info">
                  <h4 className="l-menu-item__name">{dish.name}</h4>
                  <p className="l-menu-item__brand">{brand?.businessName || brand?.name}</p>
                  <p className="l-menu-item__desc">{dish.description}</p>
                </div>
                <div className="l-menu-item__price">
                  ₹{dish.pricePerHead}
                  <span className="l-menu-item__per">per head</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
