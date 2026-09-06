'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PartnerCard from '../components/PartnerCard';
import { ArrowRight, Sparkles, ShieldCheck, Clock, Users, Flame, Compass, UtensilsCrossed, Award, ChefHat, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [partners, setPartners] = useState([]);
  const [_loadingPartners, setLoadingPartners] = useState(true);

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

  const occasionCards = useMemo(
    () => [
      {
        id: 'birthday',
        slug: 'birthday-celebration',
        title: 'Birthday Celebration',
        description: 'Milestone moments with interactive live chaat, decadent dessert bars, and bespoke catering.',
        iconName: 'bi-cake2',
        color: '#C85419',
        badge: 'Top Pick',
      },
      {
        id: 'anniversary',
        slug: 'anniversary-evening',
        title: 'Anniversary Soirée',
        description: 'Intimate celebratory dining with royal Nizami slow-steamed courses and single-origin cacao.',
        iconName: 'bi-gem',
        color: '#0D381E',
        badge: 'Fine Dining',
      },
      {
        id: 'family',
        slug: 'family-gathering',
        title: 'Family Gathering',
        description: 'Generational comfort fare uniting grandparents, toddlers, and cousins around one lavish spread.',
        iconName: 'bi-people',
        color: '#0D381E',
        badge: 'Popular',
      },
      {
        id: 'corporate',
        slug: 'corporate-feast',
        title: 'Corporate Feast',
        description: 'Minute-accurate boardroom catering and executive galas backed by certified temperature logs.',
        iconName: 'bi-briefcase',
        color: '#0D381E',
        badge: 'Executive',
      },
      {
        id: 'romantic',
        slug: 'romantic-dinner',
        title: 'Intimate Degustation',
        description: 'Private candlelit residence dining featuring silver-vark delicacies and custom tasting courses.',
        iconName: 'bi-heart',
        color: '#C85419',
        badge: 'Bespoke',
      },
      {
        id: 'festival',
        slug: 'festival-celebration',
        title: 'Festive Banquet',
        description: 'Time-honored pure ghee sweets, sanctified kitchen segregation, and ceremonial holiday feasts.',
        iconName: 'bi-sun',
        color: '#C85419',
        badge: 'Heritage',
      },
      {
        id: 'weekend',
        slug: 'weekend-celebration',
        title: 'Weekend Party',
        description: 'High-energy house parties with live flaming charcoal skewers, crispy pastries, and craft coolers.',
        iconName: 'bi-music-note-beamed',
        color: '#0D381E',
        badge: 'Vibrant',
      },
      {
        id: 'custom',
        slug: 'custom-occasion',
        title: 'Custom Experience',
        description: 'Your unique vision, architected course-by-course with personalized pairings and dedicated concierge.',
        iconName: 'bi-compass',
        color: '#C85419',
        badge: 'Tailored',
      },
    ],
    []
  );

  const displayPartners = partners.length > 0 ? partners.slice(0, 6) : [
    {
      id: 'ptr_niloufer',
      slug: 'cafe-niloufer',
      businessName: 'Cafe Niloufer',
      cuisine: 'Irani & Bakery',
      location: 'Lakdikapul / Banjara Hills',
      description: "Since 1978, Cafe Niloufer has defined Hyderabad's quintessential Irani chai and bakery culture.",
      coverImageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
      established: 1978,
    },
    {
      id: 'ptr_shadab',
      slug: 'hotel-shadab',
      businessName: 'Hotel Shadab',
      cuisine: 'Hyderabadi & Mughlai',
      location: 'Ghansi Bazaar / Old City',
      description: 'Near the historic Charminar since 1953, producing legendary slow-cooked Nizami Mutton Dum Biryani.',
      coverImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
      established: 1953,
    },
    {
      id: 'ptr_samosasingh',
      slug: 'sammosa-singh',
      businessName: 'Sammosa Singh',
      cuisine: 'Appetizers & Chaat',
      location: 'Hitec City / Gachibowli',
      description: "Reinventing India's king of snacks with proprietary triangular pastries that stay crisp for 45+ minutes.",
      coverImageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
      established: 2016,
    },
    {
      id: 'ptr_manam',
      slug: 'manam-chocolate',
      businessName: 'Manam Chocolate',
      cuisine: 'Artisanal Confectionery',
      location: 'Road No. 12, Banjara Hills',
      description: 'Award-winning craft chocolate atelier transforming West Godavari cacao into single-origin bars.',
      coverImageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop',
      established: 2022,
    },
    {
      id: 'ptr_almondhouse',
      slug: 'almond-house',
      businessName: 'Almond House',
      cuisine: 'Royal Indian Sweets',
      location: 'Himayatnagar / Jubilee Hills',
      description: 'Master confectioners renowned for pure ghee Bisticks, Badam Halwa, and silver-vark Shahi Kaju Katli.',
      coverImageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop',
      established: 1989,
    },
    {
      id: 'ptr_iceberg',
      slug: 'ice-berg',
      businessName: 'Ice Berg',
      cuisine: 'Desserts & Ice Creams',
      location: 'Jubilee Hills / Madhapur',
      description: 'Organic handcrafted ice creams made with real seasonal fruits like Sitaphal and tender coconut.',
      coverImageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1200&auto=format&fit=crop',
      established: 2012,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-slate-900 selection:bg-[#C85419] selection:text-white overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                             */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-slate-950 text-white pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        {/* Cinematic Background Image & Lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-culinary-feast.jpg"
            alt="Royal Hyderabadi Culinary Banquet"
            className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
          />
          {/* Multi-layered Vignette & Brand Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/80" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-forest/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-brand-terracotta/25 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Hyderabad Atelier Guild • 11 Curated Masters</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 drop-shadow-lg">
            Your Favorite Food, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-200 via-white to-orange-200 bg-clip-text text-transparent">
              Tailored For Every Moment.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl mb-10 font-normal leading-relaxed drop-shadow-md">
            Discover Hyderabad&apos;s finest culinary heritage brands and orchestrate a synchronized multi-kitchen banquet calibrated to your guest count.
          </p>

          {/* Luxury Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
            <Link
              to="/partners"
              className="btn-accent w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2.5 group"
            >
              <span>Explore Master Kitchens</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/menus"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>View Curated Menus</span>
            </Link>
          </div>

          {/* Social Proof Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center text-xs font-medium text-slate-300 backdrop-blur-sm bg-black/20 px-6 py-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% FSSAI Audited</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-brand-terracotta" />
              <span>Minute-Accurate Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Zero Ghost Kitchens</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-brand-terracotta" />
              <span>Dedicated Concierge</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — HOW IT WORKS                                     */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
              The Four-Stage Curation
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
              How Food Tailor Works
            </h2>
            <div className="w-12 h-1 bg-[#C85419] rounded-full my-4 mx-auto" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              From initial guest intake to the final toast, we synchronize Hyderabad&apos;s culinary legends onto one seamless table.
            </p>
          </div>

          {/* 4-Step Illustrated Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* STEP 01 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-emerald-700/30 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <i className="bi bi-calendar-event text-2xl" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STEP 01
              </span>
              <h3 className="font-display text-lg font-bold text-[#0D381E] mb-2">
                Tell us your moment.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your occasion, date, venue location, and guest count. Whether an intimate dinner or a 500-guest gala.
              </p>
            </div>

            {/* STEP 02 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-brand-forest/30 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-forest flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-brand-forest tracking-widest uppercase mb-1">
                STEP 02
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Choose what you love.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specify spice tolerance, dietary splits (Pure Veg, Non-Veg, Jain), favorite cuisines, and iconic signature dishes.
              </p>
            </div>

            {/* STEP 03 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-brand-forest/30 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-terracotta flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-brand-terracotta tracking-widest uppercase mb-1">
                STEP 03
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                We tailor your feast.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our AI curation engine synthesizes a multi-course degustation from approved catalog dishes across vetted institutions.
              </p>
            </div>

            {/* STEP 04 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-brand-forest/30 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-forest flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-brand-forest tracking-widest uppercase mb-1">
                STEP 04
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Enjoy the moment.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Relax as our concierge orchestrates synchronized multi-brand delivery, thermal chafers, and audited banquet staging.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-forest hover:text-brand-terracotta transition-colors"
            >
              <span>Explore The Complete Curation Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — PERSONALIZATION & 6 DIMENSIONS                   */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
                Bespoke Dimensions
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight leading-tight mb-4">
                Food should fit the moment.
              </h2>
              <div className="w-12 h-1 bg-[#C85419] rounded-full mb-6" />

              <p className="text-base sm:text-lg text-slate-700 mb-4 leading-relaxed font-normal">
                No two celebrations share the same pulse. Standard catering forces compromise; Food Tailor tailors every course along 6 precise dimensions.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8 max-w-xl">
                Whether you need 60% Nizami mutton dum biryani and 40% sanctified pure vegetarian Jain courses, or an interactive live chaat counter paired with single-origin craft chocolate, our system balances the table flawlessly.
              </p>

              <Link to="/build-menu" className="btn-primary">
                <span>Tailor My Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right Dimension Badges Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Cuisine Harmony</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Mughlai, Irani, Andhra, Street Chaat & Artisanal Bakes.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Taste & Spice Scale</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Mild aromatics to fiery Rayalaseema heat levels.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Dietary Segregation</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">100% segregated Pure Veg, Jain, Halal, or All-inclusive.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Occasion Format</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Seated banquet, high-tea lounge, or cocktail soiree.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Guest Count Precision</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Calibrated portions for 10 to 1,000+ banquet covers.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0D381E]">Preferred Brands</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Dishes from 11 verified institutions on one single bill.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — CURATED OCCASIONS                                 */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
              Tailored For Every Format
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
              Curated Occasions
            </h2>
            <div className="w-12 h-1 bg-[#C85419] rounded-full my-4 mx-auto" />
            <p className="text-sm sm:text-base text-slate-600">
              Select an occasion to explore pre-calibrated culinary line-ups and signature courses.
            </p>
          </div>

          {/* 8 Occasion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasionCards.map((occ) => (
              <Link
                key={occ.id}
                to={`/occasions/${occ.slug}`}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-700/40 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className={`bi ${occ.iconName} text-xl`} style={{ color: occ.color }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {occ.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0D381E] group-hover:text-[#C85419] transition-colors mb-2">
                    {occ.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {occ.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0D381E] group-hover:text-[#C85419]">
                  <span>View Lineup</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — PARTNERS SHOWCASE                                */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
                The Approved Atelier Guild
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
                Hyderabad&apos;s Culinary Icons
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Direct commissions with the city&apos;s officially verified heritage institutions. Zero ghost kitchens.
              </p>
            </div>

            <Link to="/partners" className="btn-primary self-start md:self-auto">
              <span>View All 11 Partners</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
              The Four Atelier Standards
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
              Why Food Tailor
            </h2>
            <div className="w-12 h-1 bg-[#C85419] rounded-full my-4 mx-auto" />
            <p className="text-sm sm:text-base text-slate-600">
              Elevating gathering gastronomy beyond fragmented restaurant apps and rigid banquet packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: CURATED */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-emerald-700/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D381E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 01
              </span>
              <h3 className="font-display text-lg font-bold text-[#0D381E] mb-2">
                Curated
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Only selected culinary partners. Every kitchen is audited for banquet capacity, FSSAI hygiene, and authentic heritage provenance.
              </p>
            </div>

            {/* Feature 2: PERSONALIZED */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-emerald-700/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <i className="bi bi-sliders2 text-2xl" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 02
              </span>
              <h3 className="font-display text-lg font-bold text-[#0D381E] mb-2">
                Personalized
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menus built around your moment. No locked bundles. Courses are balanced to your headcount, dietary splits, and taste preferences.
              </p>
            </div>

            {/* Feature 3: AUTHENTIC */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-emerald-700/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D381E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 03
              </span>
              <h3 className="font-display text-lg font-bold text-[#0D381E] mb-2">
                Authentic
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Real culinary heritage. From Old City dum pots to artisanal single-origin chocolate. Original recipes your guests cherish.
              </p>
            </div>

            {/* Feature 4: EFFORTLESS */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-emerald-700/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 04
              </span>
              <h3 className="font-display text-lg font-bold text-[#0D381E] mb-2">
                Effortless
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                One experience from discovery to celebration. Synchronized arrival from multiple kitchens, single consolidated bill, and dedicated concierge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7 — FINAL CTA                                        */}
      {/* ============================================================ */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#0D381E] to-[#081810] text-white px-4 md:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#C85419]" />
            <span>The Private Atelier Desk</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Let&apos;s tailor your next moment.
          </h2>

          <p className="text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Direct commissions from Hyderabad&apos;s premier culinary institutions, calibrated to your exact guest count and dietary harmony.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/build-menu"
              className="px-9 py-4 bg-gradient-to-r from-[#C85419] to-[#D95D1E] hover:from-[#D95D1E] hover:to-[#E86624] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl shadow-orange-500/25 transition-all duration-200 flex items-center gap-2.5 active:scale-[0.98]"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/partners"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
            >
              <span>Explore Partners</span>
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
