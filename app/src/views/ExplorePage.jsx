'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PartnerCard from '../components/PartnerCard';
import FilterDropdown from '../components/ui/FilterDropdown';
import { api } from '../lib/apiClient';
import { FALLBACK_PARTNERS } from '../lib/fallbackData';
import { Search, X, SlidersHorizontal, RefreshCw, AlertCircle, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

const CUISINE_OPTIONS = [
  { value: 'ALL', label: 'All Cuisines' },
  { value: 'Hyderabadi & Mughlai', label: 'Hyderabadi & Mughlai' },
  { value: 'Irani & Bakery', label: 'Irani & Bakery' },
  { value: 'Royal Indian Sweets', label: 'Royal Indian Sweets' },
  { value: 'Artisanal Confectionery', label: 'Artisanal Confectionery' },
  { value: 'Street Food & Chaat', label: 'Street Food & Chaat' },
  { value: 'Desserts & Ice Creams', label: 'Desserts & Ice Creams' },
  { value: 'Beverages & Shakes', label: 'Beverages & Shakes' },
  { value: 'Paan & After-Mints', label: 'Paan & After-Mints' },
  { value: 'Appetizers & Snacks', label: 'Appetizers & Snacks' },
];

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'Biryani', label: 'Dum Biryani' },
  { value: 'Starters', label: 'Artisanal Starters' },
  { value: 'Mains', label: 'Royal Mains' },
  { value: 'Desserts', label: 'Heritage Desserts' },
  { value: 'Beverages', label: 'Shakes & Chai' },
  { value: 'Paan', label: 'Royal Paan' },
];

const OCCASION_OPTIONS = [
  { value: 'ALL', label: 'All Occasions' },
  { value: 'Wedding', label: 'Weddings & Banquets' },
  { value: 'Birthday', label: 'Milestone Birthdays' },
  { value: 'Family', label: 'Family Gatherings' },
  { value: 'Corporate', label: 'Corporate Dining' },
  { value: 'Cocktail', label: 'Cocktail Soirees' },
  { value: 'Festival', label: 'Festive Feasts' },
];

const LOCATION_OPTIONS = [
  { value: 'ALL', label: 'All Locations' },
  { value: 'Banjara Hills', label: 'Banjara Hills' },
  { value: 'Jubilee Hills', label: 'Jubilee Hills' },
  { value: 'Old City', label: 'Old City / Charminar' },
  { value: 'Hitec City', label: 'Hitec City' },
  { value: 'Madhapur', label: 'Madhapur' },
  { value: 'Lakdikapul', label: 'Lakdikapul' },
  { value: 'Himayatnagar', label: 'Himayatnagar' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Masters' },
  { value: 'heritage', label: 'Oldest Heritage (Est.)' },
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
];

export default function ExplorePage() {
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedOccasion, setSelectedOccasion] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPartners();
      const partnerList = res.partners || res.data?.partners || (Array.isArray(res) ? res : []);
      if (partnerList && partnerList.length > 0) {
        setPartners(partnerList);
      } else {
        setPartners(FALLBACK_PARTNERS);
      }
    } catch {
      setPartners(FALLBACK_PARTNERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const filteredPartners = useMemo(() => {
    const list = (partners && partners.length > 0) ? partners : FALLBACK_PARTNERS;
    return list
      .filter((p) => {
        if (debouncedSearch.trim()) {
          const s = debouncedSearch.toLowerCase().trim();
          const matches =
            p.businessName?.toLowerCase().includes(s) ||
            p.cuisine?.toLowerCase().includes(s) ||
            p.location?.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.tagline?.toLowerCase().includes(s);
          if (!matches) return false;
        }

        if (selectedCuisine !== 'ALL') {
          if (!p.cuisine?.toLowerCase().includes(selectedCuisine.toLowerCase())) {
            return false;
          }
        }

        if (selectedLocation !== 'ALL') {
          if (!p.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.businessName || '').localeCompare(b.businessName || '');
        }
        if (sortBy === 'name-desc') {
          return (b.businessName || '').localeCompare(a.businessName || '');
        }
        if (sortBy === 'heritage') {
          return (a.established || 9999) - (b.established || 9999);
        }
        return 0;
      });
  }, [partners, debouncedSearch, selectedCuisine, selectedLocation, sortBy]);

  const activeChips = [];
  if (debouncedSearch.trim()) {
    activeChips.push({ id: 'search', label: `Search: "${debouncedSearch.trim()}"`, clear: () => setSearchQuery('') });
  }
  if (selectedCuisine !== 'ALL') {
    activeChips.push({ id: 'cuisine', label: `Cuisine: ${selectedCuisine}`, clear: () => setSelectedCuisine('ALL') });
  }
  if (selectedCategory !== 'ALL') {
    activeChips.push({ id: 'category', label: `Category: ${selectedCategory}`, clear: () => setSelectedCategory('ALL') });
  }
  if (selectedOccasion !== 'ALL') {
    activeChips.push({ id: 'occasion', label: `Occasion: ${selectedOccasion}`, clear: () => setSelectedOccasion('ALL') });
  }
  if (selectedLocation !== 'ALL') {
    activeChips.push({ id: 'location', label: `Location: ${selectedLocation}`, clear: () => setSelectedLocation('ALL') });
  }

  const clearAllFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCuisine('ALL');
    setSelectedCategory('ALL');
    setSelectedOccasion('ALL');
    setSelectedLocation('ALL');
    setSortBy('featured');
  };

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
            <span>The Curation Hub • Hyderabad Atelier Guild</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl leading-tight">
            Discover Your Next Culinary Moment
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Direct access to Hyderabad&apos;s verified culinary institutions. Explore heirloom menus, kitchen heritage, and banquet specialties.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EDE8DF] shadow-sm mb-8 flex flex-col gap-4">
          {/* Top Search Line */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search kitchens, signature dishes or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-50/80 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-forest text-sm text-slate-900 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Drawer Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-100"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-terracotta" />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-terracotta text-white text-[10px] font-bold flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filter Dropdowns Row */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap pt-1 border-t border-slate-100">
            <FilterDropdown
              label="Cuisine"
              options={CUISINE_OPTIONS}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
            />
            <FilterDropdown
              label="Category"
              options={CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <FilterDropdown
              label="Occasion"
              options={OCCASION_OPTIONS}
              value={selectedOccasion}
              onChange={setSelectedOccasion}
            />
            <FilterDropdown
              label="Location"
              options={LOCATION_OPTIONS}
              value={selectedLocation}
              onChange={setSelectedLocation}
            />

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort By:</span>
              <FilterDropdown
                label="Sort"
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-brand-terracotta border border-brand-terracotta/20"
                >
                  <span>{chip.label}</span>
                  <button onClick={chip.clear} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{filteredPartners.length}</strong> verified culinary ateliers
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            All partners verified for authentic Hyderabad provenance
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Curating Ateliers...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card-soft">
            <Building2 className="w-12 h-12 text-brand-terracotta mx-auto mb-3 opacity-80" />
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">No Matching Ateliers Found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn't locate any kitchens matching your active filter combination. Try clearing some filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="btn-accent px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id || partner.slug} partner={partner} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-serif font-bold text-lg text-slate-900">Filter Kitchens</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {CUISINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Occasion</label>
                  <select
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {OCCASION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {LOCATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-accent w-1/2 py-2.5 rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
