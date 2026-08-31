import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Minus, Plus, ArrowRight, ArrowLeft, Repeat, Trash2, Check, Sparkles } from 'lucide-react';
import { api } from '../lib/apiClient';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const stepLabels = ['Tell Us', 'AI Customizes', 'Choose & Adjust', 'Review & Confirm'];

const loadingTexts = [
  'Scanning signature menus across 9 brands…',
  'Matching dishes to your budget and guest count…',
  'Balancing flavors and dietary preferences…',
  'Curating your perfect multi-brand feast…',
];

export default function MenuBuilderPage() {
  const [step, setStep] = useState(1);
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [guestCount, setGuestCount] = useState(25);
  const [budgetPerHead, setBudgetPerHead] = useState(800);
  const [dietary, setDietary] = useState('all');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const [swappingDishId, setSwappingDishId] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    api.getOccasions().then(setOccasions).catch(console.error);
  }, []);

  // Step 2 — loading animation & API call
  useEffect(() => {
    if (step === 2) {
      let idx = 0;
      const interval = setInterval(() => {
        idx = (idx + 1) % loadingTexts.length;
        setLoadingText(loadingTexts[idx]);
      }, 700);

      const fetchMenu = async () => {
        try {
          const dietaryEnumMap = { 'all': 'ALL', 'veg': 'VEG', 'non-veg': 'NON_VEG' };
          const payload = {
            occasionName: selectedOccasion?.name || 'Event',
            guestCount,
            budgetPerHead,
            dietaryType: dietaryEnumMap[dietary] || 'ALL',
          };
          const response = await api.recommendMenu(payload);
          setPackages(response.packages || []);
          setStep(3);
        } catch (error) {
          console.error("Failed to generate menu:", error);
          // basic error handling
          setStep(1);
          alert("We couldn't generate a menu at this time. Please try adjusting your criteria.");
        }
      };

      fetchMenu();

      return () => {
        clearInterval(interval);
      };
    }
  }, [step, selectedOccasion, guestCount, budgetPerHead, dietary]);

  const handleGuestChange = useCallback((delta) => {
    setGuestCount(prev => Math.max(10, prev + delta));
  }, []);

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setMenuItems(pkg.items.map(item => ({ ...item })));
  };

  const removeItem = (dishId) => {
    setMenuItems(prev => prev.filter(item => item.id !== dishId));
  };

  const swapItem = (oldDishId, newDish) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === oldDishId ? { ...newDish, quantity: item.quantity } : item
      )
    );
    setSwappingDishId(null);
  };

  const totalPerHead = menuItems.reduce((sum, item) => sum + item.pricePerHead, 0);
  const totalEstimate = totalPerHead * guestCount;

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      alert("Please log in to confirm your order.");
      navigate('/login');
      return;
    }

    try {
      const dietaryEnumMap = { 'all': 'ALL', 'veg': 'VEG', 'non-veg': 'NON_VEG' };
      const payload = {
        occasionId: selectedOccasion?.id || null,
        guestCount,
        budgetPerHead,
        dietaryType: dietaryEnumMap[dietary] || 'ALL',
        contactName: user?.firstName || 'Guest',
        items: menuItems.map(item => ({
          dishId: item.dishId || item.id,
          quantity: guestCount,
        })),
      };

      const order = await api.createOrder(payload);
      setOrderId(order.orderRef);
      setOrderConfirmed(true);
      setStep(4);
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to confirm order. Please try again.");
    }
  };

  return (
    <div className="wizard" id="menu-builder">
      <div className="container">
        {/* Progress Indicators */}
        <div className="wizard__progress">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className={`wizard__connector ${isCompleted || isActive ? 'wizard__connector--active' : ''}`} />
                )}
                <div className="wizard__step-indicator">
                  <div className={`wizard__dot ${isActive ? 'wizard__dot--active' : ''} ${isCompleted ? 'wizard__dot--completed' : ''}`}>
                    {isCompleted ? <Check size={16} /> : stepNum}
                  </div>
                  <span className={`wizard__step-label ${isActive ? 'wizard__step-label--active' : ''}`}>
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ========== STEP 1: Tell Us ========== */}
          {step === 1 && (
            <motion.div key="step1" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <div className="section-header">
                <h2>Tell us about your <span className="text-accent">occasion</span></h2>
                <p>We'll use this to craft a menu that's perfect for your event.</p>
              </div>

              {/* Occasion Cards */}
              <h4 style={{ marginBottom: 'var(--space-md)' }}>What's the occasion?</h4>
              <div className="occasion-grid">
                {occasions.map(occ => (
                  <div
                    key={occ.id}
                    className={`occasion-card ${selectedOccasion?.id === occ.id ? 'occasion-card--selected' : ''}`}
                    onClick={() => setSelectedOccasion(occ)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedOccasion(occ)}
                  >
                    <div className="occasion-card__icon">{occ.icon}</div>
                    <div className="occasion-card__name">{occ.name}</div>
                  </div>
                ))}
              </div>

              {/* Guest Count */}
              <h4>How many guests?</h4>
              <div className="guest-counter">
                <button className="guest-counter__btn" onClick={() => handleGuestChange(-5)} aria-label="Decrease guests">
                  <Minus size={18} />
                </button>
                <div>
                  <div className="guest-counter__value">{guestCount}</div>
                  <div className="guest-counter__label">guests</div>
                </div>
                <button className="guest-counter__btn" onClick={() => handleGuestChange(5)} aria-label="Increase guests">
                  <Plus size={18} />
                </button>
                <span className="guest-counter__label" style={{ marginLeft: 'var(--space-md)', fontSize: '0.8rem' }}>
                  (minimum 10)
                </span>
              </div>

              {/* Budget Slider */}
              <div className="budget-slider">
                <label>Budget per guest</label>
                <input
                  type="range"
                  min={300}
                  max={2000}
                  step={50}
                  value={budgetPerHead}
                  onChange={(e) => setBudgetPerHead(Number(e.target.value))}
                />
                <div className="budget-slider__value">₹{budgetPerHead} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--charcoal-60)' }}>per head</span></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-40)', marginTop: '4px' }}>
                  Estimated total: ₹{(budgetPerHead * guestCount).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Dietary Preference */}
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>Dietary preference</h4>
              <div className="dietary-toggle">
                {[
                  { value: 'all', label: 'All (Mixed)' },
                  { value: 'veg', label: 'Vegetarian' },
                  { value: 'non-veg', label: 'Non-Vegetarian' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`dietary-toggle__btn ${dietary === opt.value ? 'dietary-toggle__btn--active' : ''}`}
                    onClick={() => setDietary(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Next */}
              <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn--primary btn--large"
                  disabled={!selectedOccasion}
                  onClick={() => setStep(2)}
                  style={{ opacity: selectedOccasion ? 1 : 0.5 }}
                >
                  Build My Menu
                  <Sparkles size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========== STEP 2: AI Loading ========== */}
          {step === 2 && (
            <motion.div key="step2" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <div className="loading-state">
                <Sparkles size={36} color="var(--terracotta)" />
                <h3>Building your menu…</h3>
                <div className="loading-state__bar">
                  <div className="loading-state__bar-fill" />
                </div>
                <p className="loading-state__text">{loadingText}</p>
              </div>
            </motion.div>
          )}

          {/* ========== STEP 3: Choose & Adjust ========== */}
          {step === 3 && (
            <motion.div key="step3" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <div className="section-header">
                <h2>Your AI-curated <span className="text-accent">menu packages</span></h2>
                <p>Select a package, then fine-tune individual dishes to your taste.</p>
              </div>

              {/* Package Cards */}
              {!selectedPackage && (
                <div className="package-grid">
                  {packages.map((pkg, i) => (
                    <motion.div
                      key={pkg.name}
                      className="package-card"
                      onClick={() => selectPackage(pkg)}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.1 }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && selectPackage(pkg)}
                    >
                      <div className="package-card__header">
                        <h3 className="package-card__name">{pkg.name}</h3>
                        <p className="package-card__desc">{pkg.description}</p>
                      </div>
                      <div className="package-card__body">
                        <div className="package-card__stats">
                          <div className="package-card__stat">
                            <div className="package-card__stat-value">₹{pkg.perHead}</div>
                            <div className="package-card__stat-label">Per Head</div>
                          </div>
                          <div className="package-card__stat">
                            <div className="package-card__stat-value">{pkg.items.length}</div>
                            <div className="package-card__stat-label">Dishes</div>
                          </div>
                          <div className="package-card__stat">
                            <div className="package-card__stat-value">{pkg.brandCount}</div>
                            <div className="package-card__stat-label">Brands</div>
                          </div>
                          <div className="package-card__stat">
                            <div className="package-card__stat-value">{pkg.confidence}%</div>
                            <div className="package-card__stat-label">Match</div>
                          </div>
                        </div>
                        <div className="package-card__items">
                          {pkg.items.map(item => (
                            <div key={item.id} className="package-card__item">
                              <div>
                                <span>{item.name}</span>
                                <span className="package-card__item-brand"> — {item.partnerName}</span>
                              </div>
                              <span className="package-card__item-price">₹{item.pricePerHead}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Selected package — dish editing */}
              {selectedPackage && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                    <div>
                      <h3 style={{ marginBottom: '4px' }}>{selectedPackage.name}</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-60)' }}>
                        {menuItems.length} dishes from {new Set(menuItems.map(i => i.partnerId)).size} brands
                      </p>
                    </div>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => { setSelectedPackage(null); setMenuItems([]); }}
                    >
                      <ArrowLeft size={16} /> Change Package
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {menuItems.map(item => (
                      <div key={item.id} className="dish-card">
                        <div className="dish-card__info">
                          <div className="dish-card__name">{item.name}</div>
                          <div className="dish-card__brand">{item.partnerName}</div>
                          <div className="dish-card__desc">{item.description}</div>

                          {/* Swap drawer removed for MVP simplicity */}
                        </div>
                        <div className="dish-card__meta">
                          <div className="dish-card__price">₹{item.pricePerHead}</div>
                          <div className="dish-card__per">per head</div>
                          <div className="dish-card__actions">
                            <button
                              className="btn btn--ghost btn--sm"
                              onClick={() => setSwappingDishId(swappingDishId === item.id ? null : item.id)}
                              title="Swap dish"
                            >
                              <Repeat size={14} />
                            </button>
                            <button
                              className="btn btn--ghost btn--sm"
                              onClick={() => removeItem(item.id)}
                              title="Remove dish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Running Total */}
                  <div style={{
                    marginTop: 'var(--space-2xl)',
                    padding: 'var(--space-xl)',
                    backgroundColor: 'var(--cream-tint)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--charcoal-10)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                      <span>Per head</span>
                      <strong>₹{totalPerHead}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                      <span>Guests</span>
                      <strong>{guestCount}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                      <span>Coordination fee (10%)</span>
                      <strong>₹{Math.round(totalEstimate * 0.10).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: 'var(--space-md)',
                      borderTop: '2px solid var(--charcoal-10)',
                      fontSize: '1.2rem',
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Total Estimate</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--terracotta)' }}>
                        ₹{Math.round(totalEstimate * 1.10).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
                    <button className="btn btn--secondary" onClick={() => { setSelectedPackage(null); setMenuItems([]); }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button className="btn btn--primary btn--large" onClick={handleConfirm} disabled={menuItems.length === 0}>
                      Confirm & Arrange
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========== STEP 4: Confirmation ========== */}
          {step === 4 && orderConfirmed && (
            <motion.div key="step4" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
              <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--terracotta), var(--terracotta-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-xl)',
                  }}
                >
                  <Check size={36} color="var(--cream)" />
                </motion.div>

                <h2 style={{ marginBottom: 'var(--space-md)' }}>Your event menu is <span className="text-accent">confirmed</span></h2>
                <p style={{ color: 'var(--charcoal-60)', marginBottom: 'var(--space-lg)' }}>
                  Order #{orderId} has been submitted. Our team will coordinate with each brand
                  and ensure everything arrives fresh and on time.
                </p>

                <div className="review-summary" style={{ textAlign: 'left', marginBottom: 'var(--space-2xl)' }}>
                  <div className="review-summary__header">
                    <h4>Order Summary</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--charcoal-60)' }}>
                      {selectedOccasion?.name} • {guestCount} guests • {menuItems.length} dishes
                    </p>
                  </div>
                  <div className="review-summary__body">
                    {menuItems.map(item => (
                      <div key={item.id} className="review-summary__item">
                        <div>
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--terracotta)', marginLeft: '8px' }}>{item.partnerName}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>₹{item.pricePerHead} × {guestCount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="review-summary__total">
                    <span className="review-summary__total-label">Total (incl. coordination)</span>
                    <span className="review-summary__total-value">
                      ₹{Math.round(totalEstimate * 1.10).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-60)', fontStyle: 'italic' }}>
                  "They bring the occasion. Brands bring the signature. We bring them together."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
