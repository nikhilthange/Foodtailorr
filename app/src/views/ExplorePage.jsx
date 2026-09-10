'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PartnerCard from '../components/PartnerCard';
import FilterDropdown from '../components/ui/FilterDropdown';
import { api } from '../lib/apiClient';
import { FALLBACK_PARTNERS } from '../lib/fallbackData';
import { Search, X, SlidersHorizontal, Building2 } from 'lucide-react';

const CUISINE_OPTIONS = [
  { value: 'ALL', label: 'All Cuisines' },
  { value: 'Hyderabadi & Mughlai', label: 'Hyderabadi & Mughlai' },
  { value: 'Irani & Bakery', label: 'Irani & Bakery' },
  { value: 'Royal Indian Sweets', label: 'Royal Indian Sweets' },
  { value: 'Artisanal Confectionery', label: 'Artisanal Confectionery' },
  { value: 'Street Food & Chaat', label: 'Street Food & Chaat' },
  { value: 'Desserts & Ice Creams', label: 'Desserts & Ice Creams' },
  { value: 'Beverages & Shakes', label: 'Beverages & Shakes' },
  { value: 'Appetizers & Snacks', label: 'Appetizers & Snacks' },
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
  { value: 'featured', label: 'Featured' },
  { value: 'heritage', label: 'Oldest Heritage (Est.)' },
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
];

export default function ExplorePage() {
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
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
  if (selectedLocation !== 'ALL') {
    activeChips.push({ id: 'location', label: `Location: ${selectedLocation}`, clear: () => setSelectedLocation('ALL') });
  }

  const clearAllFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCuisine('ALL');
    setSelectedLocation('ALL');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Header */}
      <section className="bg-white pt-28 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
            Curated Restaurants
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Discover Partner Restaurants
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Order authentic specialties directly from Hyderabad&apos;s verified restaurants and bakeries for your next gathering.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs mb-8 flex flex-col gap-4">
          {/* Top Search Line */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search restaurants, signature dishes, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] rounded-lg border border-[#EAE5DC] focus:outline-none focus:border-[#0D2418] text-sm text-slate-900 placeholder-slate-400"
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
              className="lg:hidden px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-100"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C85419]" />
              <span>Filters</span>
              {activeChips.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C85419] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filter Dropdowns Row */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
            <FilterDropdown
              label="Cuisine"
              options={CUISINE_OPTIONS}
              value={selectedCuisine}
              onChange={setSelectedCuisine}
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
              <span className="text-xs font-semibold text-slate-400">Active:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-[#C85419] border border-[#FCD4BC]"
                >
                  <span>{chip.label}</span>
                  <button onClick={chip.clear} className="hover:text-red-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-semibold">{filteredPartners.length}</strong> partner restaurants
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0D2418] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-slate-500">Loading restaurants...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-10 text-center max-w-md mx-auto shadow-xs">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-slate-900 mb-1">No Restaurants Found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              We couldn&apos;t find any restaurants matching your current filter combination.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg bg-[#C85419] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-serif font-bold text-base text-slate-900">Filter Restaurants</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-lg text-xs font-medium text-slate-800"
                  >
                    {CUISINE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-lg text-xs font-medium text-slate-800"
                  >
                    {LOCATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded-lg text-xs font-medium text-slate-800"
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
                className="w-1/2 py-2.5 border border-[#EAE5DC] rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 bg-[#C85419] text-white rounded-lg text-xs font-semibold"
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
