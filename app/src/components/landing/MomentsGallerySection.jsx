import React from 'react';
import { motion } from 'framer-motion';

import feastTable from '../../assets/feast-table.jpg';
import chefKitchen from '../../assets/chef-kitchen.jpg';
import biryaniCloseup from '../../assets/biryani-closeup.jpg';
import restaurantNight from '../../assets/restaurant-night.jpg';
import guestPortrait from '../../assets/guest-portrait.jpg';
import tandooriPlatter from '../../assets/tandoori-platter.jpg';

export default function MomentsGallerySection() {
  const galleryItems = [
    { src: feastTable, alt: 'Grand celebration banquet feast', span: 'col-span-2 row-span-2' },
    { src: chefKitchen, alt: 'Master chef dum cooking biryani', span: 'col-span-1 row-span-1' },
    { src: biryaniCloseup, alt: 'Aromatic saffron biryani handi', span: 'col-span-1 row-span-1' },
    { src: restaurantNight, alt: 'Atmospheric evening celebration hall', span: 'col-span-1 row-span-1' },
    { src: guestPortrait, alt: 'Happy guests celebrating with Food Tailor', span: 'col-span-1 row-span-1' },
    { src: tandooriPlatter, alt: 'Roasted tandoori platter dish', span: 'col-span-2 row-span-1' },
  ];

  return (
    <section className="ed-gallery" id="moments">
      <div className="container ed-gallery__container">
        <div className="ed-gallery__header">
          <p className="ed-gallery__label">CELEBRATIONS &amp; MEMORIES</p>
          <h2 className="ed-gallery__title">Moments We Create</h2>
          <p className="ed-gallery__subscript">
            From intimate rooftop dinners to 500-guest wedding galas across Hyderabad
          </p>
        </div>

        {/* Asymmetric Editorial Collage */}
        <div className="ed-gallery__mosaic">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              className={`ed-gallery__mosaic-item ${item.span}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
              <div className="ed-gallery__mosaic-overlay">
                <span>{item.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
