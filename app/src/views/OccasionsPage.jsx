'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import PencilUnderline from '../components/ui/svg/PencilUnderline';
import {
  BirthdayCakeSketch,
  AnniversaryRingsSketch,
  FamilyFeastSketch,
  CorporateMeetingSketch,
  RomanticDinnerSketch,
  FestivalLampSketch,
  WeekendPartySketch,
} from '../components/ui/svg/ExperienceSketches';
import { ArrowRight, Users, Check } from 'lucide-react';

export const OCCASIONS_DATA = [
  {
    id: 'occ_birthday',
    slug: 'birthday-table',
    title: 'Birthday Table',
    tagline: 'Milestone celebrations with high-energy starter counters and custom gateaux.',
    guestRange: '15 – 150 guests',
    narrative: 'When marking another year of life or celebrating a milestone decade, the table should feel joyful, personal, and effortless. We blend comfort fare with showstopping live stations that delight every guest from grandchildren to elders.',
    lineup: [
      { name: 'Maharaja Chaat', role: 'Live Interactive Chaat Counter' },
      { name: 'Sammosa Singh', role: 'Crispy Gourmet Cocktail Samosas' },
      { name: 'Hotel Shadab', role: 'Royal Mutton Dum Biryani' },
      { name: 'The Chocolate Room', role: 'Molten Belgian Chocolate Gateau' },
    ],
    IconComponent: BirthdayCakeSketch,
    accentColor: '#C55418',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_anniversary',
    slug: 'anniversary-evening',
    title: 'Anniversary Evening',
    tagline: 'Regal intimate dining with slow-simmered heritage courses and single-origin cacao.',
    guestRange: '10 – 100 guests',
    narrative: 'Honoring enduring love demands timeless culinary elegance. Enjoy copper-pot steamed Nizami biryanis, aromatic saffron curries, and West Godavari single-origin craft chocolate truffles curated for candlelit celebration.',
    lineup: [
      { name: 'Hotel Shadab', role: 'Imperial Dastarkhwan & Shahi Tukda' },
      { name: 'Manam Chocolate', role: 'Single-Origin West Godavari Bonbons' },
      { name: 'Cafe Niloufer', role: 'Scalded Whole-Milk Irani Chai' },
      { name: 'Dimmy Pan Palace', role: 'Silver-Vark Sweet Meetha Paan' },
    ],
    IconComponent: AnniversaryRingsSketch,
    accentColor: '#173E23',
    image: 'https://images.unsplash.com/photo-1519225424562-b9034d6ce255?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_family',
    slug: 'family-feast',
    title: 'Family Feast',
    tagline: 'Generational comfort fare uniting all palates around one abundant banquet line.',
    guestRange: '12 – 80 guests',
    narrative: 'The eternal family debate over where to order from is resolved. We curate the city’s best Mughlai dum pots alongside 100% segregated pure vegetarian specialties so every generation finds their favorite heritage dish.',
    lineup: [
      { name: 'Hotel Shadab', role: 'Nizami Chicken 65 & Dum Biryani' },
      { name: 'Almond House', role: 'Pure Ghee Badam Halwa & Bisticks' },
      { name: 'Sammosa Singh', role: 'Party Starter Platters' },
      { name: 'Ice Berg', role: 'Handcrafted Sitaphal & Tender Coconut Scoops' },
    ],
    IconComponent: FamilyFeastSketch,
    accentColor: '#173E23',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_corporate',
    slug: 'corporate-gathering',
    title: 'Corporate Gathering',
    tagline: 'Minute-accurate executive banquets, tamper-evident bento boxes, and boardroom tea lounges.',
    guestRange: '20 – 500 guests',
    narrative: 'Impress distinguished clients and reward high-performing teams with fine-dining sophistication. We guarantee clockwork delivery, temperature telemetry, segregated diets, and consolidated corporate GST invoicing.',
    lineup: [
      { name: 'Hotel Shadab', role: 'Executive Luncheon & Biryani Buffets' },
      { name: 'The Chocolate Room', role: 'Belgian Dessert Degustation' },
      { name: 'Cafe Niloufer', role: 'Executive Irani Chai & Osmania Lounge' },
      { name: 'Karachi Bakery', role: 'Artisanal Cashew Pista Bakes' },
    ],
    IconComponent: CorporateMeetingSketch,
    accentColor: '#173E23',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_romantic',
    slug: 'romantic-dinner',
    title: 'Romantic Dinner',
    tagline: 'Private residential tastings with royal silver-vark service and bespoke wine pairings.',
    guestRange: '2 – 12 guests',
    narrative: 'A private gastronomic atelier orchestrated in your residence. Enjoy bespoke course pacing, tableside finishing, molten chocolate fondues, and aristocratic digestifs.',
    lineup: [
      { name: 'Hotel Shadab', role: 'Nizami Marag & Galouti Kebabs' },
      { name: 'The Chocolate Room', role: 'Italian Sipping Chocolate & Truffles' },
      { name: 'Manam Chocolate', role: 'Craft Chocolate Degustation' },
      { name: 'Dimmy Pan Palace', role: 'Handcrafted Meetha Paan' },
    ],
    IconComponent: RomanticDinnerSketch,
    accentColor: '#C55418',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_festival',
    slug: 'festival-celebration',
    title: 'Festival Celebration',
    tagline: 'Sanctified pure vegetarian spreads, Eid Haleem, and ceremonial festive gifting.',
    guestRange: '25 – 1,000 guests',
    narrative: 'Celebrate festive milestones with revered culinary guardians. Pure ghee festive platters, verified kitchen segregation for auspicious poojas, and legendary Hyderabadi culinary gifts.',
    lineup: [
      { name: 'Almond House', role: 'Pure Ghee Shahi Mithai & Platters' },
      { name: 'Hotel Shadab', role: 'Authentic Festive Dum Feast' },
      { name: 'Karachi Bakery', role: 'Heritage Bakes & Gift Hampers' },
      { name: 'Cafe Niloufer', role: 'Morning & Evening Chai Counter' },
    ],
    IconComponent: FestivalLampSketch,
    accentColor: '#C55418',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_weekend',
    slug: 'weekend-celebration',
    title: 'Weekend Celebration',
    tagline: 'Casual high-energy house gatherings with live skewers, crunchy starters, and coolers.',
    guestRange: '15 – 80 guests',
    narrative: 'Skip the chaos of coordinating multiple takeout apps. One synchronized delivery brings crispy samosas, spicy chicken 65, rich shakes, and rolls hot to your doorstep.',
    lineup: [
      { name: 'Sammosa Singh', role: 'Party Samosas & Gourmet Dips' },
      { name: 'Maharaja Chaat', role: 'Live Sev Puri & Pav Bhaji' },
      { name: 'Thick Shake Factory', role: 'Decadent Thick Shakes' },
      { name: 'Ice Berg', role: 'Real Fruit Rolled Scoops' },
    ],
    IconComponent: WeekendPartySketch,
    accentColor: '#173E23',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function OccasionsPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18]">
      
      {/* Editorial Header */}
      <section className="bg-[#173E23] text-[#FDF9F2] pt-24 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#C55418]" />
            Bespoke Banqueting Formats
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-white max-w-3xl leading-none">
            Occasions Tailored To Perfection
          </h1>
          <PencilUnderline className="w-56 h-3 my-3" color="#C55418" />
          <p className="mt-2 text-[#FDF9F2]/80 text-sm sm:text-base max-w-2xl font-serif italic font-light leading-relaxed">
            Every gathering has its own tempo. Explore calibrated multi-brand lineups engineered for Hyderabad's most cherished celebratory milestones.
          </p>
        </div>
      </section>

      {/* Occasions Editorial Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {OCCASIONS_DATA.map((occ) => {
            const Icon = occ.IconComponent;
            return (
              <div
                key={occ.id}
                className="sketch-card rounded-2xl overflow-hidden flex flex-col group border border-[#EBE3D5] hover:border-[#173E23]/40 shadow-sm"
              >
                {/* Visual Header Image */}
                <div className="relative h-60 w-full overflow-hidden bg-[#0A0D0B]">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Top Left: Icon & Guest Range */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow">
                      <Icon className="w-6 h-6" color={occ.accentColor} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#173E23]/90 text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{occ.guestRange}</span>
                    </span>
                  </div>

                  {/* Bottom Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white leading-none drop-shadow-md">
                      {occ.title}
                    </h2>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs italic text-[#7C6F5A] font-serif font-medium mb-3">
                      &ldquo;{occ.tagline}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-[#4A453A] leading-relaxed font-light mb-6">
                      {occ.narrative}
                    </p>

                    {/* Curated Partner Lineup */}
                    <div className="mb-6 p-4 bg-[#FAF6EF] rounded-xl border border-[#EBE3D5]">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-2.5">
                        Curated Partner Lineup
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {occ.lineup.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#173E23] shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-[#173E23]">{item.name}: </span>
                              <span className="text-[#595347]">{item.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-4 border-t border-[#EBE3D5] flex items-center justify-between gap-4">
                    <Link
                      to={`/occasions/${occ.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#173E23] hover:text-[#C55418] transition-colors"
                    >
                      Explore Occasion Folio
                    </Link>

                    <Link
                      to={`/build-menu?occasion=${encodeURIComponent(occ.id)}`}
                      className="px-5 py-2.5 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Tailor This Feast</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
