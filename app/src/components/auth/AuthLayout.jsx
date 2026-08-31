import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Background Image & Overlay */}
      <div className="auth-layout__bg">
        <img 
          src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Premium dining experience" 
        />
      </div>
      <div className="auth-layout__bg-overlay"></div>

      {/* Content Grid */}
      <div className="auth-layout__content">
        {/* Left Side: Brand Messaging */}
        <motion.div 
          className="auth-layout__brand"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>Elevate<br/>Every Event.</h1>
          <p>
            Experience Hyderabad's finest culinary mastery, seamlessly curated for your special moments.
          </p>
        </motion.div>

        {/* Right Side: Form Area */}
        <div className="auth-layout__form-area">
          {children}
        </div>
      </div>
    </div>
  );
}
