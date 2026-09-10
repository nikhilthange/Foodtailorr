'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PartnerCard from '../components/PartnerCard';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
  UtensilsCrossed,
  Award,
  CheckCircle2,
  Check,
  Sliders,
  Calendar,
  Sparkles,
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
        tagline: 'Interactive live counters and artisanal desserts.',
        description: 'Street chaat stations, rich chocolate gateaux, and savory appetizers crafted for celebration.',
        badge: 'Popular',
        guestRange: '15 – 100 Guests',
        image: '/occasions/birthday-celebration.jpg',
        sampleCourses: '6 Courses • Chaat • Gateaux',
        brands: 'Maharaja Chaat, Hotel Shadab, Manam',
      },
      {
        id: 'family',
        slug: 'family-gathering',
        title: 'Family Gathering',
        tagline: 'Generational comfort favorites for the whole family.',
        description: 'Authentic handi biryanis, pure ghee sweets, and segregated pure vegetarian courses.',
        badge: 'Family Favorite',
        guestRange: '12 – 80 Guests',
        image: '/occasions/family-gathering.jpg',
        sampleCourses: '8 Courses • Biryani • Sweets',
        brands: 'Hotel Shadab, Almond House, Samosa King',
      },
      {
        id: 'corporate',
        slug: 'corporate-feast',
        title: 'Corporate Feast',
        tagline: 'Professional executive catering and boardroom lunches.',
        description: 'Curated executive meal boxes, savory starters, and authentic Irani high-tea spreads.',
        badge: 'Corporate',
        guestRange: '20 – 100 Guests',
        image: '/occasions/corporate-feast.jpg',
        sampleCourses: 'Curated Boxes • High Tea',
        brands: 'Cafe Niloufer, Hotel Shadab, Karachi Bakery',
      },
      {
        id: 'anniversary',
        slug: 'anniversary-evening',
        title: 'Anniversary Soirée',
        tagline: 'Intimate fine dining with classic heritage recipes.',
        description: 'Slow-cooked Nizami delicacies, aromatic kebabs, and single-origin craft chocolate desserts.',
        badge: 'Fine Dining',
        guestRange: '10 – 50 Guests',
        image: '/occasions/anniversary-evening.jpg',
        sampleCourses: '7 Courses • Mughlai & Desserts',
        brands: 'Hotel Shadab, Manam Chocolate, Cafe Niloufer',
      },
      {
        id: 'festival',
        slug: 'festival-celebration',
        title: 'Festive Banquet',
        tagline: 'Traditional festive feasts with pure ghee specialties.',
        description: 'Celebratory handi curries, ceremonial pure ghee mithai, and dedicated Jain selections.',
        badge: 'Festive',
        guestRange: '20 – 100 Guests',
        image: '/occasions/festive-banquet.jpg',
        sampleCourses: 'Pure Veg / Jain Available',
        brands: 'Almond House, Maharaja Chaat, Hotel Shadab',
      },
      {
        id: 'weekend',
        slug: 'weekend-celebration',
        title: 'Weekend Party',
        tagline: 'Casual house party spreads with sliders and shakes.',
        description: 'Finger food platters, crispy cocktail appetizers, and organic fruit ice creams.',
        badge: 'Casual',
        guestRange: '15 – 60 Guests',
        image: '/occasions/weekend-party.jpg',
        sampleCourses: 'Cocktail Starters • Desserts',
        brands: 'Samosa King, Ice Berg, Cafe Niloufer',
      },
    ],
    []
  );

  const displayPartners = partners.length > 0 ? partners.slice(0, 6) : [
    {
      id: 'ptr_niloufer',
      slug: 'cafe-niloufer',
      businessName: 'Cafe Niloufer',
      cuisine: 'Irani Chai & Bakery',
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
      location: 'Old City / Near Charminar',
      description: 'Near historic Charminar since 1953, known for authentic slow-cooked Nizami Dum Biryani.',
      coverImageUrl: '/dishes/shadab-kaju-paneer-biryani.png',
      established: 1953,
    },
    {
      id: 'ptr_almondhouse',
      slug: 'almond-house',
      businessName: 'Almond House',
      cuisine: 'Royal Indian Sweets',
      location: 'Himayatnagar / Jubilee Hills',
      description: 'Master confectioners renowned for pure ghee mithai, badam halwa, and traditional sweets.',
      coverImageUrl: '/dishes/almond-house-mithai.jpg',
      established: 1989,
    },
    {
      id: 'ptr_manam',
      slug: 'manam-chocolate',
      businessName: 'Manam Chocolate',
      cuisine: 'Artisanal Confectionery',
      location: 'Banjara Hills',
      description: 'Award-winning craft chocolate maker transforming Indian cacao into single-origin bars.',
      coverImageUrl: '/dishes/manam-craft-truffles.jpg',
      established: 2022,
    },
    {
      id: 'ptr_samosasingh',
      slug: 'samosa-king',
      businessName: 'Samosa King',
      cuisine: 'Appetizers & Chaat',
      location: 'Hitec City / Gachibowli',
      description: 'Handcrafted cocktail samosas, crispy savory snacks, and freshly made dipping chutneys.',
      coverImageUrl: '/dishes/samosa-king-gourmet.jpg',
      established: 2016,
    },
    {
      id: 'ptr_iceberg',
      slug: 'ice-berg',
      businessName: 'Ice Berg',
      cuisine: 'Organic Ice Creams',
      location: 'Jubilee Hills / Madhapur',
      description: 'Handcrafted organic ice creams made with real seasonal fruits like Sitaphal and tender coconut.',
      coverImageUrl: '/dishes/ice-berg-gelato-cup.jpg',
      established: 2012,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#FAF8F5] text-slate-900 selection:bg-[#C85419] selection:text-white">
      {/* ============================================================ */}
      {/* SECTION 1 — CLEAN EDITORIAL HERO                             */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-[#0D2418] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Clean Background Visual with natural contrast */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-luxury-banquet.jpg"
            alt="Event Catering Spread"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D2418] via-[#0D2418]/60 to-[#0D2418]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-200 text-xs font-semibold tracking-wide mb-6">
            <span>Hyderabad&apos;s Iconic Restaurants • One Event Order</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6">
            Food from your favorite restaurants, <br className="hidden sm:inline" />
            tailored for your event.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200/95 max-w-2xl mb-8 leading-relaxed font-normal">
            Combine signature dishes from Cafe Niloufer, Hotel Shadab, Almond House, and more into one seamless, custom event menu.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm mb-12">
            <Link
              to="/build-menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-white text-sm font-semibold tracking-normal transition-all shadow-md"
            >
              <span>Build My Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/partners"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold tracking-normal border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Explore Restaurants</span>
            </Link>
          </div>

          {/* Trust Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10 w-full max-w-3xl text-left">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multiple restaurants on 1 bill</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict Veg & Non-Veg segregation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accurate per-guest portions</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Synchronized event delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — HOW IT WORKS (CLEAN 4 STEPS)                     */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How Food Tailor Works
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Order signature specialties across multiple iconic kitchens in a single, coordinated experience.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-[#C85419] mb-4 block">01</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Share Your Event
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your celebration type, date, delivery location, and guest count (from 10 to 100+ guests).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-[#C85419] mb-4 block">02</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Set Preferences
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specify dietary splits (Pure Veg, Non-Veg, Jain), spice level preference, and favorite food styles.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-[#C85419] mb-4 block">03</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Customize Menu
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pick and combine starters, handi biryanis, main curries, and desserts across top restaurants.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif font-bold text-[#C85419] mb-4 block">04</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  Enjoy Your Feast
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We handle kitchen coordination and ensure everything arrives fresh, on-time, and ready to serve.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D2418] hover:text-[#C85419] transition-colors"
            >
              <span>Learn more about how we coordinate orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — OCCASIONS                                        */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
                Event Inspirations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Curated for Every Occasion
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Explore pre-balanced menu templates designed for different event styles and guest groups.
              </p>
            </div>

            <Link
              to="/occasions"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D2418] hover:text-[#C85419] transition-colors self-start sm:self-end"
            >
              <span>View All Occasions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Occasion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasionCards.map((occ) => (
              <div
                key={occ.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#EAE5DC] hover:border-[#D1C9BC] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/95 text-slate-800 shadow-xs">
                      {occ.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white">
                      {occ.guestRange}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#C85419] transition-colors leading-snug mb-1">
                      {occ.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {occ.description}
                    </p>

                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                      <span className="font-semibold text-slate-700">Restaurants: </span>
                      {occ.brands}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/occasions/${occ.slug}`}
                      className="text-xs font-semibold text-slate-700 hover:text-[#C85419] transition-colors"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/build-menu?occasion=${encodeURIComponent(occ.id)}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0D2418] hover:bg-[#C85419] text-white text-xs font-semibold transition-colors"
                    >
                      Plan Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — RESTAURANT PARTNERS                              */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
                Curated Kitchens
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Hyderabad&apos;s Culinary Icons
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Order authentic specialties directly from the city&apos;s most celebrated heritage restaurants and artisan kitchens.
              </p>
            </div>

            <Link
              to="/partners"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D2418] hover:text-[#C85419] transition-colors self-start sm:self-end"
            >
              <span>View All Restaurants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — WHY FOOD TAILOR (VALUE PROPOSITIONS)             */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
              The Food Tailor Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Why Hosts Choose Food Tailor
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              We eliminate the stress of managing multiple catering vendors and bring city favorites directly to your event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1 */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-2">
                Multi-Kitchen Ordering
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order biryani from Shadab, chaat from Maharaja, and sweets from Almond House together in one unified checkout.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-2">
                Dietary Segregation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated packaging, labeling, and handling protocols for pure vegetarian and Jain dishes.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C85419] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-2">
                Exact Headcount Sizing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Portions calibrated exactly for your guest list so there is no food shortage or wasteful over-ordering.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE5DC] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 mb-2">
                Coordinated Timing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Courses from different kitchens arrive simultaneously, fresh, and temperature-controlled at your venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — CLEAN CTA BANNER                                 */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-[#0D2418] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to plan your event menu?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Tell us about your gathering, choose your favorite dishes, and let us take care of all the culinary logistics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/build-menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-white text-sm font-semibold tracking-normal transition-all shadow-md"
            >
              <span>Start Building Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold tracking-normal border border-white/20 transition-all"
            >
              <span>Browse All Dishes</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
