import React from 'react';
import { motion } from 'framer-motion';
import {
  TornEdgeTop,
  TornEdgeBottom,
  BonAppetitBadge,
  FoodSketchHeader,
} from './EditorialDecorations';

import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import haleemImg from '../../assets/haleem.jpg';
import tandooriPlatter from '../../assets/tandoori-platter.jpg';
import burgerImg from '../../assets/strip-burger.jpg';
import sandwichImg from '../../assets/strip-sandwich.jpg';

const brunchItems = [
  {
    name: 'Special Irani Chai & Maska Bun',
    brand: 'Cafe Niloufer',
    price: '₹60',
    desc: 'Thick, creamy scalded milk tea served with fresh sourdough bun slathered with rich homemade butter.',
    img: biryaniImg,
  },
  {
    name: 'Old City Mutton Dum Biryani',
    brand: 'Hotel Shadab',
    price: '₹320',
    desc: 'Generational slow-cooked dum biryani with fall-off-the-bone meat, mirchi ka salan, and raita.',
    img: biryaniImg,
  },
  {
    name: 'Crispy Corn & Paneer Samosas',
    brand: 'Samosa King',
    price: '₹90',
    desc: 'Golden flaky party appetizers stuffed with sweet corn, molten spiced paneer, and fresh mint.',
    img: kebabsImg,
  },
  {
    name: 'Special Dahi Puri Chaat Platter',
    brand: 'Maharaja Chat',
    price: '₹110',
    desc: 'Crisp puris layered with seasoned potatoes, sweet whipped curd, date-tamarind chutney, and fine sev.',
    img: tandooriPlatter,
  },
];

const dessertItems = [
  {
    name: 'Signature Almond Bisticks',
    brand: 'Almond House',
    price: '₹180',
    desc: 'Legendary crisp, buttery almond confections handcrafted with pure cow ghee and roasted California almonds.',
    img: sandwichImg,
  },
  {
    name: 'Original Fruit Biscuits Platter',
    brand: 'Karachi Bakery',
    price: '₹60',
    desc: 'Globally cherished crumbly festive biscuits studded with colorful candied fruits and cardamom.',
    img: burgerImg,
  },
  {
    name: 'Single Origin Cacao Truffles',
    brand: 'Manam Chocolate',
    price: '₹220',
    desc: 'Award-winning handcrafted dark chocolate truffles infused with Indian spices and raw cacao.',
    img: haleemImg,
  },
  {
    name: 'Organic Fresh Sitaphal Scoop',
    brand: 'Ice Berg Ice Creams',
    price: '₹120',
    desc: 'Artisanal natural ice cream made with 100% fresh custard apple pulp and organic dairy cream.',
    img: tandooriPlatter,
  },
];

export default function MenuOffersSection() {
  return (
    <section className="ed-menu-offers" id="menu-offers">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-menu-offers__container">
        {/* Bon Appétit Radiating Red Stamp */}
        <motion.div
          className="ed-menu-offers__stamp"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <BonAppetitBadge />
        </motion.div>

        {/* Section Header */}
        <div className="ed-menu-offers__header">
          <h2 className="ed-menu-offers__title">MENU OFFERS</h2>
          <p className="ed-menu-offers__subtitle">
            Curated signature dishes from Hyderabad's most legendary kitchens
          </p>
        </div>

        {/* --- 1. BRUNCH / LUNCH LIST --- */}
        <div className="ed-menu-offers__group">
          <FoodSketchHeader label="SIGNATURES" />

          <div className="ed-menu-offers__list">
            {brunchItems.map((item, i) => (
              <motion.div
                key={item.name}
                className="ed-menu-offers__item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="ed-menu-offers__dish-circle">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="ed-menu-offers__dish-info">
                  <div className="ed-menu-offers__dish-header">
                    <h3 className="ed-menu-offers__dish-name">{item.name}</h3>
                    <span className="ed-menu-offers__dish-price">{item.price}</span>
                  </div>
                  <p className="ed-menu-offers__dish-brand">{item.brand}</p>
                  <p className="ed-menu-offers__dish-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- 2. DESSERT LIST --- */}
        <div className="ed-menu-offers__group ed-menu-offers__group--dessert">
          <h3 className="ed-menu-offers__group-title">DESSERT LIST</h3>

          <div className="ed-menu-offers__list">
            {dessertItems.map((item, i) => (
              <motion.div
                key={item.name}
                className="ed-menu-offers__item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="ed-menu-offers__dish-circle">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="ed-menu-offers__dish-info">
                  <div className="ed-menu-offers__dish-header">
                    <h3 className="ed-menu-offers__dish-name">{item.name}</h3>
                    <span className="ed-menu-offers__dish-price">{item.price}</span>
                  </div>
                  <p className="ed-menu-offers__dish-brand">{item.brand}</p>
                  <p className="ed-menu-offers__dish-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
