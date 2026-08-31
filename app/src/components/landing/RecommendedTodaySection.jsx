import React from 'react';
import { motion } from 'framer-motion';
import { TornEdgeTop, TornEdgeBottom, RedPriceBadge } from './EditorialDecorations';
import craftBeverage from '../../assets/craft-beverage.jpg';
import biryaniImg from '../../assets/biryani-closeup.jpg';
import haleemImg from '../../assets/haleem.jpg';

const recommendedItems = [
  {
    name: 'OLD CITY ROYAL BIRYANI SPREAD',
    brand: 'Hotel Shadab Signature',
    sub: 'Authentic generational mutton dum biryani accompanied by fiery Mirchi Ka Salan, burhani raita, and hot kebabs.',
    price: '₹320',
    img: biryaniImg,
  },
  {
    name: 'NILOUFER CHAI & BAKERY BOX',
    brand: 'Cafe Niloufer',
    sub: 'Thick velvety Irani chai, fresh sourdough Maska Buns, and melt-in-mouth Osmania biscuits curated for high tea gatherings.',
    price: '₹140',
    img: haleemImg,
  },
  {
    name: 'ALMOND HOUSE ROYAL MITHAI',
    brand: 'Almond House Confectioners',
    sub: 'Legendary crunchy Almond Bisticks, pure cow ghee Badam Halwa, and royal Kaju Katli curated for celebratory dessert spreads.',
    price: '₹220',
    img: craftBeverage,
  },
];

export default function RecommendedTodaySection() {
  return (
    <section className="ed-rec" id="recommended">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-rec__container">
        {/* Section Header */}
        <div className="ed-rec__header">
          <h2 className="ed-rec__title">RECOMMENDED TODAY</h2>
          <p className="ed-rec__subscript">
            Chef curated packages crafted for seamless celebrations
          </p>
        </div>

        {/* 3-Column Desktop Grid with Circular Frames and Floating Red Badges */}
        <div className="ed-rec__grid">
          {recommendedItems.map((item, i) => (
            <motion.div
              key={item.name}
              className="ed-rec__item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Circular Product Frame with Red Price Stamp */}
              <div className="ed-rec__circle-wrap">
                <div className="ed-rec__circle">
                  <img src={item.img} alt={item.name} />
                </div>
                {/* Floating Red Price Stamp Badge */}
                <div className="ed-rec__badge-pos">
                  <RedPriceBadge price={item.price} />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="ed-rec__item-name">{item.name}</h3>
              <span className="ed-rec__item-brand">{item.brand}</span>
              <p className="ed-rec__item-sub">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
