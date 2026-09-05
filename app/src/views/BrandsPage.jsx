'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/apiClient';
import PartnerCard from '../components/PartnerCard';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import ChefHatSketch from '../components/ui/svg/ChefHatSketch';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function BrandsPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPartners();
      setPartners(data.partners || data.data?.partners || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Failed to fetch partners', err);
      setError("We couldn't load the kitchens right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set(partners.map((p) => p.cuisine).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
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
  }, [partners, selectedCuisine, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Header (Section 20 requirement) */}
      <section className="bg-[#173E23] text-[#FDF9F2] pt-24 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#C55418]" />
            Official Culinary Guild
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white max-w-3xl leading-none">
            Hyderabad's Culinary Heritage, Curated For You.
          </h1>
          <PencilUnderline className="w-56 h-3 my-3" color="#C55418" />
          <p className="mt-2 text-[#FDF9F2]/80 text-sm sm:text-base max-w-2xl font-serif italic font-light leading-relaxed">
            Every culinary partner is an authenticated institution with verified Hyderabadi provenance, audited banquet kitchens, and uncompromising recipe fidelity.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2D8C6] shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7C6F5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search kitchen or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23] text-sm text-[#173E23]"
            />
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCuisine === cuisine
                    ? 'bg-[#173E23] text-white shadow-sm'
                    : 'bg-[#FDFBF7] text-[#595347] border border-[#E2D8C6] hover:bg-white'
                }`}
              >
                {cuisine === 'ALL' ? 'All Cuisines' : cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#595347]">
            Showing <strong>{filteredPartners.length}</strong> officially approved partner{filteredPartners.length === 1 ? '' : 's'}
          </p>
          <span className="text-xs text-[#7C6F5A] hidden sm:block font-serif italic">
            Zero ghost kitchens • 100% verified provenance
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
          <div className="p-8 bg-white rounded-2xl border border-red-200 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#173E23] mb-1">Could not load partners</h3>
            <p className="text-xs text-[#7C6F5A] mb-4">{error}</p>
            <button
              onClick={fetchPartners}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173E23] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPartners.length === 0 && (
          <div className="p-12 bg-white rounded-2xl border border-[#E2D8C6] text-center max-w-md mx-auto my-12 shadow-sm">
            <ChefHatSketch className="w-12 h-12 text-[#C55418] mx-auto mb-4" color="#C55418" />
            <h3 className="font-serif font-bold text-xl text-[#173E23] mb-2">No Matching Partners</h3>
            <p className="text-xs text-[#7C6F5A] mb-5">
              No approved kitchens match your filter. Try selecting a different cuisine or clearing your search.
            </p>
            <button
              onClick={() => {
                setSelectedCuisine('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-[#173E23] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Partner Grid */}
        {!loading && !error && filteredPartners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
