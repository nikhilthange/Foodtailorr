'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { FALLBACK_DISHES, FALLBACK_PARTNERS } from '../lib/fallbackData';
import { Search, ArrowRight, Utensils, Flame, Cake, Wine, Coffee, ChefHat } from 'lucide-react';
import { getDishImage } from '../lib/brandImageMap';

const CATEGORIES = [
  { label: 'All Courses', value: 'ALL', icon: Utensils },
  { label: 'Starters & Chaat', value: 'Starter', icon: Flame },
  { label: 'Biryani & Rice', value: 'Biryani', icon: ChefHat },
  { label: 'Main Curries', value: 'Main', icon: Utensils },
  { label: 'Desserts & Sweets', value: 'Dessert', icon: Cake },
  { label: 'Chai & Beverages', value: 'Beverage', icon: Wine },
  { label: 'Paan', value: 'Paan', icon: Coffee },
];

export default function MenusPage() {
  const [dishes, setDishes] = useState(FALLBACK_DISHES);
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [_loading, setLoading] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL'); // 'ALL', 'VEG', 'NON_VEG'
  const [selectedPartner, setSelectedPartner] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

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

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDiet, selectedPartner, searchQuery]);

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

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE) || 1;
  const paginatedDishes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDishes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDishes, currentPage]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Header */}
      <section className="bg-white pt-28 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
            Dishes & Specialties
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Menu Catalog
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Browse authentic dishes from top restaurants across Hyderabad, with transparent per-person pricing for your event.
          </p>
        </div>
      </section>

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs mb-8 space-y-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D2418] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-[#EAE5DC]'
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
                placeholder="Search dishes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] rounded-lg border border-[#EAE5DC] focus:outline-none focus:border-[#0D2418] text-xs font-medium text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Diet Filter */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-lg border border-[#EAE5DC] shrink-0">
              {['ALL', 'VEG', 'NON_VEG'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => setSelectedDiet(diet)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
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
              aria-label="Filter by Restaurant"
              className="px-3 py-2 bg-[#FAF8F5] border border-[#EAE5DC] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D2418] shrink-0 cursor-pointer"
            >
              <option value="ALL">All Restaurants</option>
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
            Showing <strong className="text-slate-900 font-semibold">{paginatedDishes.length}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{filteredDishes.length}</strong> items
          </span>
          <Link
            to="/build-menu"
            className="text-xs font-semibold text-[#C85419] hover:underline flex items-center gap-1"
          >
            <span>Start Building Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-10 text-center max-w-md mx-auto shadow-xs">
            <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-slate-900 mb-1">No Dishes Match Filters</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing some filter criteria to browse other dishes.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedDiet('ALL');
                setSelectedPartner('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#C85419] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDishes.map((dish) => {
                const pName = dish.partnerName || partnerMap[dish.partnerId] || 'Specialty Kitchen';
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl border border-[#EAE5DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#D1C9BC] flex flex-col justify-between transition-all duration-200 group"
                  >
                    {/* Dish Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={getDishImage(dish)}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                          {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Course'}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-xs ${
                            dish.isVeg
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-red-50 text-red-800 border border-red-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {dish.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      {/* Bottom Partner Tag */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                          {pName}
                        </span>
                      </div>
                    </div>

                    {/* Dish Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-slate-900 mb-1 group-hover:text-[#C85419] transition-colors leading-snug">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal mb-4">
                          {dish.description || 'Authentic preparation crafted with premium ingredients.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Per Person</span>
                          <span className="font-serif font-bold text-base text-[#0D2418]">
                            ₹{dish.pricePerHead || 180}
                          </span>
                        </div>

                        <Link
                          to={`/build-menu?dish=${encodeURIComponent(dish.id)}`}
                          className="px-3.5 py-1.5 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>Add to Menu</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-[#EAE5DC]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#EAE5DC] bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#0D2418] text-white shadow-xs'
                          : 'bg-white border border-[#EAE5DC] text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#EAE5DC] bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
