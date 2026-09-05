'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from '../lib/navigation';
import { api } from '../lib/apiClient';
import {
  BirthdayCakeSketch,
  AnniversaryRingsSketch,
  FamilyFeastSketch,
  CorporateMeetingSketch,
  RomanticDinnerSketch,
  FestivalLampSketch,
} from '../components/ui/svg/ExperienceSketches';
import { ClocheSketch } from '../components/ui/svg/FoodSketches';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Users } from 'lucide-react';

const OCCASION_OPTIONS = [
  { id: 'birthday', label: 'Birthday', desc: 'Milestone years & custom gateaux', Icon: BirthdayCakeSketch, color: '#C55418' },
  { id: 'anniversary', label: 'Anniversary', desc: 'Intimate candlelit royal dining', Icon: AnniversaryRingsSketch, color: '#173E23' },
  { id: 'family', label: 'Family', desc: 'Generational comfort & abundance', Icon: FamilyFeastSketch, color: '#173E23' },
  { id: 'corporate', label: 'Corporate', desc: 'Executive boardroom precision', Icon: CorporateMeetingSketch, color: '#173E23' },
  { id: 'romantic', label: 'Romantic', desc: 'Private residence tastings', Icon: RomanticDinnerSketch, color: '#C55418' },
  { id: 'festival', label: 'Festival', desc: 'Sanctified pure vegetarian feasts', Icon: FestivalLampSketch, color: '#C55418' },
  { id: 'custom', label: 'Custom', desc: 'Your bespoke gathering format', Icon: ClocheSketch, color: '#C55418' },
];

const MOOD_OPTIONS = [
  { id: 'Casual', label: 'Casual', desc: 'Easygoing street eats and finger foods' },
  { id: 'Elegant', label: 'Elegant', desc: 'Quiet luxury, silver-vark & white glove' },
  { id: 'Festive', label: 'Festive', desc: 'High-energy celebration & live stalls' },
  { id: 'Comforting', label: 'Comforting', desc: 'Generational soul food & warmth' },
  { id: 'Adventurous', label: 'Adventurous', desc: 'Single-origin cacao & modern fusion' },
  { id: 'Traditional', label: 'Traditional', desc: 'Authentic royal Nizami heritage' },
];

const DIETARY_OPTIONS = [
  { value: 'ALL', label: 'All Inclusive (Veg & Non-Veg)', desc: 'Balanced selection for diverse palates' },
  { value: 'NON_VEG', label: 'Curated Non-Veg Focus', desc: 'Slow-cooked mutton dum biryani & kebabs' },
  { value: 'VEG', label: 'Pure Vegetarian', desc: '100% pure veg segregated prep' },
  { value: 'JAIN', label: 'Strict Jain Preparation', desc: 'Sanctified kitchen, no root vegetables' },
  { value: 'VEGAN', label: 'Plant-Based / Vegan', desc: 'Wholesome dairy-free specialties' },
];

const CUISINE_OPTIONS = [
  'Hyderabadi & Mughlai',
  'Irani & Bakery',
  'Street Food & Chaat',
  'Royal Indian Sweets',
  'Artisanal Confectionery',
  'Desserts & Ice Creams',
  'Beverages & Shakes',
  'Paan & After-Mints',
];

const SPICE_OPTIONS = [
  { value: 'MILD', label: 'Mild & Delicate', desc: 'Subtle aromatic saffron infusions, zero sharp heat' },
  { value: 'MEDIUM', label: 'Balanced Warmth', desc: 'Harmonious traditional Hyderabadi seasoning' },
  { value: 'SPICY', label: 'Bold & Zesty', desc: 'Rich red chili & peppery aromatic punch' },
  { value: 'EXTRA_SPICY', label: 'Fiery Andhra Heat', desc: 'Authentic Guntur & Rayalaseema heat' },
];

export default function MenuBuilderIntake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [partners, setPartners] = useState([]);
  const [synthesizing, setSynthesizing] = useState(false);
  const [error, setError] = useState(null);

  // 8-Step Form State with persistence
  const [formData, setFormData] = useState({
    occasion: 'birthday',
    guestCount: 25,
    cuisines: ['Hyderabadi & Mughlai', 'Royal Indian Sweets'],
    spiceLevel: 'MEDIUM',
    dietaryType: 'ALL',
    mood: 'Elegant',
    selectedPartners: [],
    budgetPerHead: 850,
  });

  // Load partners and restore saved state from sessionStorage
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await api.getPartners().catch(() => ({ partners: [] }));
        if (isMounted) {
          const list = res.partners || res.data?.partners || (Array.isArray(res) ? res : []);
          setPartners(list);
        }
      } catch {
        // Handled
      }

      // Restore previously entered state if available
      try {
        const savedIntake = sessionStorage.getItem('ft_intake');
        if (savedIntake && isMounted) {
          setFormData((prev) => ({ ...prev, ...JSON.parse(savedIntake) }));
        }
      } catch {
        // Ignored
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('ft_intake', JSON.stringify(formData));
    } catch {
      // Ignored
    }
  }, [formData]);

  const toggleCuisine = (c) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(c)
        ? prev.cuisines.filter((item) => item !== c)
        : [...prev.cuisines, c],
    }));
  };

  const togglePartner = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedPartners: prev.selectedPartners.includes(id)
        ? prev.selectedPartners.filter((item) => item !== id)
        : [...prev.selectedPartners, id],
    }));
  };

  // Step 8: Trigger AI Menu Generation
  const handleGenerateMenu = async () => {
    setSynthesizing(true);
    setError(null);
    try {
      const payload = {
        guestCount: parseInt(formData.guestCount, 10),
        budgetPerHead: parseInt(formData.budgetPerHead, 10),
        dietaryType: formData.dietaryType,
        spiceLevel: formData.spiceLevel,
        cuisines: formData.cuisines.length > 0 ? formData.cuisines : undefined,
      };

      const result = await api.recommendMenu(payload);

      // Persist recommendation for review page
      sessionStorage.setItem(
        'ft_recommendation',
        JSON.stringify({
          packages: result.packages || (result.items ? [{ name: 'Curated Degustation', items: result.items, perHead: result.perHead, totalEstimate: result.totalEstimate }] : []),
          raw: result,
          intake: formData,
        })
      );

      navigate('/build-menu/review');
    } catch (err) {
      console.error('Menu recommendation error', err);
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.error ||
          'Could not synthesize menu. Please verify parameters.'
      );
      setSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C55418]"></span>
            <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold">
              Private Concierge Wizard
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-[#173E23]">
            Build My Menu
          </h1>
          <PencilUnderline className="w-44 h-3 mx-auto my-2" color="#C55418" />
          <p className="text-xs sm:text-sm text-[#424941] font-serif italic">
            Calibrate courses, guest dynamics, and culinary houses across 8 personalization dimensions.
          </p>
        </div>

        {/* 8-Step Progress Stepper */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E2D8C6] shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[560px]">
            {[
              { num: 1, label: 'Occasion' },
              { num: 2, label: 'Guests' },
              { num: 3, label: 'Taste' },
              { num: 4, label: 'Diet' },
              { num: 5, label: 'Mood' },
              { num: 6, label: 'Partners' },
              { num: 7, label: 'Budget' },
              { num: 8, label: 'Review' },
            ].map((s, idx, arr) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <button
                    onClick={() => !synthesizing && setStep(s.num)}
                    className="flex items-center gap-1.5 focus:outline-none"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#C55418] text-white shadow-sm ring-4 ring-[#C55418]/20'
                          : isPast
                          ? 'bg-[#173E23] text-white'
                          : 'bg-[#F3EFE6] text-[#7C6F5A]'
                      }`}
                    >
                      {isPast ? '✓' : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden md:inline ${
                        isActive ? 'text-[#173E23]' : 'text-[#7C6F5A]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < arr.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 transition-colors ${
                        step > idx + 1 ? 'bg-[#173E23]' : 'bg-[#E2D8C6]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Wizard Form Card */}
        <div className="sketch-card p-6 sm:p-10 rounded-2xl border border-[#EBE3D5] shadow-md min-h-[420px] flex flex-col justify-between">
          
          {/* STEP 01 — OCCASION */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 01 • The Occasion
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  What are we celebrating?
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Choose the gathering format to initialize course structures and banquet tempo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {OCCASION_OPTIONS.map((occ) => {
                  const isSelected = formData.occasion === occ.id;
                  const Icon = occ.Icon;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, occasion: occ.id })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#173E23] text-white border-[#173E23] shadow-md'
                          : 'bg-white text-[#1C1C18] border-[#E2D8C6] hover:border-[#173E23]/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-[#FAF6EF] text-[#173E23]'
                      }`}>
                        <Icon className="w-6 h-6" color={isSelected ? '#FFFFFF' : occ.color} />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base leading-snug">{occ.label}</h3>
                        <p className={`text-[11px] mt-0.5 leading-relaxed font-light ${isSelected ? 'text-white/80' : 'text-[#7C6F5A]'}`}>
                          {occ.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 02 — GUESTS */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 02 • Headcount & Scale
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  How many guests will be seated?
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  We portion dishes mathematically to prevent wastage while guaranteeing lavish hospitality.
                </p>
              </div>

              <div className="max-w-md mx-auto py-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#173E23]/10 text-[#173E23] flex items-center justify-center mx-auto mb-2">
                  <Users className="w-10 h-10 text-[#173E23]" />
                </div>

                <div>
                  <span className="font-display text-6xl text-[#173E23] font-bold block">
                    {formData.guestCount}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#7C6F5A] font-semibold">
                    Guest Covers Expected
                  </span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#C55418] h-2 bg-[#E2D8C6] rounded-lg cursor-pointer"
                />

                {/* Quick Presets */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[15, 25, 50, 75, 100, 200].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setFormData({ ...formData, guestCount: count })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        formData.guestCount === count
                          ? 'bg-[#C55418] text-white shadow-sm'
                          : 'bg-white border border-[#E2D8C6] text-[#7C6F5A] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      {count} Guests
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 03 — TASTE & CUISINE */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 03 • Palate & Taste
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  Select your preferred cuisines & spice scale.
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Choose the culinary traditions you want spotlighted on the banquet line.
                </p>
              </div>

              {/* Cuisine Pills */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-3">
                  Cuisine Profiles (Select Multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CUISINE_OPTIONS.map((c) => {
                    const isSelected = formData.cuisines.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCuisine(c)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#173E23] text-white border-[#173E23] shadow-sm'
                            : 'bg-white text-[#424941] border-[#E2D8C6] hover:bg-[#FAF6EF]'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spice Options */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-3">
                  Spice Calibration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPICE_OPTIONS.map((spice) => {
                    const isSelected = formData.spiceLevel === spice.value;
                    return (
                      <button
                        key={spice.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, spiceLevel: spice.value })}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#C55418] text-white border-[#C55418] shadow-sm'
                            : 'bg-white text-[#1C1C18] border-[#E2D8C6] hover:bg-[#FAF6EF]'
                        }`}
                      >
                        <h4 className="font-serif font-bold text-sm">{spice.label}</h4>
                        <p className={`text-xs mt-0.5 font-light ${isSelected ? 'text-white/85' : 'text-[#7C6F5A]'}`}>
                          {spice.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 04 — DIETARY PREFERENCES */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 04 • Dietary Guardrails
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  What are your dietary preferences?
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  We guarantee dedicated kitchen segregation and clear labeling for all courses.
                </p>
              </div>

              <div className="space-y-3">
                {DIETARY_OPTIONS.map((diet) => {
                  const isSelected = formData.dietaryType === diet.value;
                  return (
                    <button
                      key={diet.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietaryType: diet.value })}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#173E23] text-white border-[#173E23] shadow-sm'
                          : 'bg-white text-[#1C1C18] border-[#E2D8C6] hover:bg-[#FAF6EF]'
                      }`}
                    >
                      <div>
                        <h3 className="font-serif font-bold text-base">{diet.label}</h3>
                        <p className={`text-xs mt-0.5 font-light ${isSelected ? 'text-white/80' : 'text-[#7C6F5A]'}`}>
                          {diet.desc}
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-white bg-white/20' : 'border-[#E2D8C6]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 05 — MOOD */}
          {step === 5 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 05 • Atmosphere & Mood
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  What is the desired atmosphere?
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Atmosphere determines course presentation, serving speed, and tableside theater.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {MOOD_OPTIONS.map((m) => {
                  const isSelected = formData.mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: m.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#173E23] text-white border-[#173E23] shadow-sm'
                          : 'bg-white text-[#1C1C18] border-[#E2D8C6] hover:bg-[#FAF6EF]'
                      }`}
                    >
                      <h3 className="font-serif font-bold text-base mb-1">{m.label}</h3>
                      <p className={`text-xs font-light ${isSelected ? 'text-white/80' : 'text-[#7C6F5A]'}`}>
                        {m.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 06 — PARTNERS */}
          {step === 6 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 06 • Atelier Guild Selection
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  Select preferred partner kitchen(s).
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Pick your favorite institutions or leave empty for optimal automated curation across all 11 partners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {partners.map((p) => {
                  const isSelected = formData.selectedPartners.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePartner(p.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#173E23] text-white border-[#173E23] shadow-sm'
                          : 'bg-white text-[#1C1C18] border-[#E2D8C6] hover:bg-[#FAF6EF]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected ? 'bg-[#C55418] border-[#C55418]' : 'border-[#E2D8C6]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm leading-tight">{p.businessName}</h4>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#7C6F5A]'}`}>
                          {p.cuisine}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 07 — BUDGET */}
          {step === 7 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 07 • Investment Parameters
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  Define your budget range per cover.
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Our system maximizes course richness and premium ingredients within your specified target.
                </p>
              </div>

              <div className="max-w-md mx-auto py-6 text-center space-y-6">
                <div>
                  <span className="font-display text-5xl text-[#173E23] font-bold block">
                    ₹{formData.budgetPerHead}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#7C6F5A] font-semibold">
                    Target Budget Per Head (Approx. ₹{(formData.budgetPerHead * formData.guestCount).toLocaleString()} total)
                  </span>
                </div>

                <input
                  type="range"
                  min="400"
                  max="2500"
                  step="50"
                  value={formData.budgetPerHead}
                  onChange={(e) => setFormData({ ...formData, budgetPerHead: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#C55418] h-2 bg-[#E2D8C6] rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[500, 750, 1000, 1500, 2000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetPerHead: b })}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        formData.budgetPerHead === b
                          ? 'bg-[#C55418] text-white shadow-sm'
                          : 'bg-white border border-[#E2D8C6] text-[#7C6F5A] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      ₹{b} / cover
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 08 — REVIEW PROFILE & GENERATE */}
          {step === 8 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C55418] block mb-1">
                  Step 08 • Synthesis Profile
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#173E23]">
                  Review your personalization profile.
                </h2>
                <p className="text-xs text-[#7C6F5A] mt-1 font-light">
                  Ready to activate our AI curation engine and generate your tailored degustation packages.
                </p>
              </div>

              <div className="bg-[#FAF6EF] p-5 sm:p-6 rounded-2xl border border-[#EBE3D5] space-y-4 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium">Occasion</span>
                    <strong className="text-[#173E23] text-sm capitalize font-serif">{formData.occasion}</strong>
                  </div>
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium">Headcount</span>
                    <strong className="text-[#173E23] text-sm font-serif">{formData.guestCount} Guests</strong>
                  </div>
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium">Dietary</span>
                    <strong className="text-[#173E23] text-sm font-serif">{formData.dietaryType}</strong>
                  </div>
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium">Target Budget</span>
                    <strong className="text-[#173E23] text-sm font-serif">₹{formData.budgetPerHead} / head</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBE3D5] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium mb-1">Atmosphere</span>
                    <span className="px-2.5 py-0.5 rounded bg-white text-[#173E23] border border-[#EBE3D5] font-semibold">
                      {formData.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C6F5A] uppercase tracking-wider block font-medium mb-1">Cuisines Selected</span>
                    <div className="flex flex-wrap gap-1">
                      {formData.cuisines.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-white text-[#173E23] border border-[#EBE3D5] text-[11px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls Bar */}
          <div className="pt-6 border-t border-[#EBE3D5] flex items-center justify-between gap-4 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#173E23] border border-[#E2D8C6] rounded-xl hover:bg-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 bg-[#173E23] hover:bg-[#00280f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateMenu}
                disabled={synthesizing}
                className="px-8 py-3 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>GENERATE MY MENU</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* AI Menu Generation Sketch Modal (Section 29) */}
      {synthesizing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="sketch-card bg-[#FDFBF7] p-8 sm:p-12 rounded-3xl border-2 border-[#173E23] max-w-md w-full text-center shadow-2xl space-y-6 animate-fade-in">
            
            {/* Animated Plate Sketch */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C55418] animate-spin" style={{ animationDuration: '8s' }} />
              <ClocheSketch className="w-14 h-14" color="#173E23" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-1">
                Atelier Intelligence Active
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#173E23]">
                Inking Your Bespoke Menu...
              </h3>
              <p className="text-xs text-[#7C6F5A] mt-2 font-light leading-relaxed">
                Balancing course harmony across {formData.guestCount} covers with verified dishes from Hyderabad's premier culinary houses.
              </p>
            </div>

            <div className="w-full bg-[#E2D8C6] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C55418] h-full animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
