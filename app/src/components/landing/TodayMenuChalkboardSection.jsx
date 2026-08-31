import React from 'react';
import { motion } from 'framer-motion';

import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import haleemImg from '../../assets/haleem.jpg';
import tandooriPlatter from '../../assets/tandoori-platter.jpg';

const chalkboardDishes = [
  { name: 'Special Irani Chai', price: '₹60', brand: 'Cafe Niloufer', desc: 'Thick, creamy tea brewed fresh with secret spices.', img: tandooriPlatter },
  { name: 'Old City Mutton Biryani', price: '₹320', brand: 'Hotel Shadab', desc: 'Generational dum basmati with fall-off-the-bone meat.', img: biryaniImg },
  { name: 'Crispy Corn Samosas', price: '₹90', brand: 'Samosa King', desc: 'Flaky pastry stuffed with sweet corn and paneer.', img: kebabsImg },
  { name: 'Dahi Puri Chaat', price: '₹110', brand: 'Maharaja Chat', desc: 'Crisp puris with potato, spiced curd, and chutneys.', img: haleemImg },
  { name: 'Signature Almond Bisticks', price: '₹180', brand: 'Almond House', desc: 'Pure ghee almond biscuits crafted with roasted nuts.', img: tandooriPlatter },
];

const redIconBadges = [
  {
    name: 'CURATED BRANDS',
    desc: 'Handpicked signature dishes from Hyderabad\'s most celebrated food institutions.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2a8 8 0 0 0-8 8v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a8 8 0 0 0-8-8z" />
        <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </svg>
    ),
  },
  {
    name: 'AUTHENTIC RECIPES',
    desc: 'Original flavors prepared directly by each brand\'s master culinary team.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <path d="M6 2v20M18 2v20M2 6h20M2 18h20" />
      </svg>
    ),
  },
  {
    name: 'TAILORED PACKAGES',
    desc: 'Menus built around your event type, guest count, and budget preferences.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
  },
  {
    name: 'SEAMLESS DELIVERY',
    desc: 'Coordinated pickup and temperature-controlled delivery ready before your guests arrive.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
];

export default function TodayMenuChalkboardSection() {
  return (
    <section className="ed-chalk" id="today-menu">
      <div className="container ed-chalk__container">
        {/* Section Header */}
        <div className="ed-chalk__header">
          <h2 className="ed-chalk__title">CURATED SPECIALS</h2>
          <p className="ed-chalk__subscript">
            Signature dishes from iconic kitchens ready for your event spread
          </p>
        </div>

        <div className="ed-chalk__layout">
          {/* Left / Center: Red Framed Slate Board */}
          <motion.div
            className="ed-chalk__board"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Red Header Strip */}
            <div className="ed-chalk__board-header">
              <h3>YOUR FAVORITE BRANDS</h3>
            </div>

            {/* Vertical Stacked Dishes */}
            <div className="ed-chalk__board-list">
              {chalkboardDishes.map((dish) => (
                <div key={dish.name} className="ed-chalk__board-item">
                  <div className="ed-chalk__board-thumb">
                    <img src={dish.img} alt={dish.name} />
                  </div>
                  <h4 className="ed-chalk__board-dish-name">{dish.name}</h4>
                  <span className="ed-chalk__board-dish-price">{dish.price}</span>
                  <p className="ed-chalk__board-dish-sub">
                    {dish.desc} ({dish.brand})
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Red Circular Icon Badges List */}
          <div className="ed-chalk__badge-list">
            {redIconBadges.map((badge, i) => (
              <motion.div
                key={badge.name}
                className="ed-chalk__badge-item"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <div className="ed-chalk__red-circle">
                  {badge.icon}
                </div>
                <h4 className="ed-chalk__badge-title">{badge.name}</h4>
                <p className="ed-chalk__badge-desc">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
