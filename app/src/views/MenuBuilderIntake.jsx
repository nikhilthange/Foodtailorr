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
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Users, ChefHat } from 'lucide-react';

const OCCASION_OPTIONS = [
  { id: 'birthday', label: 'Birthday', desc: 'Milestone years & custom gateaux', Icon: BirthdayCakeSketch, color: '#C85419' },
  { id: 'anniversary', label: 'Anniversary', desc: 'Intimate candlelit royal dining', Icon: AnniversaryRingsSketch, color: '#0D381E' },
  { id: 'family', label: 'Family', desc: 'Generational comfort & abundance', Icon: FamilyFeastSketch, color: '#0D381E' },
  { id: 'corporate', label: 'Corporate', desc: 'Executive boardroom precision', Icon: CorporateMeetingSketch, color: '#0D381E' },
  { id: 'romantic', label: 'Romantic', desc: 'Private residence tastings', Icon: RomanticDinnerSketch, color: '#C85419' },
  { id: 'festival', label: 'Festival', desc: 'Sanctified pure vegetarian feasts', Icon: FestivalLampSketch, color: '#C85419' },
  { id: 'custom', label: 'Custom', desc: 'Your bespoke gathering format', Icon: ClocheSketch, color: '#C85419' },
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

      try {
        const savedIntake = sessionStorage.getItem('ft_intake');
        if (savedIntake && isMounted) {
          setFormData((prev) => ({ ...prev, ...JSON.parse(savedIntake) }));
        }
      } catch {
        // Handled
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCuisine = (cuisine) => {
    setFormData((prev) => {
      const exists = prev.cuisines.includes(cuisine);
      if (exists) {
        if (prev.cuisines.length === 1) return prev;
        return { ...prev, cuisines: prev.cuisines.filter((c) => c !== cuisine) };
      } else {
        return { ...prev, cuisines: [...prev.cuisines, cuisine] };
      }
    });
  };

  const togglePartner = (partnerId) => {
    setFormData((prev) => {
      const exists = prev.selectedPartners.includes(partnerId);
      if (exists) {
        return { ...prev, selectedPartners: prev.selectedPartners.filter((id) => id !== partnerId) };
      } else {
        return { ...prev, selectedPartners: [...prev.selectedPartners, partnerId] };
      }
    });
  };

  const handleGenerateMenu = async () => {
    try {
      setSynthesizing(true);
      setError(null);
      sessionStorage.setItem('ft_intake', JSON.stringify(formData));

      const payload = {
        guestCount: formData.guestCount,
        budgetPerHead: formData.budgetPerHead,
        dietaryType: formData.dietaryType,
        spiceLevel: formData.spiceLevel,
        occasion: formData.occasion,
        cuisines: formData.cuisines,
        selectedPartners: formData.selectedPartners,
      };

      const res = await api.recommendMenu(payload);

      const recommendationData = {
        packages: res.packages || [
          {
            name: 'Chef Curated Degustation',
            items: res.items || [],
            perHead: res.perHead || formData.budgetPerHead,
            totalEstimate: (res.perHead || formData.budgetPerHead) * formData.guestCount,
          },
        ],
        raw: res,
        intake: formData,
      };

      sessionStorage.setItem('ft_recommendation', JSON.stringify(recommendationData));

      setTimeout(() => {
        setSynthesizing(false);
        navigate('/build-menu/review');
      }, 1200);
    } catch (err) {
      console.error('Synthesis failed:', err);
      setError('Could not synthesize custom menu. Please check connection.');
      setSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-24">
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#081810] to-[#0D381E] text-white pt-28 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C85419]" />
            <span>Interactive Curation Studio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            Tailor Your Gathering
          </h1>
          <p className="mt-2 text-slate-200/90 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Step {step} of 8 • Define your gathering parameters to synthesize a balanced multi-brand feast.
          </p>
        </div>
      </section>

      {/* Main Workspace Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Stepper Progress Indicator */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-6 overflow-x-auto no-scrollbar">
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
                    className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#C85419] text-white shadow-sm ring-4 ring-[#C85419]/20'
                          : isPast
                          ? 'bg-[#0D381E] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden md:inline ${
                        isActive ? 'text-[#0D381E]' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < arr.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 transition-colors ${
                        step > idx + 1 ? 'bg-[#0D381E]' : 'bg-slate-200'
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
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 min-h-[420px] flex flex-col justify-between">
          
          {/* STEP 01 — OCCASION */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 01 • The Occasion
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  What are we celebrating?
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
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
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D381E] text-white border-[#0D381E] shadow-md'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-700/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#0D381E]'
                      }`}>
                        <Icon className="w-6 h-6" color={isSelected ? '#FFFFFF' : occ.color} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base leading-snug">{occ.label}</h3>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 02 • Headcount & Scale
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  How many guests will be seated?
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  We portion dishes mathematically to prevent wastage while guaranteeing lavish hospitality.
                </p>
              </div>

              <div className="max-w-md mx-auto py-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#0D381E] flex items-center justify-center mx-auto mb-2">
                  <Users className="w-10 h-10 text-[#0D381E]" />
                </div>

                <div>
                  <span className="font-display text-6xl text-[#0D381E] font-black block">
                    {formData.guestCount}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    Guest Covers Expected
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#C85419] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[15, 25, 50, 75, 100, 200].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setFormData({ ...formData, guestCount: count })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        formData.guestCount === count
                          ? 'bg-[#C85419] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 03 • Palate & Taste
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  Select your preferred cuisines & spice scale.
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Choose the culinary traditions you want spotlighted on the banquet line.
                </p>
              </div>

              {/* Cuisine Pills */}
              <div className="mb-8">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
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
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D381E] text-white border-[#0D381E] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
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
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#C85419] text-white border-[#C85419] shadow-sm'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <h4 className="font-display font-bold text-sm">{spice.label}</h4>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/85' : 'text-slate-500'}`}>
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 04 • Dietary Guardrails
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  What are your dietary preferences?
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
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
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D381E] text-white border-[#0D381E] shadow-sm'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <h3 className="font-display font-bold text-base">{diet.label}</h3>
                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {diet.desc}
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-white bg-white/20' : 'border-slate-300'
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 05 • Atmosphere & Mood
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  What is the desired atmosphere?
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
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
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D381E] text-white border-[#0D381E] shadow-sm'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <h3 className="font-display font-bold text-base mb-1">{m.label}</h3>
                      <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 06 • Atelier Guild Selection
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  Select preferred partner kitchen(s).
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
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
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D381E] text-white border-[#0D381E] shadow-sm'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected ? 'bg-[#C85419] border-[#C85419]' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm leading-tight">{p.businessName}</h4>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 07 • Investment Parameters
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  Define your budget range per cover.
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Our system maximizes course richness and premium ingredients within your specified target.
                </p>
              </div>

              <div className="max-w-md mx-auto py-6 text-center space-y-6">
                <div>
                  <span className="font-display text-5xl text-[#0D381E] font-black block">
                    ₹{formData.budgetPerHead}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
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
                  className="w-full accent-[#C85419] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[500, 750, 1000, 1500, 2000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budgetPerHead: b })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        formData.budgetPerHead === b
                          ? 'bg-[#C85419] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85419] block mb-1">
                  Step 08 • Synthesis Profile
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0D381E]">
                  Review your personalization profile.
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Ready to activate our AI curation engine and generate your tailored degustation packages.
                </p>
              </div>

              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Occasion</span>
                    <strong className="text-[#0D381E] text-sm capitalize">{formData.occasion}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Headcount</span>
                    <strong className="text-[#0D381E] text-sm">{formData.guestCount} Guests</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Dietary</span>
                    <strong className="text-[#0D381E] text-sm">{formData.dietaryType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px]">Target Budget</span>
                    <strong className="text-[#0D381E] text-sm">₹{formData.budgetPerHead} / head</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px] mb-1">Atmosphere</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white text-[#0D381E] border border-slate-200 font-semibold">
                      {formData.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider block font-semibold text-[10px] mb-1">Cuisines Selected</span>
                    <div className="flex flex-wrap gap-1">
                      {formData.cuisines.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-md bg-white text-[#0D381E] border border-slate-200 text-[11px]">
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
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
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
                className="btn-primary"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateMenu}
                disabled={synthesizing}
                className="btn-accent"
              >
                <Sparkles className="w-4 h-4" />
                <span>GENERATE MY MENU</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* AI Menu Generation Modal */}
      {synthesizing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 max-w-md w-full text-center shadow-2xl space-y-6 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-dashed border-[#C85419] animate-spin" style={{ animationDuration: '6s' }} />
              <ChefHat className="w-10 h-10 text-[#0D381E]" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
                Atelier Intelligence Active
              </span>
              <h3 className="font-display font-bold text-2xl text-[#0D381E]">
                Inking Your Bespoke Menu...
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-normal leading-relaxed">
                Balancing course harmony across {formData.guestCount} covers with verified dishes from Hyderabad's premier culinary houses.
              </p>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#C85419] to-[#D95D1E] h-full animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
