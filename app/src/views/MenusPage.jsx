'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { FALLBACK_DISHES, FALLBACK_PARTNERS } from '../lib/fallbackData';
import { Search, ArrowRight, Sparkles, Utensils, Flame, Cake, Wine, Coffee, ChefHat, Check } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Courses', value: 'ALL', icon: Utensils },
  { label: 'Starters & Chaat', value: 'Starter', icon: Flame },
  { label: 'Royal Biryani', value: 'Biryani', icon: ChefHat },
  { label: 'Mains & Curries', value: 'Main', icon: Utensils },
  { label: 'Desserts & Mithai', value: 'Dessert', icon: Cake },
  { label: 'Beverages & Shakes', value: 'Beverage', icon: Wine },
  { label: 'Royal Paan', value: 'Paan', icon: Coffee },
];

export default function MenusPage() {
  const [dishes, setDishes] = useState(FALLBACK_DISHES);
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL'); // 'ALL', 'VEG', 'NON_VEG'
  const [selectedPartner, setSelectedPartner] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const [dishesRes, partnersRes] = await Promise.all([
          api.getDishes({ limit: 100 }).catch(() => ({ dishes: [] })),
          api.getPartners({ limit: 50 }).catch(() => ({ partners: [] })),
        ]);

        const rawDishes = dishesRes.dishes || dishesRes.data?.dishes || (Array.isArray(dishesRes) ? dishesRes : []);
        const rawPartners = partnersRes.partners || partnersRes.data?.partners || (Array.isArray(partnersRes) ? partnersRes : []);

        if (rawDishes.length > 0) setDishes(rawDishes);
        else setDishes(FALLBACK_DISHES);

        if (rawPartners.length > 0) setPartners(rawPartners);
        else setPartners(FALLBACK_PARTNERS);
      } catch {
        setDishes(FALLBACK_DISHES);
        setPartners(FALLBACK_PARTNERS);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const partnerMap = useMemo(() => {
    const map = {};
    const list = (partners && partners.length > 0) ? partners : FALLBACK_PARTNERS;
    for (const p of list) {
      map[p.id] = p.businessName;
    }
    return map;
  }, [partners]);

  const filteredDishes = useMemo(() => {
    const list = (dishes && dishes.length > 0) ? dishes : FALLBACK_DISHES;
    return list.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          d.name?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.partnerName?.toLowerCase().includes(q) ||
          partnerMap[d.partnerId]?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedCategory !== 'ALL') {
        const cat = (typeof d.category === 'object' ? d.category?.name : d.category || '').toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (target === 'biryani' && !cat.includes('biryani') && !d.name.toLowerCase().includes('biryani')) return false;
        if (target === 'starter' && !cat.includes('starter') && !cat.includes('appetizer') && !cat.includes('chaat') && !cat.includes('snack')) return false;
        if (target === 'main' && !cat.includes('main') && !cat.includes('curry') && !cat.includes('gravy') && !cat.includes('bread') && !cat.includes('haleem')) return false;
        if (target === 'dessert' && !cat.includes('dessert') && !cat.includes('sweet') && !cat.includes('mithai') && !cat.includes('halwa') && !cat.includes('ice cream') && !cat.includes('chocolate')) return false;
        if (target === 'beverage' && !cat.includes('beverage') && !cat.includes('shake') && !cat.includes('tea') && !cat.includes('chai')) return false;
        if (target === 'paan' && !cat.includes('paan')) return false;
      }

      if (selectedDiet === 'VEG' && !d.isVeg) return false;
      if (selectedDiet === 'NON_VEG' && d.isVeg) return false;

      if (selectedPartner !== 'ALL') {
        const pName = d.partnerName || partnerMap[d.partnerId] || '';
        if (pName.toLowerCase() !== selectedPartner.toLowerCase()) return false;
      }

      return true;
    });
  }, [dishes, searchQuery, selectedCategory, selectedDiet, selectedPartner, partnerMap]);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      {/* Luxury Porcelain Editorial Header */}
      <section className="relative bg-gradient-to-b from-white via-[#FCFBF7] to-[#F6F4EE] pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5DD] overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Curated Atelier Catalog • Approved Banquet Repertoires</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl leading-tight">
            Menus Tailored Around Your Moment
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Every dish is an authenticated heirloom creation from Hyderabad&apos;s verified culinary institutions, portioned and staged for celebratory banquets.
          </p>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Curated Collections Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-white rounded-3xl border border-[#EDE8DF] flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0D381E] border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
                Signature Collection
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">Royal Nizami Dum Feast</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Slow-steamed mutton dum biryanis, midnight-simmered Haleem, and heirloom saffron breads.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#EDE8DF] flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#C85419] border border-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
                Cocktail Soiree
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">Artisanal Starters & Chaat</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Crispy 45-min cocktail samosas, live mineral water pani puri bars, and charcoal skewers.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#EDE8DF] flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C85419] border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-1">
                Grand Finale
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900">Desserts & Godavari Cacao</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                West Godavari bean-to-bar chocolate bonbons, pure ghee badam halwa, and silver-vark paan.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-card-soft mb-8 space-y-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#C85419] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Diet & Partner Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes or recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-forest text-xs font-medium text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Diet Filter */}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0">
              {['ALL', 'VEG', 'NON_VEG'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => setSelectedDiet(diet)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedDiet === diet
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {diet === 'ALL' ? 'All Diets' : diet === 'VEG' ? 'Pure Veg' : 'Non-Veg'}
                </button>
              ))}
            </div>

            {/* Partner Dropdown */}
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              aria-label="Filter by Partner Atelier"
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-forest shrink-0 cursor-pointer"
            >
              <option value="ALL">All Partner Ateliers</option>
              {partners.map((p) => (
                <option key={p.id} value={p.businessName}>
                  {p.businessName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filteredDishes.length}</strong> calibrated banquet courses
          </span>
          <Link
            to="/build-menu"
            className="text-xs font-bold uppercase tracking-wider text-brand-terracotta hover:underline flex items-center gap-1"
          >
            <span>Orchestrate Custom Degustation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card-soft">
            <Utensils className="w-10 h-10 text-brand-terracotta mx-auto mb-2 opacity-80" />
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">No Dishes Match Filter</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing some filter criteria to browse other courses.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedDiet('ALL');
                setSelectedPartner('ALL');
                setSearchQuery('');
              }}
              className="btn-accent px-4 py-2 rounded-xl text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => {
              const pName = dish.partnerName || partnerMap[dish.partnerId] || 'Specialty Atelier';
              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card-soft hover:shadow-card-hover hover:border-brand-forest/30 flex flex-col justify-between transition-all duration-300 group"
                >
                  {/* Dish Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dish.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/15">
                        {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Specialty'}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          dish.isVeg
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-red-500 text-white shadow-xs'
                        }`}
                      >
                        {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Bottom Partner Tag */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider drop-shadow-md">
                        {pName}
                      </span>
                    </div>
                  </div>

                  {/* Dish Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900 mb-1.5 group-hover:text-brand-terracotta transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal mb-4">
                        {dish.description || 'Authentic heirloom preparation with verified ingredients.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Price / Head</span>
                        <span className="font-serif font-bold text-base text-brand-forest">
                          ₹{dish.pricePerHead || 180}
                        </span>
                      </div>

                      <Link
                        to={`/build-menu?dish=${encodeURIComponent(dish.id)}`}
                        className="btn-accent px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-xs flex items-center gap-1"
                      >
                        <span>Include</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
