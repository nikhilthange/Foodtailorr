import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import restaurantNight from '../../assets/restaurant-night.jpg';

export default function ReservationNightSection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '20-50 Guests',
    date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/menu-builder');
  };

  return (
    <section className="ed-res" id="reservation">
      {/* Warm Glowing Dining Hall Background */}
      <div className="ed-res__bg">
        <img
          src={restaurantNight}
          alt="Warm atmospheric dining hall with glowing candles and rustic tables"
        />
        <div className="ed-res__overlay" />
      </div>

      <div className="container ed-res__container">
        {/* Hand-lettered Cursive Script Header */}
        <motion.h2
          className="ed-res__title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Plan your celebration
        </motion.h2>

        <p className="ed-res__subtitle">
          Tell us about your occasion and receive a custom menu proposal featuring your favorite food brands
        </p>

        {/* Translucent Reservation Box with 4-column inline grid on desktop */}
        <motion.form
          className="ed-res__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="ed-res__form-grid">
            <div className="ed-res__input-wrap">
              <label htmlFor="res-name">YOUR NAME</label>
              <input
                id="res-name"
                type="text"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="ed-res__input"
              />
            </div>

            <div className="ed-res__input-wrap">
              <label htmlFor="res-phone">PHONE NUMBER</label>
              <input
                id="res-phone"
                type="tel"
                placeholder="Enter phone number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="ed-res__input"
              />
            </div>

            <div className="ed-res__input-wrap">
              <label htmlFor="res-guests">GUESTS</label>
              <select
                id="res-guests"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="ed-res__input ed-res__select"
              >
                <option value="10-25 Guests">10-25 Guests</option>
                <option value="25-50 Guests">25-50 Guests</option>
                <option value="50-100 Guests">50-100 Guests</option>
                <option value="100-250 Guests">100-250 Guests</option>
                <option value="250+ Guests">250+ Guests (Grand Feast)</option>
              </select>
            </div>

            <div className="ed-res__input-wrap">
              <label htmlFor="res-date">EVENT DATE</label>
              <input
                id="res-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="ed-res__input"
              />
            </div>
          </div>

          <div className="ed-res__action-wrap">
            <button type="submit" className="ed-btn ed-btn--crimson ed-res__btn">
              BOOK NOW &amp; CUSTOMIZE
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
