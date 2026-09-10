'use client';

import React, { useState, useEffect } from 'react';
import { Link, useParams } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, ShieldCheck, AlertCircle, ChefHat } from 'lucide-react';
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
        if (isMounted) setError("We couldn't load this restaurant right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPartnerProfile();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0D2418] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading restaurant profile...</p>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-8 h-8 text-rose-600 mb-2" />
        <h2 className="font-serif font-bold text-lg text-slate-900 mb-1">Restaurant Notice</h2>
        <p className="text-xs text-slate-500 mb-5">{error || 'Restaurant not found in directory.'}</p>
        <Link
          to="/partners"
          className="px-4 py-2 bg-[#0D2418] text-white text-xs font-semibold rounded-lg"
        >
          Return to Restaurants
        </Link>
      </div>
    );
  }

  const name = partner.businessName || partner.name;
  const heroImg = getPartnerCoverImage(partner);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Hero Banner */}
      <section className="relative min-h-[42vh] bg-[#0D2418] text-white flex items-end pb-10 pt-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={heroImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-75 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2418] via-[#0D2418]/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Restaurants</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/95 text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Partner</span>
            </span>
            {partner.established && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-black/60 text-white">
                Est. {partner.established}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#C85419] text-white">
              {partner.cuisine}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-2">
            {name}
          </h1>

          {partner.tagline && (
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl font-normal">
              &ldquo;{partner.tagline}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Story & Dishes */}
          <div className="lg:col-span-8 space-y-8">
            {/* Story Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE5DC] shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-1">
                About The Kitchen
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mb-3">
                Heritage & Provenance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                {partner.description}
              </p>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-emerald-950">Why We Curated This Partner</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {partner.whyWePicked || 'Unmatched culinary heritage, authentic preparation methods, and proven event catering consistency.'}
                  </p>
                </div>
              </div>

              {partner.location && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 text-[#C85419]" />
                  <span>{partner.location}</span>
                </div>
              )}
            </div>

            {/* Signature Dishes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
                  Featured Menu Dishes
                </h3>
                <span className="text-xs text-slate-500">
                  {dishes.length} Items Available
                </span>
              </div>

              {dishes.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-[#EAE5DC] text-center shadow-xs">
                  <ChefHat className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Dishes for this restaurant can be selected in the menu builder.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map((dish) => {
                    const dishImg = getDishImage(dish);
                    return (
                      <div
                        key={dish.id}
                        className="bg-white rounded-2xl border border-[#EAE5DC] overflow-hidden flex flex-col justify-between hover:border-[#D1C9BC] shadow-xs transition-all group"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <img
                            src={dishImg}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                            <span className="text-[10px] font-semibold text-slate-800 bg-white/95 px-2 py-0.5 rounded shadow-xs">
                              {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Course'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                dish.isVeg || dish.dietary === 'VEG' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                              }`}
                            >
                              {dish.isVeg || dish.dietary === 'VEG' ? 'Veg' : 'Non-Veg'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 mb-1 group-hover:text-[#C85419] transition-colors leading-snug">
                              {dish.name}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 font-normal">
                              {dish.description || 'Prepared with authentic spices and traditional craftsmanship.'}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Per Guest</span>
                            <span className="font-serif font-bold text-sm text-[#0D2418]">
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
            <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] sticky top-24 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85419] block mb-1">
                Event Catering
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 mb-2">
                Include {name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                Include dishes from {name} in your custom event menu, synchronized with dishes from other top Hyderabad restaurants on one bill.
              </p>

              <div className="space-y-2.5 mb-6 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Cuisine</span>
                  <strong className="text-slate-900">{partner.cuisine}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Available Items</span>
                  <strong className="text-slate-900">{dishes.length} Items</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Location</span>
                  <strong className="text-slate-900">{partner.location || 'Hyderabad'}</strong>
                </div>
              </div>

              <Link
                to={`/build-menu?partner=${encodeURIComponent(partner.id)}`}
                className="w-full py-3 px-4 rounded-lg bg-[#C85419] hover:bg-[#B34710] text-white text-xs uppercase tracking-wider font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Add To Event Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
