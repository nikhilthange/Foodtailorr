import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function BrandShowcase({ limit, showHeader = true }) {
  const [brands, setBrands] = useState([]);
  const [dishesByBrand, setDishesByBrand] = useState({});

  useEffect(() => {
    Promise.all([
      api.getPartners(),
      api.getDishes({ limit: 500 }) // Fetch enough dishes to show signatures
    ]).then(([brandsData, dishesData]) => {
      setBrands(brandsData.partners || brandsData);
      
      const grouped = {};
      const dishes = dishesData.dishes || dishesData;
      dishes.forEach(dish => {
        const partnerId = dish.partner?.id || dish.partnerId;
        if (!grouped[partnerId]) grouped[partnerId] = [];
        // Only take signatures or top 3 if none
        grouped[partnerId].push(dish);
      });
      
      // Sort dishes: signature first, then max 3
      Object.keys(grouped).forEach(key => {
        grouped[key] = grouped[key]
          .sort((a, b) => (b.isSignature ? 1 : 0) - (a.isSignature ? 1 : 0))
          .slice(0, 3);
      });
      
      setDishesByBrand(grouped);
    }).catch(console.error);
  }, []);

  const displayBrands = limit ? brands.slice(0, limit) : brands;

  return (
    <section className="section section--cream" id="signature-kitchens">
      <div className="container">
        {showHeader && (
          <div className="section-header">
            <span className="section-label">Signature Kitchens</span>
            <h2>Hyderabad's most <span className="text-accent">loved brands</span></h2>
            <p>We partner with the city's finest — each brand brings decades of culinary mastery to your event.</p>
          </div>
        )}

        <div className="brand-grid">
          {displayBrands.map((brand, i) => {
            const dishes = dishesByBrand[brand.id] || [];
            return (
              <motion.article
                key={brand.id}
                className="brand-card"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="brand-card__header">
                  <h3 className="brand-card__name">{brand.businessName || brand.name}</h3>
                  <span className="brand-card__cuisine">{brand.cuisine}</span>
                </div>
                <p className="brand-card__tagline">{brand.tagline}</p>
                <div className="brand-card__dishes">
                  {dishes.map(dish => (
                    <span key={dish.id} className="brand-card__dish-tag">
                      {dish.name}
                    </span>
                  ))}
                </div>
                <div className="brand-card__why">
                  <strong>Why we picked them:</strong> {brand.whyWePicked}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
