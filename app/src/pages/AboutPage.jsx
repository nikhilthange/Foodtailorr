import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Vision */}
      <section className="section section--cream">
        <div className="container" style={{ maxWidth: 750 }}>
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>
              Our Story
            </span>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>
              Your favorite brands. <span className="text-accent">Tailored for your special moments.</span>
            </h1>

            <div style={{ fontSize: '1.08rem', color: 'var(--charcoal-60)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 'var(--space-lg)' }}>
                Food should be remembered. At Food Tailor, we believe the best celebrations are built around food people already love.
              </p>

              <p style={{ marginBottom: 'var(--space-lg)' }}>
                When planning a birthday, wedding, or corporate gathering, traditional options force you to choose between one single restaurant or generic catering with no brand identity.
              </p>

              <p style={{ marginBottom: 'var(--space-lg)' }}>
                <strong>Food Tailor is the third option.</strong> We bring authentic dishes and beloved food brands together — Cafe Niloufer's iconic Irani Chai, Hotel Shadab's legendary dum biryani, Maharaja Chat, Samosa King, and Almond House sweets — delivered fresh and coordinated into one unforgettable spread.
              </p>

              <p style={{ marginBottom: 'var(--space-lg)' }}>
                You choose your favorite brands and dishes. We handle the curation, timing, and delivery so your feast arrives hot and ready for your guests to enjoy.
              </p>

              <p style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '1.2rem',
                color: 'var(--charcoal)',
                padding: 'var(--space-xl)',
                borderLeft: '3px solid var(--terracotta)',
                backgroundColor: 'var(--cream-tint)',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              }}>
                "From your favorite brands to your special moments."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact & Inquiries */}
      <section className="section section--tint">
        <div className="container" style={{ maxWidth: 750 }}>
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="section-label" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>
              Get In Touch
            </span>
            <h2 style={{ marginBottom: 'var(--space-xl)' }}>
              Connect with <span className="text-accent">Food Tailor</span>
            </h2>

            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              <div style={{
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--cream)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--charcoal-10)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <Mail size={24} color="var(--ft-red)" />
                <div>
                  <h4 style={{ color: 'var(--ft-dark)', margin: 0, fontSize: '1rem' }}>Event Inquiries &amp; Menu Planning</h4>
                  <a href="mailto:contact@foodtailor.in" style={{ color: 'var(--ft-red)', fontWeight: 700, textDecoration: 'none' }}>
                    contact@foodtailor.in
                  </a>
                </div>
              </div>

              <div style={{
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--cream)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--charcoal-10)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <Mail size={24} color="var(--ft-red)" />
                <div>
                  <h4 style={{ color: 'var(--ft-dark)', margin: 0, fontSize: '1rem' }}>Founder &amp; Brand Partnerships</h4>
                  <a href="mailto:founder@foodtailor.in" style={{ color: 'var(--ft-red)', fontWeight: 700, textDecoration: 'none' }}>
                    founder@foodtailor.in
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to tailor your feast?</h2>
          <p>Explore your favorite brands and build your event menu today.</p>
          <Link to="/menu-builder" className="btn btn--cream btn--large">
            Start Your Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
