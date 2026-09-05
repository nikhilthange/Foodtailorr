'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from '../lib/navigation';
import { api } from '../lib/apiClient';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import BotanicalSprig from '../components/ui/svg/BotanicalSprig';
import ChefHatSketch from '../components/ui/svg/ChefHatSketch';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-[#FDF9F2] pt-28 pb-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#173E23] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-[#7C6F5A]">Loading Partner Atelier...</p>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-[#FDF9F2] pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
        <h2 className="font-serif font-bold text-xl text-[#173E23] mb-1">Partner Notice</h2>
        <p className="text-xs text-[#7C6F5A] mb-6">{error || 'Kitchen not found in directory.'}</p>
        <Link
          to="/partners"
          className="px-6 py-2.5 bg-[#173E23] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Return to Partners
        </Link>
      </div>
    );
  }

  const name = partner.businessName || partner.name;
  const heroImg = partner.coverImageUrl || partner.imageUrl || FALLBACK_HERO;

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Hero Banner */}
      <section className="relative h-[52vh] min-h-[400px] bg-[#0A0D0B] text-white flex items-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <img
          src={heroImg}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-45 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0B] via-[#0A0D0B]/55 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Link
            to="/partners"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C55418] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Partner Kitchens</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#173E23]/90 text-white border border-emerald-500/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified Atelier Guild Member</span>
            </span>
            {partner.established && (
              <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/15">
                Est. {partner.established}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C55418] text-white shadow-sm">
              {partner.cuisine}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white leading-none">
            {name}
          </h1>
          <PencilUnderline className="w-56 h-3 my-2" color="#C55418" />

          {partner.tagline && (
            <p className="font-serif italic text-base sm:text-xl text-[#FDF9F2]/90 max-w-2xl font-light">
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BotanicalSprig className="w-6 h-6 text-[#173E23]" color="#173E23" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#C55418] font-bold">
                  Heritage & Provenance
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#173E23] mb-4">
                The Culinary Chronicle
              </h2>
              <p className="text-sm sm:text-base text-[#424941] leading-relaxed font-light mb-4">
                {partner.description || 'An iconic institution revered for decades across Hyderabad, anchoring authentic recipes and ceremonial preparation methods.'}
              </p>
              {partner.whyWePicked && (
                <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#EBE3D5] text-xs text-[#595347] leading-relaxed">
                  <strong className="text-[#173E23] font-serif block mb-1">Why Food Tailor Selected This Kitchen:</strong>
                  {partner.whyWePicked}
                </div>
              )}
            </div>

            {/* Location & Experience Attributes */}
            <div className="p-5 bg-white rounded-2xl border border-[#EBE3D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C55418]/10 text-[#C55418] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#7C6F5A] block">
                    Kitchen Outlets & Service Territory
                  </span>
                  <span className="font-serif font-bold text-sm text-[#173E23]">
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
                <h3 className="font-serif font-bold text-xl text-[#173E23]">
                  Approved Menu Repertoire ({dishes.length} Dishes)
                </h3>
                {categories.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {categories.map((c) => (
                      <span key={c} className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#173E23]/10 text-[#173E23]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {dishes.length === 0 ? (
                <div className="p-8 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] text-center">
                  <ChefHatSketch className="w-10 h-10 text-[#C55418] mx-auto mb-2" color="#C55418" />
                  <p className="text-xs text-[#7C6F5A]">Catalog items for this partner are calibrated dynamically during menu builder synthesis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-4 bg-white rounded-xl border border-[#EBE3D5] flex flex-col justify-between hover:border-[#173E23]/40 transition-all shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C55418]">
                            {(typeof dish.category === 'object' ? dish.category?.name : dish.category) || 'Specialty'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              dish.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#173E23] mb-1">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-[#7C6F5A] leading-relaxed line-clamp-2 mb-3">
                          {dish.description || 'Prepared with authentic spices and traditional craftsmanship.'}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#F3EFE6] flex items-center justify-between text-xs">
                        <span className="text-[#7C6F5A]">Price Per Cover</span>
                        <span className="font-serif font-bold text-sm text-[#173E23]">
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
            <div className="sketch-card p-6 sm:p-7 rounded-2xl border-2 border-[#173E23] sticky top-24 shadow-xl">
              <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold block mb-1">
                Atelier Commission
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#173E23] mb-3">
                Build A Menu With {name}
              </h3>
              <p className="text-xs text-[#595347] leading-relaxed font-light mb-6">
                Commission dishes from {name} as the centerpiece or course pairing for your upcoming gathering. Synchronized with other heritage houses onto one seamless bill.
              </p>

              <div className="space-y-3 mb-6 text-xs text-[#424941]">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Cuisine</span>
                  <strong className="text-[#173E23]">{partner.cuisine}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Dishes Available</span>
                  <strong className="text-[#173E23]">{dishes.length} Verified Items</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D5]">
                  <span>Provenance</span>
                  <strong className="text-[#173E23]">100% Authentic Hyderabad</strong>
                </div>
              </div>

              {/* Prompt Section 21 explicit CTA text */}
              <Link
                to={`/build-menu?partner=${encodeURIComponent(partner.id)}`}
                className="w-full py-3.5 px-5 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group text-center"
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
