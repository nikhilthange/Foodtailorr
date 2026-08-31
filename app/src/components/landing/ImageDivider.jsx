import React from 'react';
import { motion } from 'framer-motion';
import feastImage from '../../assets/feast-table.jpg';

export default function ImageDivider() {
  return (
    <motion.div
      className="l-divider"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={feastImage}
        alt="A grand celebration feast table with multiple Hyderabadi dishes"
      />
    </motion.div>
  );
}
