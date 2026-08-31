import React from 'react';
import { motion } from 'framer-motion';
import { ChickenSketch, GuitarSketch, BottleSketch } from './EditorialDecorations';
import chefImg from '../../assets/chef-kitchen.jpg';

export default function CollageVibeSection() {
  return (
    <section className="ed-collage" id="vibe">
      {/* Dark photographic background with rich texture */}
      <div className="ed-collage__bg">
        <img
          src={chefImg}
          alt="Chefs crafting authentic Hyderabadi culinary specialties over traditional hearth"
        />
        <div className="ed-collage__overlay" />
      </div>

      <div className="container ed-collage__container">
        {/* Horizontal 3-Column Grid on Desktop, Vertical Stack on Mobile */}
        <div className="ed-collage__grid">
          {/* 1. Chicken & New Menu */}
          <motion.div
            className="ed-collage__item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <ChickenSketch color="#FFFFFF" />
            <p className="ed-collage__script-text">
              New Menu Every Day
            </p>
            <p className="ed-collage__sub-text">
              Seasonal curations and fresh multi-brand menus tailored to your event
            </p>
          </motion.div>

          {/* 2. Guitar & Celebrations */}
          <motion.div
            className="ed-collage__item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <GuitarSketch color="#FFFFFF" />
            <p className="ed-collage__script-text">
              Gigs Every Weekend
            </p>
            <p className="ed-collage__sub-text">
              Live catering, live BBQ setups, and unforgettable atmosphere
            </p>
          </motion.div>

          {/* 3. Bottle & Beverages */}
          <motion.div
            className="ed-collage__item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <BottleSketch color="#FFFFFF" />
            <p className="ed-collage__script-text">
              A Lot Of Flavour
            </p>
            <p className="ed-collage__sub-text">
              Royal sharbats, rich gravies, and exquisite Hyderabadi culinary heritage
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
