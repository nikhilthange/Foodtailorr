'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PartnerCard from '../components/PartnerCard';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Users,
  Flame,
  Compass,
  UtensilsCrossed,
  Award,
  ChefHat,
  CheckCircle2,
  Star,
  Zap,
  Sliders,
} from 'lucide-react';

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
        tagline: 'Milestone moments with interactive live chaat & custom gateaux.',
        description: 'Milestone moments with interactive live chaat, decadent dessert bars, and bespoke catering.',
        badge: 'Top Pick',
        badgeColor: 'bg-amber-500/90 text-slate-950 border-amber-300/40',
        guestRange: '15 – 100 Guests',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: '6 Courses • Live Chaat • Gateaux',
        brands: 'Maharaja Chaat • Shadab • Chocolate Room',
        category: 'Celebration',
      },
      {
        id: 'anniversary',
        slug: 'anniversary-evening',
        title: 'Anniversary Soirée',
        tagline: 'Regal intimate dining with slow-simmered heritage courses.',
        description: 'Intimate celebratory dining with royal Nizami slow-steamed courses and single-origin cacao.',
        badge: 'Fine Dining',
        badgeColor: 'bg-emerald-800/90 text-emerald-100 border-emerald-400/30',
        guestRange: '10 – 100 Guests',
        image: 'https://images.unsplash.com/photo-1519225424562-b9034d6ce255?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: '7 Courses • Silver-Vark • Cacao',
        brands: 'Hotel Shadab • Manam • Niloufer',
        category: 'Fine Dining',
      },
      {
        id: 'family',
        slug: 'family-gathering',
        title: 'Family Gathering',
        tagline: 'Generational comfort fare uniting all palates around one spread.',
        description: 'Generational comfort fare uniting grandparents, toddlers, and cousins around one lavish spread.',
        badge: 'Popular',
        badgeColor: 'bg-orange-600/90 text-white border-orange-300/30',
        guestRange: '12 – 80 Guests',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: '8 Courses • Pure Ghee • Sweets',
        brands: 'Shadab • Almond House • Samosa King',
        category: 'Gathering',
      },
      {
        id: 'corporate',
        slug: 'corporate-feast',
        title: 'Corporate Feast',
        tagline: 'Refined boardroom catering and executive galas.',
        description: 'Refined boardroom catering and executive galas with freshly staged culinary setups.',
        badge: 'Executive',
        badgeColor: 'bg-slate-800/90 text-slate-100 border-white/20',
        guestRange: '20 – 100 Guests',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: 'Executive Boxes • Curated Menus',
        brands: 'Hotel Shadab • Niloufer • Karachi Bakery',
        category: 'Corporate',
      },
      {
        id: 'romantic',
        slug: 'romantic-dinner',
        title: 'Intimate Degustation',
        tagline: 'Private candlelit residence dining with silver-vark service.',
        description: 'Private candlelit residence dining featuring silver-vark delicacies and custom tasting courses.',
        badge: 'Bespoke',
        badgeColor: 'bg-rose-900/90 text-rose-100 border-rose-400/30',
        guestRange: '2 – 12 Guests',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: '5 Courses • Butler Pairing',
        brands: 'Hotel Shadab • Manam • Dimmy Pan',
        category: 'Fine Dining',
      },
      {
        id: 'festival',
        slug: 'festival-celebration',
        title: 'Festive Banquet',
        tagline: 'Ceremonial holiday feasts with pure ghee sweets.',
        description: 'Time-honored pure ghee sweets, traditional pure vegetarian options, and ceremonial holiday feasts.',
        badge: 'Heritage',
        badgeColor: 'bg-amber-600/90 text-white border-amber-300/30',
        guestRange: '20 – 100 Guests',
        image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: 'Pure Veg / Jain • Heritage Sweets',
        brands: 'Almond House • Shadab • Maharaja Chaat',
        category: 'Gathering',
      },
      {
        id: 'weekend',
        slug: 'weekend-celebration',
        title: 'Weekend Party',
        tagline: 'High-energy weekend bashes with live charcoal grills.',
        description: 'High-energy house parties with live flaming charcoal skewers, crispy pastries, and craft coolers.',
        badge: 'Vibrant',
        badgeColor: 'bg-emerald-700/90 text-white border-emerald-300/30',
        guestRange: '15 – 60 Guests',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: 'Skewers • Chaat • Mocktails',
        brands: 'Samosa King • Ice Berg • Shadab',
        category: 'Celebration',
      },
      {
        id: 'custom',
        slug: 'custom-occasion',
        title: 'Custom Experience',
        tagline: 'Your unique vision, architected course-by-course.',
        description: 'Your unique vision, architected course-by-course with personalized pairings and seamless coordination.',
        badge: 'Tailored',
        badgeColor: 'bg-[#C85419] text-white border-amber-300/40',
        guestRange: 'Bespoke Scale',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
        sampleCourses: 'Bespoke Menu • Multi-Kitchen Curation',
        brands: 'All Atelier Kitchens • Dedicated Staging',
        category: 'Bespoke',
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
      coverImageUrl: '/dishes/cafe-niloufer-chai-bun.jpg',
      established: 1978,
    },
    {
      id: 'ptr_shadab',
      slug: 'hotel-shadab',
      businessName: 'Hotel Shadab',
      cuisine: 'Hyderabadi & Mughlai',
      location: 'Ghansi Bazaar / Old City',
      description: 'Near the historic Charminar since 1953, producing legendary slow-cooked Nizami Mutton Dum Biryani.',
      coverImageUrl: '/dishes/shadab-kaju-paneer-biryani.png',
      established: 1953,
    },
    {
      id: 'ptr_samosasingh',
      slug: 'samosa-king',
      businessName: 'Samosa King',
      cuisine: 'Appetizers & Chaat',
      location: 'Hitec City / Gachibowli',
      description: "Reinventing India's favorite snack with golden handcrafted cocktail samosas and chutneys.",
      coverImageUrl: '/dishes/samosa-king-gourmet.jpg',
      established: 2016,
    },
    {
      id: 'ptr_manam',
      slug: 'manam-chocolate',
      businessName: 'Manam Chocolate',
      cuisine: 'Artisanal Confectionery',
      location: 'Road No. 12, Banjara Hills',
      description: 'Award-winning craft chocolate atelier transforming West Godavari cacao into single-origin bars.',
      coverImageUrl: '/dishes/manam-craft-truffles.jpg',
      established: 2022,
    },
    {
      id: 'ptr_almondhouse',
      slug: 'almond-house',
      businessName: 'Almond House',
      cuisine: 'Royal Indian Sweets',
      location: 'Himayatnagar / Jubilee Hills',
      description: 'Master confectioners renowned for pure ghee Gulab Jamun, Badam Halwa, and royal mithai.',
      coverImageUrl: '/dishes/almond-house-mithai.jpg',
      established: 1989,
    },
    {
      id: 'ptr_iceberg',
      slug: 'ice-berg',
      businessName: 'Ice Berg',
      cuisine: 'Desserts & Ice Creams',
      location: 'Jubilee Hills / Madhapur',
      description: 'Organic handcrafted ice creams made with real seasonal fruits like Sitaphal and tender coconut.',
      coverImageUrl: '/dishes/ice-berg-gelato-cup.jpg',
      established: 2012,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAF8F5] text-slate-900 selection:bg-[#C85419] selection:text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/* SECTION 1 — HERO                                             */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center bg-[#07190F] text-white pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        {/* Luxury Atmospheric Banquet Visual & Elegant Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-luxury-banquet.jpg"
            alt="Bespoke Luxury Fine-Dining Banquet"
            className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.05] scale-100"
          />
          {/* Subtle cinematic gradient overlays for pristine text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07190F] via-[#07190F]/45 to-[#07190F]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(7,25,15,0.75)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/25 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C85419]" />
            <span>Hyderabad Atelier Guild • Curated Heritage Masters</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6 drop-shadow-lg">
            Your Favorite Food, <br className="hidden sm:block" />
            <span className="text-amber-100">
              Tailored For Every Moment.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl mb-10 font-normal leading-relaxed drop-shadow-md">
            Discover Hyderabad&apos;s finest culinary heritage brands and orchestrate a synchronized multi-kitchen banquet calibrated to your guest count.
          </p>

          {/* Luxury Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              to="/build-menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#C85419] hover:bg-[#A33E00] text-white text-sm font-bold tracking-wide shadow-xl shadow-black/30 border border-amber-400/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/partners"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold tracking-wide backdrop-blur-md border border-white/25 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Explore Partners</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — HOW IT WORKS (FOUR-STAGE CURATION)                */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F6F4EE] border-b border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
              The Four-Stage Curation
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
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
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-emerald-700/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <i className="bi bi-calendar-event text-2xl" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STEP 01
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0D381E] mb-2">
                Tell us your moment.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your occasion, date, venue location, and guest count. Whether an intimate dinner or a 100-guest banquet.
              </p>
            </div>

            {/* STEP 02 */}
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-emerald-700/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-800 tracking-widest uppercase mb-1">
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
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-emerald-700/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
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
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-emerald-700/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-800 tracking-widest uppercase mb-1">
                STEP 04
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Enjoy the moment.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Relax as we coordinate multi-brand delivery and elegant banquet staging right to your table.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 hover:text-[#C85419] transition-colors"
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
      <section className="py-20 md:py-28 bg-[#FCFBF7] border-b border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
                Bespoke Dimensions
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight leading-tight mb-4">
                Food should fit the moment.
              </h2>
              <div className="w-12 h-1 bg-[#C85419] rounded-full mb-6" />

              <p className="text-base sm:text-lg text-slate-700 mb-4 leading-relaxed font-normal">
                No two celebrations share the same pulse. Standard catering forces compromise; Food Tailor tailors every course along 6 precise dimensions.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8 max-w-xl">
                Whether you need Nizami mutton dum biryani alongside pure vegetarian Jain courses, or an interactive live chaat counter paired with artisanal desserts, our system balances the table flawlessly.
              </p>

              <Link to="/build-menu" className="btn-primary">
                <span>Tailor My Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right Dimension Badges Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Cuisine Harmony</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Mughlai, Irani, Andhra, Street Chaat & Artisanal Bakes.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Taste & Spice Scale</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Mild aromatics to fiery Rayalaseema heat levels.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Dietary Preferences</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Thoughtful options for Pure Veg, Jain, Halal, or All-inclusive.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Occasion Format</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Seated banquet, high-tea lounge, or cocktail soiree.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-[#0D381E] shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Guest Count Precision</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Calibrated portions for 10 to 100 banquet covers.</p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EDE8DF] flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#C85419] shadow-xs">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0D381E]">Preferred Brands</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Dishes from multiple verified institutions on one single bill.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — OCCASIONS                                        */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FCFBF7] border-b border-[#E8E5DD] relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85419]/10 text-[#C85419] border border-[#C85419]/20 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C85419]" />
                <span>Bespoke Banqueting Formats</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
                Curated Occasions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed font-normal">
                Every gathering has its own tempo. Explore calibrated multi-brand lineups engineered for Hyderabad&apos;s most cherished milestones.
              </p>
            </div>

            <Link
              to="/occasions"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D381E] hover:text-[#C85419] transition-colors self-start md:self-end pb-1"
            >
              <span>View All Occasion Folios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 8 Luxury Occasion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasionCards.map((occ) => (
              <div
                key={occ.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#EDE8DF] hover:border-amber-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Visual Header Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Top Badges: Category Tag & Guest Scale */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${occ.badgeColor}`}>
                      {occ.badge}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/15">
                      <Users className="w-3 h-3 text-amber-300" />
                      <span>{occ.guestRange}</span>
                    </span>
                  </div>

                  {/* Bottom Lineup Indicator */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-amber-200/90 font-medium">
                    <span className="truncate drop-shadow-sm">{occ.sampleCourses}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#C85419] transition-colors leading-tight mb-2">
                      {occ.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 font-normal">
                      {occ.description}
                    </p>

                    {/* Curated Brand Roster Tag */}
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8DF] mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
                        Featured Guild Partners
                      </span>
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {occ.brands}
                      </p>
                    </div>
                  </div>

                  {/* Action Link Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/occasions/${occ.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#0D381E] hover:text-[#C85419] transition-colors flex items-center gap-1"
                    >
                      <span>Explore Folio</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to={`/build-menu?occasion=${encodeURIComponent(occ.id)}`}
                      className="px-3 py-1.5 rounded-xl bg-[#0D381E] hover:bg-[#C85419] text-white text-[11px] font-bold tracking-wide uppercase transition-all shadow-xs"
                    >
                      <span>Tailor Feast</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — HERITAGE INSTITUTIONS                            */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#FCFBF7] border-b border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
                The Verified Atelier Guild
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
                Hyderabad&apos;s Culinary Icons
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
                Direct selections from the city&apos;s verified heritage institutions and iconic local kitchens.
              </p>
            </div>

            <Link
              to="/partners"
              className="btn-primary shrink-0"
            >
              <span>View All {partners.length > 0 ? `${partners.length} ` : ''}Partners</span>
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
      {/* SECTION 6 — WHY FOOD TAILOR (ATELIER STANDARDS)              */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-[#F6F4EE] border-b border-[#E8E5DD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-2">
              Four Atelier Commitments
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0D381E] tracking-tight">
              Why Food Tailor
            </h2>
            <div className="w-12 h-1 bg-[#C85419] rounded-full my-4 mx-auto" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Elevating gathering gastronomy beyond fragmented food delivery and rigid banquet halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard 01 */}
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-[#0D381E]/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D381E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 01
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Curated Provenance
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Only authenticated culinary houses. Every kitchen is selected for signature flavor, preparation standards, and heritage recipe fidelity.
              </p>
            </div>

            {/* Standard 02 */}
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-[#0D381E]/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Sliders className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 02
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Personalized Balancing
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No rigid packages. Courses are balanced to your headcount, dietary preferences (Pure Veg, Jain, Halal), and course pacing.
              </p>
            </div>

            {/* Standard 03 */}
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-[#0D381E]/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D381E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 03
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Dietary Segregation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thoughtful separation and dedicated packaging for pure vegetarian and Jain guest preferences.
              </p>
            </div>

            {/* Standard 04 */}
            <div className="bg-white p-7 rounded-2xl border border-[#EDE8DF] hover:border-[#0D381E]/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#C85419] tracking-widest uppercase mb-1">
                STANDARD 04
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Seamless Staging
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Synchronized simultaneous arrival from multiple kitchens, consolidated invoicing, and end-to-end event support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


