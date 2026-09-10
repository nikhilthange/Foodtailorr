'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/apiClient';
import { FALLBACK_PARTNERS } from '../lib/fallbackData';
import PartnerCard from '../components/PartnerCard';
import { Search, Building2 } from 'lucide-react';

export default function BrandsPage() {
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await api.getPartners();
      const list = data.partners || data.data?.partners || (Array.isArray(data) ? data : []);
      if (list && list.length > 0) {
        setPartners(list);
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
    fetchPartners();
  }, []);

  const list = (partners && partners.length > 0) ? partners : FALLBACK_PARTNERS;

  const cuisines = useMemo(() => {
    const set = new Set(list.map((p) => p.cuisine).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [list]);

  const filteredPartners = useMemo(() => {
    return list.filter((p) => {
      const matchesCuisine = selectedCuisine === 'ALL' || p.cuisine === selectedCuisine;
      const s = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !s ||
        p.businessName?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.location?.toLowerCase().includes(s) ||
        p.cuisine?.toLowerCase().includes(s);
      return matchesCuisine && matchesSearch;
    });
  }, [list, selectedCuisine, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Header */}
      <section className="bg-white pt-28 pb-12 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-2">
            Verified Partner Restaurants
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Hyderabad&apos;s Culinary Heritage
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Order authentic specialties directly from the city&apos;s verified heritage restaurants and artisan kitchens for your special events.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search restaurant or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] rounded-lg border border-[#EAE5DC] focus:outline-none focus:border-[#0D2418] text-xs font-medium text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCuisine === cuisine
                    ? 'bg-[#0D2418] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-600 border border-[#EAE5DC] hover:text-slate-900'
                }`}
              >
                {cuisine === 'ALL' ? 'All Cuisines' : cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-semibold">{filteredPartners.length}</strong> verified partner restaurants
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
            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-slate-900 mb-1">No Restaurants Found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              No restaurants match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCuisine('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#C85419] text-white text-xs font-semibold"
            >
              Reset Search
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
    </div>
  );
}
