import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TornEdgeTop, TornEdgeBottom, BrewFeastBadge, ChickenLegSketch } from './EditorialDecorations';
import kebabsImg from '../../assets/kebabs.jpg';

export default function CraftStorySection() {
  return (
    <section className="ed-craft" id="craft-story">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-craft__container">
        <div className="ed-craft__grid">
          {/* Left Column: Cropped Food Photo with Shadow */}
          <motion.div
            className="ed-craft__left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="ed-craft__photo-wrap">
              <img
                src={kebabsImg}
                alt="Sizzling smoky tandoori seekh kebabs on slate plate"
              />
            </div>
          </motion.div>

          {/* Right Column: Red Feast Badge, Bold Uppercase Headline, Editorial Copy, Red CTA */}
          <motion.div
            className="ed-craft__right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="ed-craft__badge-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <BrewFeastBadge word="Feast" />
              <ChickenLegSketch size={52} />
            </div>

            <h2 className="ed-craft__title">
              ICONIC BRANDS,<br />
              AUTHENTIC TASTE,<br />
              TAILORED FEASTS
            </h2>

            <p className="ed-craft__text">
              We believe the best celebrations are built around food people already love. Instead of going from restaurant to restaurant, Food Tailor curates signature items from beloved brands — fragrant biryani from Shadab, authentic chai and bakes from Cafe Niloufer, handcrafted chaat from Maharaja Chat, and royal sweets from Almond House — thoughtfully brought together for your event.
            </p>

            <div className="ed-craft__action">
              <Link to="/brands" className="ed-btn ed-btn--crimson">
                EXPLORE BRANDS
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
