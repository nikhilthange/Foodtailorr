'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PartnerCard from '../components/PartnerCard';

export default function HomePage() {
  // Dynamic state loaded from real backend
  const [partners, setPartners] = useState([]);
  const [_loadingPartners, setLoadingPartners] = useState(true);

  // Load Approved Partners from Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await api.getPartners().catch(() => ({ partners: [] }));
        if (isMounted) {
          const list = res.partners || res.data?.partners || (Array.isArray(res) ? res : []);
          setPartners(list);
        }
      } catch {
        // Gracefully handled fallback
      } finally {
        if (isMounted) setLoadingPartners(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 8 Curated Occasions with outline Bootstrap Icons
  const occasionCards = useMemo(
    () => [
      {
        id: 'birthday',
        slug: 'birthday-celebration',
        title: 'Birthday',
        description: 'Make every milestone legendary with decadent dessert bars, interactive chaat, and bespoke menus.',
        iconName: 'bi-cake2',
        colorClass: 'text-[#C65518]',
      },
      {
        id: 'anniversary',
        slug: 'anniversary-evening',
        title: 'Anniversary',
        description: 'Intimate celebratory gastronomy with royal Nizami slow-steamed courses and single-origin cacao pairings.',
        iconName: 'bi-gem',
        colorClass: 'text-[#173E23]',
      },
      {
        id: 'family',
        slug: 'family-gathering',
        title: 'Family Gathering',
        description: 'Generational comfort fare uniting grandparents, toddlers, and cousins around one lavish banquet line.',
        iconName: 'bi-people',
        colorClass: 'text-[#173E23]',
      },
      {
        id: 'corporate',
        slug: 'corporate-feast',
        title: 'Corporate Feast',
        description: 'Minute-accurate boardroom catering and executive galas backed by certified temperature logs and bento folios.',
        iconName: 'bi-briefcase',
        colorClass: 'text-[#173E23]',
      },
      {
        id: 'romantic',
        slug: 'romantic-dinner',
        title: 'Romantic Dinner',
        description: 'Private candlelit residence dining featuring silver-vark delicacies and bespoke tasting courses.',
        iconName: 'bi-heart',
        colorClass: 'text-[#C65518]',
      },
      {
        id: 'festival',
        slug: 'festival-celebration',
        title: 'Festival',
        description: 'Time-honored pure ghee sweets, sanctified kitchen segregation, and ceremonial holiday feasts.',
        iconName: 'bi-sun',
        colorClass: 'text-[#C65518]',
      },
      {
        id: 'weekend',
        slug: 'weekend-celebration',
        title: 'Weekend Celebration',
        description: 'High-energy house parties with live flaming charcoal skewers, crispy samosas, and craft coolers.',
        iconName: 'bi-music-note-beamed',
        colorClass: 'text-[#173E23]',
      },
      {
        id: 'custom',
        slug: 'custom-occasion',
        title: 'Custom Occasion',
        description: 'Your unique moment, architected course-by-course with personalized pairings and custom logistics.',
        iconName: 'bi-compass',
        colorClass: 'text-[#C65518]',
      },
    ],
    []
  );

  // Fallback approved partner list if backend has zero partners loaded
  const displayPartners = partners.length > 0 ? partners.slice(0, 6) : [
    {
      id: 'ptr_niloufer',
      slug: 'cafe-niloufer',
      businessName: 'Cafe Niloufer',
      cuisine: 'Irani & Bakery',
      location: 'Lakdikapul / Banjara Hills, Hyderabad',
      description: "Since 1978, Cafe Niloufer has defined Hyderabad's quintessential Irani chai and bakery culture.",
      coverImageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
      established: 1978,
    },
    {
      id: 'ptr_shadab',
      slug: 'hotel-shadab',
      businessName: 'Hotel Shadab',
      cuisine: 'Hyderabadi & Mughlai',
      location: 'Ghansi Bazaar / Old City, Hyderabad',
      description: 'Near the historic Charminar since 1953, producing legendary slow-cooked Nizami Mutton Dum Biryani.',
      coverImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
      established: 1953,
    },
    {
      id: 'ptr_samosasingh',
      slug: 'sammosa-singh',
      businessName: 'Sammosa Singh',
      cuisine: 'Appetizers & Snacks',
      location: 'Hitec City / Gachibowli, Hyderabad',
      description: "Reinventing India's king of snacks with proprietary triangular pastries that stay crisp for 45+ minutes.",
      coverImageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
      established: 2016,
    },
    {
      id: 'ptr_manam',
      slug: 'manam-chocolate',
      businessName: 'Manam Chocolate',
      cuisine: 'Artisanal Confectionery',
      location: 'Road No. 12, Banjara Hills, Hyderabad',
      description: 'Award-winning craft chocolate atelier transforming West Godavari cacao into single-origin bars.',
      coverImageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop',
      established: 2022,
    },
    {
      id: 'ptr_almondhouse',
      slug: 'almond-house',
      businessName: 'Almond House',
      cuisine: 'Royal Indian Sweets',
      location: 'Himayatnagar / Jubilee Hills, Hyderabad',
      description: 'Master confectioners renowned for pure ghee Bisticks, Badam Halwa, and silver-vark Shahi Kaju Katli.',
      coverImageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop',
      established: 1989,
    },
    {
      id: 'ptr_iceberg',
      slug: 'ice-berg',
      businessName: 'Ice Berg',
      cuisine: 'Desserts & Ice Creams',
      location: 'Jubilee Hills / Madhapur, Hyderabad',
      description: 'Organic handcrafted ice creams made with real seasonal fruits like Sitaphal and tender coconut.',
      coverImageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1200&auto=format&fit=crop',
      established: 2012,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAFAF8] text-[#1A1A1A] selection:bg-[#C65518] selection:text-white overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                             */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center bg-[#173E23] text-white pt-24 pb-20 px-4 md:px-8 overflow-hidden">
        {/* Ambient Culinary Photography Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop"
            alt="Hyderabad Culinary Heritage"
            className="w-full h-full object-cover object-center opacity-25 brightness-75 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173E23] via-[#173E23]/80 to-[#173E23]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#173E23]/50 to-[#173E23]" />
        </div>

        {/* Content Container: Constrained Column with Generous Whitespace */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <i className="bi bi-stars text-[#C65518]" />
            <span>Hyderabad Atelier Guild • 11 Curated Masters</span>
          </div>

          {/* Master Headline in Confident Fine-Dining Typography */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-4">
            Your Favorite Food, <br className="hidden sm:block" />
            <span className="text-[#FAFAF8]">Tailored For Every Moment.</span>
          </h1>

          {/* Supporting Narrative */}
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#FAFAF8]/85 max-w-2xl mb-10 font-normal leading-relaxed">
            Discover Hyderabad&apos;s finest culinary partners and curate an extraordinary banquet experience around your taste, occasion, and guest count.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <Link
              to="/build-menu"
              className="btn-primary px-8 py-4 text-sm tracking-widest shadow-xl flex items-center gap-2.5 group"
            >
              <span>Build My Menu</span>
              <i className="bi bi-arrow-right text-base group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/how-it-works"
              className="btn-secondary px-8 py-4 text-sm border-white/40 text-white hover:bg-white/10 hover:border-white transition-all flex items-center gap-2"
            >
              <span>Explore Experiences</span>
              <i className="bi bi-compass text-base" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 mt-14 flex flex-col items-center gap-1 opacity-70 animate-bounce">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FAFAF8]/70">Scroll to Explore</span>
          <i className="bi bi-chevron-down text-sm text-[#FAFAF8]/70" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — HOW IT WORKS                                     */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F2EFE6] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C65518] block mb-2">
              The Four-Stage Curation
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173E23] tracking-tight">
              How It Works
            </h2>
            <div className="w-16 h-0.5 bg-[#C65518] my-4 mx-auto" />
            <p className="font-sans text-sm sm:text-base text-[#1A1A1A]/80 font-normal leading-relaxed">
              From your first inspiration to the final toast, we synchronize Hyderabad&apos;s culinary legends onto one seamless table.
            </p>
          </div>

          {/* 4-Step Illustrated Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* STEP 01 */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#C65518]/10 flex items-center justify-center mb-5 text-[#C65518] group-hover:scale-105 transition-transform">
                <i className="bi bi-calendar-event text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STEP 01
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Tell us your moment.
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Select your occasion, date, venue location, and guest count. Whether an intimate anniversary or royal banquet.
              </p>
            </div>

            {/* STEP 02 */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#173E23]/10 flex items-center justify-center mb-5 text-[#173E23] group-hover:scale-105 transition-transform">
                <i className="bi bi-sliders text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#173E23] tracking-widest uppercase mb-1">
                STEP 02
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Tell us what you love.
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Specify spice tolerance, dietary preferences (Pure Veg, Non-Veg, Jain), cuisine favorites, and preferred kitchens.
              </p>
            </div>

            {/* STEP 03 */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#C65518]/10 flex items-center justify-center mb-5 text-[#C65518] group-hover:scale-105 transition-transform">
                <i className="bi bi-stars text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STEP 03
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                We tailor your feast.
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Our AI curation engine synthesizes a multi-course degustation from approved catalog dishes across vetted institutions.
              </p>
            </div>

            {/* STEP 04 */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#173E23]/10 flex items-center justify-center mb-5 text-[#173E23] group-hover:scale-105 transition-transform">
                <i className="bi bi-cup-hot text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#173E23] tracking-widest uppercase mb-1">
                STEP 04
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Enjoy the moment.
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Relax as our concierge orchestrates synchronized delivery, temperature seals, and flawless banquet staging.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#173E23] hover:text-[#C65518] transition-colors"
            >
              <span>Explore The Complete Curation Story</span>
              <i className="bi bi-arrow-right" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — PERSONALIZATION                                  */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAFAF8] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C65518] block mb-2">
                Bespoke Dimensions
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173E23] tracking-tight leading-tight mb-4">
                Food should fit the moment.
              </h2>
              <div className="w-16 h-0.5 bg-[#C65518] mb-6" />

              <p className="font-serif italic text-base sm:text-lg text-[#173E23] mb-4 leading-relaxed font-normal">
                No two celebrations share the same pulse. Standard catering forces compromise; Food Tailor tailors every course along 6 precise dimensions.
              </p>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-normal mb-8 max-w-xl">
                Whether you need 60% Nizami mutton dum biryani and 40% sanctified pure vegetarian Jain courses, or an interactive live chaat counter paired with single-origin craft chocolate, our system balances the table flawlessly.
              </p>

              <Link
                to="/build-menu"
                className="btn-primary"
              >
                <span>Tailor My Experience</span>
                <i className="bi bi-arrow-right text-xs" />
              </Link>
            </div>

            {/* Right Dimension Badges Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#173E23]">
                  <i className="bi bi-grid text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Cuisine Harmony</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">Mughlai, Irani, Andhra, Street Chaat & Artisanal Bakes.</p>
                </div>
              </div>

              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#C65518]">
                  <i className="bi bi-fire text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Taste & Spice Scale</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">Mild & delicate aromatics to fiery Rayalaseema heat.</p>
                </div>
              </div>

              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#173E23]">
                  <i className="bi bi-shield-check text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Dietary Preference</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">100% segregated Pure Veg, Jain, Halal, or All-inclusive.</p>
                </div>
              </div>

              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#C65518]">
                  <i className="bi bi-balloon text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Occasion Format</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">Formal seated banquet, high-tea lounge, or cocktail soiree.</p>
                </div>
              </div>

              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#173E23]">
                  <i className="bi bi-people text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Guest Count</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">Calibrated portions for 10 to 1,000+ banquet covers.</p>
                </div>
              </div>

              <div className="p-5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0] flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E5E5E0] flex items-center justify-center flex-shrink-0 text-[#C65518]">
                  <i className="bi bi-shop text-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#173E23]">Preferred Partners</h3>
                  <p className="text-xs text-[#1A1A1A]/75 mt-0.5 leading-relaxed">Direct dishes from 11 verified institutions on one bill.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — OCCASIONS                                        */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F2EFE6] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C65518] block mb-2">
              Tailored For Every Format
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173E23] tracking-tight">
              Curated Occasions
            </h2>
            <div className="w-16 h-0.5 bg-[#C65518] my-4 mx-auto" />
            <p className="font-sans text-sm sm:text-base text-[#1A1A1A]/80 font-normal">
              Select an occasion to explore pre-calibrated culinary line-ups and signature courses.
            </p>
          </div>

          {/* 8 Occasion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasionCards.map((occ) => (
              <Link
                key={occ.id}
                to={`/occasions/${occ.slug}`}
                className="bg-[#FAFAF8] p-6 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F2EFE6] border border-[#E5E5E0] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <i className={`bi ${occ.iconName} ${occ.colorClass} text-xl`} />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#173E23] group-hover:text-[#C65518] transition-colors mb-2">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal mb-4">
                    {occ.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E5E0] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#173E23] group-hover:text-[#C65518]">
                  <span>View Lineup</span>
                  <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — PARTNERS                                         */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FAFAF8] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C65518] block mb-2">
                The Approved Atelier Guild
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173E23] tracking-tight">
                Hyderabad&apos;s Culinary Icons
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#1A1A1A]/80 font-normal mt-2">
                Direct commissions with the city&apos;s officially verified heritage institutions. Zero ghost kitchens.
              </p>
            </div>

            <Link
              to="/partners"
              className="btn-primary"
            >
              <span>View All 11 Partners</span>
              <i className="bi bi-arrow-right text-xs" />
            </Link>
          </div>

          {/* Partner Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — WHY FOOD TAILOR                                  */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F2EFE6] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C65518] block mb-2">
              The Four Atelier Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173E23] tracking-tight">
              Why Food Tailor
            </h2>
            <div className="w-16 h-0.5 bg-[#C65518] my-4 mx-auto" />
            <p className="font-sans text-sm sm:text-base text-[#1A1A1A]/80 font-normal">
              Elevating gathering gastronomy beyond fragmented restaurant apps and rigid banquet packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1: CURATED */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#173E23]/10 flex items-center justify-center mb-5 text-[#173E23] group-hover:scale-105 transition-transform">
                <i className="bi bi-award text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STANDARD 01
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Curated
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Only selected culinary partners. Every kitchen is audited for banquet capacity, FSSAI hygiene, and authentic heritage provenance.
              </p>
            </div>

            {/* Feature 2: PERSONALIZED */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#C65518]/10 flex items-center justify-center mb-5 text-[#C65518] group-hover:scale-105 transition-transform">
                <i className="bi bi-sliders2 text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STANDARD 02
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Personalized
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Menus built around your moment. No locked bundles. Courses are balanced to your headcount, dietary splits, and taste preferences.
              </p>
            </div>

            {/* Feature 3: AUTHENTIC */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#173E23]/10 flex items-center justify-center mb-5 text-[#173E23] group-hover:scale-105 transition-transform">
                <i className="bi bi-patch-check text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STANDARD 03
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Authentic
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                Real culinary heritage. From Old City dum pots to artisanal West Godavari single-origin cacao. Original recipes your guests cherish.
              </p>
            </div>

            {/* Feature 4: EFFORTLESS */}
            <div className="bg-[#FAFAF8] p-7 rounded-2xl border border-[#E5E5E0] hover:border-[#173E23]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-[#C65518]/10 flex items-center justify-center mb-5 text-[#C65518] group-hover:scale-105 transition-transform">
                <i className="bi bi-clock-history text-2xl" />
              </div>
              <span className="text-xs font-mono font-bold text-[#C65518] tracking-widest uppercase mb-1">
                STANDARD 04
              </span>
              <h3 className="font-serif text-xl font-bold text-[#173E23] mb-2 leading-snug">
                Effortless
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-normal">
                One experience from discovery to celebration. Synchronized arrival from multiple kitchens, single consolidated payment, and dedicated concierge.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — FINAL CTA                                        */}
      {/* ============================================================ */}
      <section className="relative py-24 md:py-32 bg-[#173E23] text-white px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-4 border border-white/15">
            <i className="bi bi-gem text-[#C65518]" />
            <span>The Private Atelier Desk</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
            Let&apos;s tailor your next moment.
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#FAFAF8]/85 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Direct commissions from Hyderabad&apos;s premier culinary institutions, calibrated to your exact guest count and dietary harmony.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/build-menu"
              className="px-9 py-4 bg-[#C65518] hover:bg-[#A33E00] text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow-xl transition-all duration-200 flex items-center gap-2.5"
            >
              <span>Build My Menu</span>
              <i className="bi bi-arrow-right text-base" />
            </Link>

            <Link
              to="/partners"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-sm font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore Partners</span>
              <i className="bi bi-shop text-base" />
            </Link>
          </div>

          <span className="font-serif italic text-base sm:text-lg text-[#C65518] mt-8 block">
            Crafted for Hyderabad&apos;s finest gatherings
          </span>
        </div>
      </section>

    </div>
  );
}
