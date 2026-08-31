import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../lib/apiClient';

// Map brand IDs/names to food images for circular thumbnails
import biryaniImg from '../../assets/biryani-closeup.jpg';
import kebabsImg from '../../assets/kebabs.jpg';
import haleemImg from '../../assets/haleem.jpg';
import heroImg from '../../assets/hero-dark.jpg';
import feastImg from '../../assets/feast-table.jpg';
import chefImg from '../../assets/chef-kitchen.jpg';

const brandImages = {
  'Paradise': biryaniImg,
  'Bawarchi': kebabsImg,
  'Cafe Bahar': heroImg,
  'Hotel Shadab': haleemImg,
  'Shah Ghouse': haleemImg,
  'Pista House': biryaniImg,
  'Jewel of Nizam': feastImg,
  'Meridian': kebabsImg,
  'Kritunga': chefImg,
  'Cafe Niloufer': heroImg,
  'Maharaja Chat': feastImg,
  'Samosa King': kebabsImg,
};

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SignatureKitchens() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.getPartners().then(data => setBrands(data.partners || data)).catch(console.error);
  }, []);

  const displayBrands = brands.slice(0, 6);

  return (
    <section className="l-kitchens" id="signature-kitchens">
      <div className="container">
        <motion.div
          className="l-kitchens__header"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="l-kitchens__label">Signature Kitchens</p>
          <h2 className="l-kitchens__title">
            Hyderabad's Most <em>Loved</em> Brands
          </h2>
          <p className="l-kitchens__subtitle">
            We partner with the city's finest — each brand brings decades of
            culinary mastery to your event.
          </p>
        </motion.div>

        <div className="l-kitchens__grid">
          {displayBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              className="l-kitchen-card"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="l-kitchen-card__image">
                <img
                  src={brandImages[brand.businessName] || biryaniImg}
                  alt={`${brand.businessName} signature dish`}
                />
              </div>
              <h3 className="l-kitchen-card__name">{brand.businessName || brand.name}</h3>
              <p className="l-kitchen-card__cuisine">{brand.cuisine}</p>
              <p className="l-kitchen-card__tagline">{brand.tagline}</p>
              {brand.established && (
                <p className="l-kitchen-card__year">Est. {brand.established}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
