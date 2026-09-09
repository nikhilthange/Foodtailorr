'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, ShieldCheck, AlertCircle, ChefHat, Sparkles } from 'lucide-react';
import { getPartnerCoverImage, getDishImage } from '../lib/brandImageMap';

export default function PartnerDetailPage() {
  const { slug } = useParams();
  const [partner, setPartner] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPartnerProfile() {
      try {
        setLoading(true);
        setError(null);
        const [partnersRes, dishesRes] = await Promise.all([
          api.getPartners({ limit: 50 }).catch(() => ({ partners: [] })),
          api.getDishes({ limit: 100 }).catch(() => ({ dishes: [] })),
        ]);

        const allPartners = partnersRes.partners || partnersRes.data?.partners || (Array.isArray(partnersRes) ? partnersRes : []);
        const allDishes = dishesRes.dishes || dishesRes.data?.dishes || (Array.isArray(dishesRes) ? dishesRes : []);

        const matched = allPartners.find((p) => p.slug === slug || p.id === slug) || allPartners[0];

        if (isMounted) {
          setPartner(matched);
          if (matched) {
            const partnerDishes = allDishes.filter((d) => d.partnerId === matched.id || d.partnerName === matched.businessName);
            setDishes(partnerDishes);
          }
        }
      } catch (err) {
        console.error('Failed to load partner details:', err);
        if (isMounted) setError("We couldn't load this kitchen right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPartnerProfile();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const categories = useMemo(() => {
    const names = dishes
      .map((d) => (typeof d.category === 'object' ? d.category?.name : d.category))
      .filter(Boolean);
    return Array.from(new Set(names));
  }, [dishes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Loading Partner Atelier...</p>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mb-3" />
        <h2 className="font-serif font-bold text-xl text-slate-900 mb-1">Partner Notice</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'Kitchen not found in directory.'}</p>
        <Link
          to="/partners"
          className="btn-primary"
        >
          Return to Partners
        </Link>
      </div>
    );
  }

  const name = partner.businessName || partner.name;
  const heroImg = getPartnerCoverImage(partner);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      {/* Editorial Hero Banner */}
      <section className="relative h-[52vh] min-h-[420px] bg-slate-950 text-white flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={heroImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-50 brightness-85 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Partner Kitchens</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0D381E]/90 text-amber-200 border border-emerald-500/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Atelier Guild Member</span>
            </span>
            {partner.established && (
              <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/15">
                Est. {partner.established}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C85419] text-white shadow-sm">
              {partner.cuisine}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-3">
            {(partner.logoUrl || partner.slug === 'cafe-niloufer') && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-xl border border-white/40 flex items-center justify-center shrink-0">
                <img
                  src={partner.logoUrl || '/brands/cafe-niloufer.png'}
                  alt={name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                {name}
              </h1>
            </div>
          </div>

          {partner.tagline && (
            <p className="text-base sm:text-xl text-slate-200/90 max-w-2xl font-normal">
              &ldquo;{partner.tagline}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Heritage, Experience & Dishes */}
          <div className="lg:col-span-8 space-y-10">
            {/* Heritage & Provenance Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-card-soft">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C85419]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C85419] font-bold">
                  Heritage & Provenance
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#0D381E] mb-4">
                The Institution Story
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                {partner.description}
              </p>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0D381E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#0D381E]">Why We Curated This Partner</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {partner.whyWePicked || 'Unmatched culinary heritage, authentic preparation methods, and proven banquet execution consistency.'}
                  </p>
                </div>
              </div>

              {partner.location && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 text-[#C85419]" />
                  <span>{partner.location}</span>
                </div>
              )}
            </div>

            {/* Signature Dishes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-xl text-[#0D381E]">
                  Curated Catalog Creations
                </h3>
                <span className="text-xs text-slate-400">
                  {dishes.length} Verified Items
                </span>
              </div>

              {dishes.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-card-soft">
                  <ChefHat className="w-10 h-10 text-[#C85419] mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Catalog items for this partner are calibrated dynamically during menu builder synthesis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map((dish) => {
                    const dishImg = getDishImage(dish);
                    return (
                      <div
                        key={dish.id}
                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-[#0D381E]/40 hover:shadow-card-hover transition-all group"
                      >
                        <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                          <img
                            src={dishImg}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                              {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Specialty'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                dish.isVeg || dish.dietary === 'VEG' ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
                              }`}
                            >
                              {dish.isVeg || dish.dietary === 'VEG' ? 'Pure Veg' : 'Non-Veg'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-base text-slate-900 mb-1 group-hover:text-[#C85419] transition-colors">
                              {dish.name}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 font-normal">
                              {dish.description || 'Prepared with authentic spices and traditional craftsmanship.'}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Price Per Cover</span>
                            <span className="font-serif font-bold text-sm text-[#0D381E]">
                              ₹{dish.pricePerHead || 180}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: CTA Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-brand-forest sticky top-24 shadow-card-soft">
              <span className="text-xs uppercase tracking-widest text-brand-terracotta font-bold block mb-1">
                Atelier Commission
              </span>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mb-3">
                Build A Menu With {name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal mb-6">
                Commission dishes from {name} as the centerpiece or course pairing for your upcoming gathering. Synchronized with other heritage houses onto one seamless bill.
              </p>

              <div className="space-y-3 mb-6 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Cuisine</span>
                  <strong className="text-brand-forest">{partner.cuisine}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Dishes Available</span>
                  <strong className="text-brand-forest">{dishes.length} Verified Items</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Provenance</span>
                  <strong className="text-brand-forest">100% Authentic Hyderabad</strong>
                </div>
              </div>

              <Link
                to={`/build-menu?partner=${encodeURIComponent(partner.id)}`}
                className="btn-accent w-full py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2 group text-center"
              >
                <span>BUILD A MENU WITH THIS PARTNER</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
