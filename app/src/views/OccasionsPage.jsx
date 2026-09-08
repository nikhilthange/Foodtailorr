'use client';

import React from 'react';
import { Link } from '../lib/navigation';
import {
  BirthdayCakeSketch,
  AnniversaryRingsSketch,
  FamilyFeastSketch,
  CorporateMeetingSketch,
  RomanticDinnerSketch,
  FestivalLampSketch,
  WeekendPartySketch,
} from '../components/ui/svg/ExperienceSketches';
import { ArrowRight, Users, Check, Sparkles } from 'lucide-react';

export const OCCASIONS_DATA = [
  {
    id: 'occ_birthday',
    slug: 'birthday-table',
    title: 'Birthday Table',
    tagline: 'Milestone celebrations with high-energy starter counters and custom gateaux.',
    guestRange: '15 – 150 guests',
    narrative: 'When marking another year of life or celebrating a milestone decade, the table should feel joyful, personal, and effortless. We blend comfort fare with showstopping live stations that delight every guest.',
    lineup: [
      { name: 'Maharaja Chaat', role: 'Live Interactive Chaat Counter' },
      { name: 'Sammosa Singh', role: 'Crispy Gourmet Cocktail Samosas' },
      { name: 'Hotel Shadab', role: 'Royal Mutton Dum Biryani' },
      { name: 'The Chocolate Room', role: 'Molten Belgian Chocolate Gateau' },
    ],
    IconComponent: BirthdayCakeSketch,
    accentColor: '#C85419',
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
    accentColor: '#0D381E',
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
    accentColor: '#0D381E',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_corporate',
    slug: 'corporate-gathering',
    title: 'Corporate Gathering',
    tagline: 'Refined executive banquets, curated corporate dining, and boardroom tea lounges.',
    guestRange: '20 – 500 guests',
    narrative: 'Impress distinguished clients and reward high-performing teams with fine-dining sophistication. Enjoy timely delivery, diverse dietary accommodations, and consolidated corporate GST invoicing.',
    lineup: [
      { name: 'Hotel Shadab', role: 'Executive Luncheon & Biryani Buffets' },
      { name: 'The Chocolate Room', role: 'Belgian Dessert Degustation' },
      { name: 'Cafe Niloufer', role: 'Executive Irani Chai & Osmania Lounge' },
      { name: 'Karachi Bakery', role: 'Artisanal Cashew Pista Bakes' },
    ],
    IconComponent: CorporateMeetingSketch,
    accentColor: '#0D381E',
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
    accentColor: '#C85419',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_festival',
    slug: 'festival-celebration',
    title: 'Festive Banquet',
    tagline: 'Ceremonial holiday feasts with pure ghee sweets and certified dietary segregation.',
    guestRange: '25 – 300 guests',
    narrative: 'Celebrate Diwali, Eid, Sankranti, or holiday reunions with traditional sanctity and royal splendor. We isolate preparation vessels and offer pure ghee mithai counters.',
    lineup: [
      { name: 'Almond House', role: 'Dry Fruit Kaju Rolls & Badam Halwa' },
      { name: 'Hotel Shadab', role: 'Festive Dum Biryani & Haleem' },
      { name: 'Maharaja Chaat', role: 'Interactive Royal Pani Puri' },
      { name: 'Ice Berg', role: 'Festive Malai Kulfi & Cassata' },
    ],
    IconComponent: FestivalLampSketch,
    accentColor: '#C85419',
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'occ_weekend',
    slug: 'weekend-house-party',
    title: 'Weekend House Party',
    tagline: 'High-energy weekend bashes with live charcoal grills and artisanal street bakes.',
    guestRange: '15 – 60 guests',
    narrative: 'Turn your weekend living room or terrace into a buzzing gourmet lounge with piping hot finger food, artisanal coolers, and late-night biryani pots.',
    lineup: [
      { name: 'Sammosa Singh', role: 'Crispy Snack Buckets' },
      { name: 'Hotel Shadab', role: 'Tandoori Kebabs & Dum Pot' },
      { name: 'Ice Berg', role: 'Live Roll Ice Cream Scoops' },
      { name: 'Cafe Niloufer', role: 'Midnight Tea Kettle Staging' },
    ],
    IconComponent: WeekendPartySketch,
    accentColor: '#0D381E',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function OccasionsPage() {
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
            <span>Bespoke Banqueting Formats • Multi-Brand Calibration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl leading-tight">
            Occasions Tailored To Perfection
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Every gathering has its own tempo. Explore calibrated multi-brand lineups engineered for Hyderabad&apos;s most cherished celebratory milestones.
          </p>
        </div>
      </section>

      {/* Occasions Editorial Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {OCCASIONS_DATA.map((occ) => {
            const Icon = occ.IconComponent;
            return (
              <div
                key={occ.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col group border border-slate-200/80 hover:border-brand-forest/40 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Header Image */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  
                  {/* Top Left: Icon & Guest Range */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" color={occ.accentColor} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{occ.guestRange}</span>
                    </span>
                  </div>

                  {/* Bottom Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
                      {occ.title}
                    </h2>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs italic text-slate-500 font-medium mb-3">
                      &ldquo;{occ.tagline}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                      {occ.narrative}
                    </p>

                    {/* Curated Partner Lineup */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-terracotta block mb-2.5">
                        Curated Partner Lineup
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {occ.lineup.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-brand-forest">{item.name}: </span>
                              <span className="text-slate-600">{item.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <Link
                      to={`/occasions/${occ.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-brand-forest hover:text-brand-terracotta transition-colors"
                    >
                      Explore Occasion Folio
                    </Link>

                    <Link
                      to={`/build-menu?occasion=${encodeURIComponent(occ.id)}`}
                      className="btn-accent px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-1.5"
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
