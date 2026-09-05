'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PartnerCard from '../components/PartnerCard';
import FilterDropdown from '../components/ui/FilterDropdown';
import { api } from '../lib/apiClient';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import ChefHatSketch from '../components/ui/svg/ChefHatSketch';
import { Search, X, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

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
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlled Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedOccasion, setSelectedOccasion] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search query input (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch partners from backend
  const loadPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPartners();
      const partnerList = res.partners || res.data?.partners || (Array.isArray(res) ? res : []);
      setPartners(partnerList);
    } catch (err) {
      console.error('Failed to load partners:', err);
      setError("We couldn't load the kitchens right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // Filter and sort partners
  const filteredPartners = useMemo(() => {
    return partners
      .filter((p) => {
        // Search filter
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

        // Cuisine filter
        if (selectedCuisine !== 'ALL') {
          if (!p.cuisine?.toLowerCase().includes(selectedCuisine.toLowerCase())) {
            return false;
          }
        }

        // Location filter
        if (selectedLocation !== 'ALL') {
          if (!p.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        // Category filter (checked against dishes or cuisine keywords)
        if (selectedCategory !== 'ALL') {
          const cat = selectedCategory.toLowerCase();
          const pText = `${p.cuisine} ${p.description} ${p.tagline}`.toLowerCase();
          if (cat === 'biryani' && !pText.includes('biryani') && !pText.includes('mughlai')) return false;
          if (cat === 'starters' && !pText.includes('snack') && !pText.includes('chaat') && !pText.includes('samosa')) return false;
          if (cat === 'desserts' && !pText.includes('dessert') && !pText.includes('sweet') && !pText.includes('cacao') && !pText.includes('chocolate') && !pText.includes('ice cream')) return false;
          if (cat === 'beverages' && !pText.includes('shake') && !pText.includes('chai') && !pText.includes('tea')) return false;
          if (cat === 'paan' && !pText.includes('paan')) return false;
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
        return 0; // featured default
      });
  }, [partners, debouncedSearch, selectedCuisine, selectedLocation, selectedCategory, sortBy]);

  // Active filters for removable chips
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
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Header */}
      <section className="bg-[#173E23] text-[#FDF9F2] pt-24 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#C55418]" />
            The Curation Hub
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white max-w-3xl leading-none">
            Discover Your Next Culinary Moment
          </h1>
          <PencilUnderline className="w-48 h-3 my-3" color="#C55418" />
          <p className="mt-2 text-[#FDF9F2]/80 text-sm sm:text-base max-w-2xl font-serif italic font-light leading-relaxed">
            Direct access to Hyderabad's 11 verified culinary institutions. Explore heirloom menus, kitchen heritage, and banquet specialties.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2D8C6] shadow-sm mb-6 flex flex-col gap-4">
          
          {/* Top Search Line */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7C6F5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search kitchens, experiences or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23] text-sm text-[#173E23] placeholder-[#7C6F5A]/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C6F5A] hover:text-[#173E23] p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-[#173E23] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C55418] text-white text-[10px] flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filter Dropdowns (Section 16 non-permanently expanded) */}
          <div className="hidden lg:flex items-center flex-wrap gap-3 pt-2 border-t border-[#F3EFE6]">
            <FilterDropdown
              label="Cuisine"
              value={selectedCuisine}
              options={CUISINE_OPTIONS}
              onChange={setSelectedCuisine}
            />

            <FilterDropdown
              label="Category"
              value={selectedCategory}
              options={CATEGORY_OPTIONS}
              onChange={setSelectedCategory}
            />

            <FilterDropdown
              label="Occasion"
              value={selectedOccasion}
              options={OCCASION_OPTIONS}
              onChange={setSelectedOccasion}
            />

            <FilterDropdown
              label="Location"
              value={selectedLocation}
              options={LOCATION_OPTIONS}
              onChange={setSelectedLocation}
            />

            <FilterDropdown
              label="Sort By"
              value={sortBy}
              options={SORT_OPTIONS}
              onChange={setSortBy}
            />

            {activeChips.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#C55418] hover:underline ml-auto"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-2">
              <span className="text-xs text-[#7C6F5A] font-medium mr-1">Active filters:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#173E23]/10 text-[#173E23] text-xs font-medium rounded-lg border border-[#173E23]/20"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.clear}
                    className="hover:text-red-700 p-0.5 rounded"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#595347]">
            Showing <strong>{filteredPartners.length}</strong> verified culinary atelier{filteredPartners.length === 1 ? '' : 's'}
          </p>
          <span className="text-xs text-[#7C6F5A] hidden sm:block">
            All partners verified for authentic Hyderabad provenance
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-[#EBE3D5]/50 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 bg-[#FAF6EF] rounded-2xl border border-red-200 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#173E23] mb-1">We couldn't load the kitchens right now.</h3>
            <p className="text-xs text-[#7C6F5A] mb-5 font-sans">{error}</p>
            <button
              onClick={loadPartners}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173E23] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00280f]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* No Results Empty State */}
        {!loading && !error && filteredPartners.length === 0 && (
          <div className="p-12 bg-white rounded-2xl border border-[#E2D8C6] text-center max-w-md mx-auto my-12 shadow-sm">
            <ChefHatSketch className="w-12 h-12 text-[#C55418] mx-auto mb-4" color="#C55418" />
            <h3 className="font-serif font-bold text-xl text-[#173E23] mb-2">No Matching Kitchens Found</h3>
            <p className="text-xs text-[#7C6F5A] mb-6 leading-relaxed">
              We couldn't find any culinary partners matching your current criteria. Try adjusting your search or clearing the active filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-[#C55418] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a33e00]"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Live Partner Grid */}
        {!loading && !error && filteredPartners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}

      </div>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FDFBF7] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl border-t border-[#E2D8C6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D8C6]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#173E23]" />
                <h3 className="font-serif font-bold text-lg text-[#173E23]">Filter Kitchens</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#EBE3D5] text-[#7C6F5A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuisine Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-2">Cuisine</label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full p-3 bg-white border border-[#E2D8C6] rounded-xl text-xs font-medium text-[#173E23]"
              >
                {CUISINE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-white border border-[#E2D8C6] rounded-xl text-xs font-medium text-[#173E23]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 bg-white border border-[#E2D8C6] rounded-xl text-xs font-medium text-[#173E23]"
              >
                {LOCATION_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#173E23] block mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 bg-white border border-[#E2D8C6] rounded-xl text-xs font-medium text-[#173E23]"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E2D8C6] flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#7C6F5A] border border-[#E2D8C6] rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#173E23] rounded-xl"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
