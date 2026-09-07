'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, ShieldCheck, AlertCircle, ChefHat, Sparkles } from 'lucide-react';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop';

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
  const heroImg = partner.coverImageUrl || partner.imageUrl || FALLBACK_HERO;

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      {/* Editorial Hero Banner */}
      <section className="relative h-[52vh] min-h-[420px] bg-slate-950 text-white flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={heroImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-terracotta hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Partner Kitchens</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-forest/90 text-white border border-emerald-500/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Atelier Guild Member</span>
            </span>
            {partner.established && (
              <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/15">
                Est. {partner.established}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-terracotta text-white shadow-sm">
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
                <Sparkles className="w-4 h-4 text-brand-terracotta" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-terracotta font-bold">
                  Heritage & Provenance
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-brand-forest mb-4">
                The Culinary Chronicle
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-4">
                {partner.description || 'An iconic institution revered for decades across Hyderabad, anchoring authentic recipes and ceremonial preparation methods.'}
              </p>
              {partner.whyWePicked && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-brand-forest font-bold block mb-1">Why Food Tailor Selected This Kitchen:</strong>
                  {partner.whyWePicked}
                </div>
              )}
            </div>

            {/* Location & Experience Attributes */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-terracotta flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    Kitchen Outlets & Service Territory
                  </span>
                  <span className="font-serif font-bold text-sm text-slate-900">
                    {partner.location || 'Hyderabad, Telangana'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">FSSAI Certified • Temperature Controlled Transit</span>
              </div>
            </div>

            {/* Approved Menu Categories & Dishes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-xl text-brand-forest">
                  Approved Menu Repertoire ({dishes.length} Dishes)
                </h3>
                {categories.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {categories.map((c) => (
                      <span key={c} className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {dishes.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-card-soft">
                  <ChefHat className="w-10 h-10 text-brand-terracotta mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Catalog items for this partner are calibrated dynamically during menu builder synthesis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-brand-forest/40 hover:shadow-card-hover transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-terracotta">
                            {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Specialty'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              dish.isVeg ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}
                          >
                            {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-slate-900 mb-1">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 font-normal">
                          {dish.description || 'Prepared with authentic spices and traditional craftsmanship.'}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Price Per Cover</span>
                        <span className="font-serif font-bold text-sm text-brand-forest">
                          ₹{dish.pricePerHead || 180}
                        </span>
                      </div>
                    </div>
                  ))}
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
