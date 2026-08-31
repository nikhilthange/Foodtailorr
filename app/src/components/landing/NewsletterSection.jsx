import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TornEdgeTop, TornEdgeBottom, ArtisanalTeapotSketch } from './EditorialDecorations';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="ed-news" id="newsletter">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-news__container">
        {/* Hand-drawn Artisanal Teapot Kettle Illustration */}
        <motion.div
          className="ed-news__plane"
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ArtisanalTeapotSketch size={68} />
        </motion.div>

        <h2 className="ed-news__title">Get Updates &amp; Exclusive Offers</h2>
        <p className="ed-news__text">
          Subscribe to receive seasonal tasting invites, festival specials, and curated banquet privileges from Hyderabad's premier kitchens.
        </p>

        {submitted ? (
          <motion.div
            className="ed-news__success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="ed-news__success-text">
              ✨ Thank you! You are on our VIP tasting &amp; celebration list.
            </p>
          </motion.div>
        ) : (
          <form className="ed-news__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ed-news__input"
            />
            <button type="submit" className="ed-btn ed-btn--crimson ed-news__btn">
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
