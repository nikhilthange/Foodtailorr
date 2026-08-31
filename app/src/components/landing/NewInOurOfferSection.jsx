import React from 'react';
import { motion } from 'framer-motion';
import {
  TornEdgeTop,
  TornEdgeBottom,
  BiryaniHandiArt,
  IraniChaiArt,
  CrispySamosaArt,
  SkeweredKebabArt,
  FoodDeliveryBoxArt,
  CelebrationPlateArt,
} from './EditorialDecorations';

const offerItems = [
  {
    title: 'CURATED BRAND TASTINGS',
    desc: 'Sample your custom multi-brand menu prior to your celebration with coordinated private tastings and recipe adjustments.',
    icon: <BiryaniHandiArt size={46} />,
  },
  {
    title: 'SIGNATURE TANDOORI & KEBABS',
    desc: 'Prime marinated cuts from iconic kitchens, delivered hot with secret mint chutneys and fresh sourdough rotis.',
    icon: <SkeweredKebabArt size={46} />,
  },
  {
    title: 'HOT DUM BIRYANI POTS',
    desc: 'Sealed handis from legendary Old City kitchens opened right at your venue for peak aroma and tenderness.',
    icon: <CrispySamosaArt size={46} />,
  },
  {
    title: 'LIVE IRANI CHAI & BAKERY BAR',
    desc: 'Freshly brewed velvety Irani chai, Osmania biscuits, and buttery maska buns from Cafe Niloufer for high tea & receptions.',
    icon: <IraniChaiArt size={46} />,
  },
  {
    title: 'SINGLE COLD-CHAIN DELIVERY',
    desc: 'Temperature-controlled unified delivery so dishes from 4 different brands arrive simultaneously in pristine condition.',
    icon: <FoodDeliveryBoxArt size={46} />,
  },
  {
    title: 'BESPOKE CELEBRATION PRESENTATION',
    desc: 'Editorial food cards, brand provenance signage, and elegant setup coordination tailored for your banquet.',
    icon: <CelebrationPlateArt size={46} />,
  },
];

export default function NewInOurOfferSection() {
  return (
    <section className="ed-offer" id="new-offer">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-offer__container">
        {/* Section Header */}
        <div className="ed-offer__header">
          <h2 className="ed-offer__title">CURATED SPECIALS &amp; SERVICES</h2>
          <p className="ed-offer__subscript">
            Elevating your celebration through authentic food brands and seamless hospitality
          </p>
        </div>

        {/* 2-Column Wide Grid of Offer Items with Handcrafted Food Art */}
        <div className="ed-offer__grid">
          {offerItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="ed-offer__item"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="ed-offer__icon-box">
                {item.icon}
              </div>
              <div className="ed-offer__text-box">
                <h3 className="ed-offer__item-title">{item.title}</h3>
                <p className="ed-offer__item-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
