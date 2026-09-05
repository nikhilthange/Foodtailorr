'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import { BiryaniBowlSketch, SamosaSketch, ClocheSketch } from '../components/ui/svg/FoodSketches';
import { Search, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Courses', value: 'ALL' },
  { label: 'Starters & Chaat', value: 'Starter' },
  { label: 'Royal Biryani', value: 'Biryani' },
  { label: 'Mains & Curries', value: 'Main' },
  { label: 'Desserts & Mithai', value: 'Dessert' },
  { label: 'Beverages & Shakes', value: 'Beverage' },
  { label: 'Royal Paan', value: 'Paan' },
];

export default function MenusPage() {
  const [dishes, setDishes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

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

        setDishes(rawDishes);
        setPartners(rawPartners);
      } catch (err) {
        console.error('Failed to load menu catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Partner lookup dictionary
  const partnerMap = useMemo(() => {
    const map = {};
    for (const p of partners) {
      map[p.id] = p.businessName;
    }
    return map;
  }, [partners]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      // Search query
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase().trim();
        const pName = (d.partnerName || partnerMap[d.partnerId] || '').toLowerCase();
        const matches =
          d.name?.toLowerCase().includes(s) ||
          d.description?.toLowerCase().includes(s) ||
          d.category?.toLowerCase().includes(s) ||
          pName.includes(s);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        const cat = d.category?.toLowerCase() || '';
        const target = selectedCategory.toLowerCase();
        if (target === 'starter' && !cat.includes('starter') && !cat.includes('snack') && !cat.includes('appetizer')) return false;
        if (target === 'biryani' && !cat.includes('biryani')) return false;
        if (target === 'main' && !cat.includes('main') && !cat.includes('curry')) return false;
        if (target === 'dessert' && !cat.includes('dessert') && !cat.includes('sweet') && !cat.includes('confectionery')) return false;
        if (target === 'beverage' && !cat.includes('beverage') && !cat.includes('shake') && !cat.includes('tea') && !cat.includes('chai')) return false;
        if (target === 'paan' && !cat.includes('paan')) return false;
      }

      // Diet filter
      if (selectedDiet === 'VEG' && !d.isVeg) return false;
      if (selectedDiet === 'NON_VEG' && d.isVeg) return false;

      // Partner filter
      if (selectedPartner !== 'ALL') {
        const pName = d.partnerName || partnerMap[d.partnerId] || '';
        if (pName.toLowerCase() !== selectedPartner.toLowerCase()) return false;
      }

      return true;
    });
  }, [dishes, searchQuery, selectedCategory, selectedDiet, selectedPartner, partnerMap]);

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Header */}
      <section className="bg-[#173E23] text-[#FDF9F2] pt-24 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#C55418]" />
            Curated Atelier Catalog
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white max-w-3xl leading-none">
            Menus Tailored Around Your Moment
          </h1>
          <PencilUnderline className="w-56 h-3 my-3" color="#C55418" />
          <p className="mt-2 text-[#FDF9F2]/80 text-sm sm:text-base max-w-2xl font-serif italic font-light leading-relaxed">
            Every dish is an authenticated heirloom creation from Hyderabad's verified culinary institutions, portioned and staged for celebratory banquets.
          </p>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Curated Collections Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="p-6 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] flex items-start gap-4 shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#173E23]/10 flex items-center justify-center flex-shrink-0 text-[#173E23] group-hover:scale-110 transition-transform">
              <BiryaniBowlSketch className="w-7 h-7" color="#173E23" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-1">
                Signature Collection
              </span>
              <h3 className="font-serif font-bold text-lg text-[#173E23]">Royal Nizami Dum Feast</h3>
              <p className="text-xs text-[#7C6F5A] mt-1 leading-relaxed">
                Slow-steamed mutton dum biryanis, midnight-simmered Haleem, and heirloom saffron breads.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] flex items-start gap-4 shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#C55418]/10 flex items-center justify-center flex-shrink-0 text-[#C55418] group-hover:scale-110 transition-transform">
              <SamosaSketch className="w-7 h-7" color="#C55418" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-1">
                Cocktail Soiree
              </span>
              <h3 className="font-serif font-bold text-lg text-[#173E23]">Live Street Chaat Theatre</h3>
              <p className="text-xs text-[#7C6F5A] mt-1 leading-relaxed">
                Interactive Dahi Puri, crispy gourmet triangular pastries, and savory appetizers for cocktail hours.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] flex items-start gap-4 shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#173E23]/10 flex items-center justify-center flex-shrink-0 text-[#173E23] group-hover:scale-110 transition-transform">
              <ClocheSketch className="w-7 h-7" color="#173E23" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-1">
                Confectionery Atelier
              </span>
              <h3 className="font-serif font-bold text-lg text-[#173E23]">High-Cacao & Pure Ghee</h3>
              <p className="text-xs text-[#7C6F5A] mt-1 leading-relaxed">
                Single-origin West Godavari cacao bonbons, pure ghee Bisticks, and live granite rolled scoops.
              </p>
            </div>
          </div>

        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2D8C6] shadow-sm mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#7C6F5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish name or partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23] text-sm text-[#173E23]"
              />
            </div>

            {/* Partner Filter */}
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="p-2.5 bg-[#FDFBF7] border border-[#E2D8C6] rounded-xl text-xs font-semibold text-[#173E23] w-full md:w-auto focus:outline-none focus:border-[#173E23]"
            >
              <option value="ALL">All Culinary Houses</option>
              {partners.map((p) => (
                <option key={p.id} value={p.businessName}>
                  {p.businessName}
                </option>
              ))}
            </select>

            {/* Diet Segment Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FDFBF7] border border-[#E2D8C6] rounded-xl w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setSelectedDiet('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedDiet === 'ALL' ? 'bg-[#173E23] text-white shadow-sm' : 'text-[#7C6F5A] hover:text-[#173E23]'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setSelectedDiet('VEG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedDiet === 'VEG' ? 'bg-emerald-700 text-white shadow-sm' : 'text-[#7C6F5A] hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Pure Veg
              </button>
              <button
                onClick={() => setSelectedDiet('NON_VEG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedDiet === 'NON_VEG' ? 'bg-[#C55418] text-white shadow-sm' : 'text-[#7C6F5A] hover:text-[#C55418]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Course Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#F3EFE6]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#173E23] text-white shadow-sm'
                    : 'bg-[#FDFBF7] text-[#595347] border border-[#E2D8C6] hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#595347]">
            Showing <strong>{filteredDishes.length}</strong> authenticated dish{filteredDishes.length === 1 ? '' : 'es'}
          </p>
          <Link
            to="/build-menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C55418] hover:underline"
          >
            <span>Launch Menu Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-[#EBE3D5]/50 animate-pulse" />
            ))}
          </div>
        )}

        {/* Dishes Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => {
              const partnerName = dish.partnerName || partnerMap[dish.partnerId] || 'Partner Atelier';
              return (
                <div
                  key={dish.id}
                  className="sketch-card p-5 rounded-2xl flex flex-col justify-between group hover:border-[#173E23]/40 shadow-sm"
                >
                  <div>
                    {/* Top Row: Partner and Diet indicator */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#C55418] truncate">
                        {partnerName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          dish.isVeg
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Dish Name */}
                    <h3 className="font-serif font-bold text-lg text-[#173E23] group-hover:text-[#C55418] transition-colors leading-tight mb-2">
                      {dish.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#4A453A] leading-relaxed line-clamp-2 mb-4 font-light">
                      {dish.description || 'Authentic heirloom preparation cooked according to traditional Hyderabadi recipes.'}
                    </p>
                  </div>

                  {/* Pricing & Course Metadata (No raw IDs / internal fields) */}
                  <div className="pt-3 border-t border-[#EBE3D5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#7C6F5A] block">
                        Price Per Cover
                      </span>
                      <span className="font-serif font-bold text-base text-[#173E23]">
                        ₹{dish.pricePerHead || dish.price || 180}
                      </span>
                    </div>

                    <span className="px-2.5 py-1 bg-[#173E23]/5 text-[#173E23] rounded-lg text-xs font-semibold">
                      {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Specialty'}
                    </span>
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
