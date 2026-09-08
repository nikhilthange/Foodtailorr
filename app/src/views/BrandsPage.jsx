'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/apiClient';
import { FALLBACK_PARTNERS } from '../lib/fallbackData';
import PartnerCard from '../components/PartnerCard';
import { Search, ChefHat, Sparkles, Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      
      {/* Luxury Porcelain Editorial Header */}
      <section className="relative bg-gradient-to-b from-white via-[#FCFBF7] to-[#F6F4EE] pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5DD] overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Official Culinary Guild • Verified Master Ateliers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl leading-tight">
            Hyderabad's Culinary Heritage, Curated For You
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Every culinary partner is an authenticated institution with verified Hyderabadi provenance, proven culinary mastery, and uncompromising recipe fidelity.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-card-soft mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search kitchen or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-forest text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCuisine === cuisine
                    ? 'bg-brand-forest text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
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
            Showing <strong className="text-slate-900 font-bold">{filteredPartners.length}</strong> verified partner kitchens
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            Direct kitchen allocation & temperature-controlled logistics
          </div>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Loading Partner Kitchens...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card-soft">
            <Building2 className="w-12 h-12 text-brand-terracotta mx-auto mb-3 opacity-80" />
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">No Kitchens Found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              No culinary houses match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCuisine('ALL');
                setSearchQuery('');
              }}
              className="btn-accent px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              Reset Search
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
    </div>
  );
}
