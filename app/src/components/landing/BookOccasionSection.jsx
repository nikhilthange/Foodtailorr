import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TornEdgeTop, TornEdgeBottom, WheatIllustration, ChaiCupSketch, SignatureMark } from './EditorialDecorations';
import tandooriPlatter from '../../assets/tandoori-platter.jpg';

export default function BookOccasionSection() {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState('Wedding');
  const [guests, setGuests] = useState(50);
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/menu-builder');
  };

  return (
    <section className="ed-book" id="book-occasion">
      <TornEdgeTop color="#F7F3EE" />

      <div className="container ed-book__container">
        <div className="ed-book__grid">
          {/* Left Column: Hand-drawn Chai & Wheat Art, Headline, Story Copy, Red Signature */}
          <motion.div
            className="ed-book__left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="ed-book__wheat" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ChaiCupSketch size={46} />
              <WheatIllustration color="#151515" />
            </div>

            <p className="ed-book__label">OUR PHILOSOPHY</p>

            <h2 className="ed-book__title">
              YOUR FAVORITE<br />
              BRANDS FOR<br />
              YOUR SPECIAL<br />
              OCCASIONS
            </h2>

            <p className="ed-book__text">
              Instead of settling for generic catering or navigating multiple orders, Food Tailor brings your favorite food brands directly to your special moments. From Cafe Niloufer's iconic Irani Chai and Shadab's legendary dum biryani to Maharaja Chat and Almond House sweets, we tailor and coordinate your entire event feast in one seamless delivery.
            </p>

            <div className="ed-book__sig-wrap">
              <SignatureMark />
            </div>
          </motion.div>

          {/* Right Column: Roasted Platter Cutout & Interactive Booking Form */}
          <motion.div
            className="ed-book__right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Cutout Food Platter Photo */}
            <div className="ed-book__platter">
              <div className="ed-book__platter-img-wrap">
                <img
                  src={tandooriPlatter}
                  alt="Delicious tandoori roasted chops with seasoned potato wedges and herb garnish"
                />
              </div>
            </div>

            {/* Interactive Booking / Occasion Quick Form */}
            <form className="ed-book__form" onSubmit={handleSubmit}>
              <h3 className="ed-book__form-title">PLAN YOUR CELEBRATION</h3>

              <div className="ed-book__form-row">
                <div className="ed-book__field">
                  <label htmlFor="ed-occasion">EVENT OCCASION</label>
                  <select
                    id="ed-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    <option value="Wedding">Wedding Feast</option>
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="House Party">House Party / Social</option>
                    <option value="Corporate Event">Corporate Gala</option>
                    <option value="Family Function">Family Gathering</option>
                  </select>
                </div>

                <div className="ed-book__field">
                  <label htmlFor="ed-date">EVENT DATE</label>
                  <input
                    id="ed-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="ed-book__field ed-book__field--full">
                <div className="ed-book__guest-header">
                  <label htmlFor="ed-guests">GUEST COUNT</label>
                  <span className="ed-book__guest-count">{guests} Guests</span>
                </div>
                <input
                  id="ed-guests"
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>

              <button type="submit" className="ed-btn ed-btn--crimson ed-btn--wide">
                CHECK AVAILABILITY &amp; START MENU
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <TornEdgeBottom color="#F7F3EE" />
    </section>
  );
}
