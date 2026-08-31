import React from 'react';
import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="l-quote">
      <div className="container container--narrow">
        <motion.blockquote
          className="l-quote__text"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Every great occasion deserves a <strong>feast</strong> worth remembering
        </motion.blockquote>

        <motion.p
          className="l-quote__attr"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          — Food Tailor Philosophy
        </motion.p>
      </div>
    </section>
  );
}
