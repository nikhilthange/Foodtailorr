import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TornEdgeTop,
  TornEdgeBottom,
  BiryaniHandiArt,
  ChaiCupSketch,
  ChickenTikkaSketch,
  RoastChickenSketch,
  SpicesHerbsSketch,
  CelebrationPlateArt,
} from './EditorialDecorations';

import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import chaiImg from '../../assets/craft-beverage.jpg';
import haleemImg from '../../assets/haleem.jpg';

export default function CuratedMomentsSection() {
  return (
    <section className="ft-moments-sec" id="curated-moments">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ft-moments-sec__container">
        {/* Top Editorial Divider with Hand-drawn Chicken & Chai Signature Icons */}
        <div className="ft-moments-sec__top-divider">
          <span className="ft-moments-sec__div-line" />
          <div className="ft-moments-sec__div-badge">
            <RoastChickenSketch size={34} />
            <span className="ft-moments-sec__div-text">AUTHENTICALLY CURATED</span>
            <ChaiCupSketch size={32} />
          </div>
          <span className="ft-moments-sec__div-line" />
        </div>

        {/* Asymmetrical 2-Column Grid */}
        <div className="ft-moments-sec__grid">
          {/* LEFT SIDE: Confident Editorial Typography & Storytelling */}
          <motion.div
            className="ft-moments-sec__left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="ft-moments-sec__eyebrow">
              FROM THE BRANDS YOU LOVE
            </span>

            <h2 className="ft-moments-sec__title">
              THE FOOD<br />
              YOU LOVE.<br />
              <span className="ft-moments-sec__title-accent">THE MOMENTS</span><br />
              YOU CREATE.
            </h2>

            <p className="ft-moments-sec__copy">
              From iconic biryani and steaming chai to the dishes your guests already crave, Food Tailor brings authentic favorites together for the moments that matter.
            </p>

            <div className="ft-moments-sec__actions">
              <Link to="/menu-builder" className="ed-btn ed-btn--crimson">
                BUILD YOUR MENU
              </Link>
              <Link to="/brands" className="ft-moments-sec__secondary-link">
                <span>EXPLORE OUR BRANDS</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Hand-drawn Culinary Stamp Under CTA */}
            <div className="ft-moments-sec__stamp">
              <CelebrationPlateArt size={48} />
              <span className="ft-moments-sec__stamp-text">
                One unified delivery • Multiple iconic kitchens
              </span>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Multi-Dish Editorial Food Composition */}
          <motion.div
            className="ft-moments-sec__right"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="ft-moments-comp">
              {/* Handwritten Floating Annotation: "Your favorites, brought together." */}
              <div className="ft-moments-comp__handwritten-pill">
                <span className="ft-moments-comp__script">
                  "Your favorites, brought together."
                </span>
              </div>

              {/* Dish 1: Dominant Royal Biryani (Centerpiece) */}
              <div className="ft-moments-comp__dish ft-moments-comp__dish--main">
                <div className="ft-moments-comp__img-wrap ft-moments-comp__img-wrap--arch">
                  <img
                    src={biryaniImg}
                    alt="Authentic mutton dum biryani layered with saffron rice"
                  />
                </div>
                <div className="ft-moments-comp__label ft-moments-comp__label--main">
                  <span className="ft-moments-comp__label-dot">•</span>
                  <span>BIRYANI</span>
                  <span className="ft-moments-comp__label-sub">AUTHENTIC</span>
                </div>
              </div>

              {/* Dish 2: Irani Chai & Bakery (Top Right Overlap) */}
              <div className="ft-moments-comp__dish ft-moments-comp__dish--chai">
                <div className="ft-moments-comp__img-wrap ft-moments-comp__img-wrap--circle">
                  <img
                    src={chaiImg}
                    alt="Steaming Irani chai paired with freshly baked Osmania biscuits"
                  />
                </div>
                <div className="ft-moments-comp__label ft-moments-comp__label--chai">
                  <span className="ft-moments-comp__label-dot">•</span>
                  <span>CHAI</span>
                  <span className="ft-moments-comp__label-sub">TIMELESS</span>
                </div>
              </div>

              {/* Dish 3: Sizzling Seekh Kebabs (Bottom Left Overlap) */}
              <div className="ft-moments-comp__dish ft-moments-comp__dish--kebab">
                <div className="ft-moments-comp__img-wrap ft-moments-comp__img-wrap--rounded">
                  <img
                    src={kebabsImg}
                    alt="Charcoal roasted Nizami seekh kebabs on slate"
                  />
                </div>
                <div className="ft-moments-comp__label ft-moments-comp__label--kebab">
                  <span className="ft-moments-comp__label-dot">•</span>
                  <span>KEBABS</span>
                  <span className="ft-moments-comp__label-sub">LOVED</span>
                </div>
              </div>

              {/* Dish 4: Old City Haleem (Bottom Right Accent) */}
              <div className="ft-moments-comp__dish ft-moments-comp__dish--haleem">
                <div className="ft-moments-comp__img-wrap ft-moments-comp__img-wrap--small-circle">
                  <img
                    src={haleemImg}
                    alt="Generational rich mutton haleem with ghee & cashews"
                  />
                </div>
                <div className="ft-moments-comp__label ft-moments-comp__label--haleem">
                  <span className="ft-moments-comp__label-dot">•</span>
                  <span>HALEEM</span>
                  <span className="ft-moments-comp__label-sub">CELEBRATE</span>
                </div>
              </div>

              {/* Decorative SVG Corner Accents */}
              <div className="ft-moments-comp__corner-art">
                <ChickenTikkaSketch size={58} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
