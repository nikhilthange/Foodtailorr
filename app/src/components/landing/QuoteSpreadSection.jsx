import React from 'react';
import { motion } from 'framer-motion';
import { ForkKnifeIllustration } from './EditorialDecorations';
import feastTable from '../../assets/feast-table.jpg';

export default function QuoteSpreadSection() {
  return (
    <section className="ed-spread" id="philosophy">
      {/* Background Banquet Photo */}
      <div className="ed-spread__bg">
        <img
          src={feastTable}
          alt="A grand royal feast spread across long celebration table with candles"
        />
        <div className="ed-spread__overlay" />
      </div>

      <div className="container ed-spread__container">
        {/* Fork & Knife Hand-drawn Illustration */}
        <motion.div
          className="ed-spread__fork-knife"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ForkKnifeIllustration color="#FFFFFF" />
        </motion.div>

        {/* Huge Hand-lettered Cursive Typography */}
        <motion.div
          className="ed-spread__quote"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="ed-spread__script-line">you</span>
          <span className="ed-spread__script-line">are</span>
          <span className="ed-spread__script-line">what</span>
          <span className="ed-spread__script-line ed-spread__script-line--large">you</span>
          <span className="ed-spread__script-line ed-spread__script-line--huge">eat</span>
        </motion.div>
      </div>
    </section>
  );
}
