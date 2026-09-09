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
import {
  ArrowRight,
  Users,
  Check,
  Sparkles,
  UtensilsCrossed,
  ChefHat,
  Flame,
  ShieldCheck,
  Clock,
  Award,
} from 'lucide-react';

export const OCCASIONS_DATA = [
  {
    id: 'occ_birthday',
    slug: 'birthday-celebration',
    aliases: ['birthday-table', 'birthday'],
    title: 'Birthday Celebration',
    tagline: 'Milestone moments with interactive live chaat, decadent dessert bars, and bespoke catering.',
    guestRange: '15 – 100 guests',
    badge: 'Top Pick',
    accentColor: '#C85419',
    category: 'Celebration',
    estimatedPerHead: 980,
    narrative: 'When marking another year of life or celebrating a milestone decade, the table should feel joyful, personal, and effortless. We blend comfort fare with showstopping live stations that delight every guest from toddlers to grandparents.',
    sampleCourses: '6 Courses • Live Chaat • Gateaux',
    image: '/occasions/birthday-celebration.jpg',
    IconComponent: BirthdayCakeSketch,
    lineup: [
      { name: 'Maharaja Chaat', role: 'Live Interactive Chaat Counter', location: 'Jubilee Hills' },
      { name: 'Samosa King', role: 'Crispy Gourmet Cocktail Samosas', location: 'Hitec City' },
      { name: 'Hotel Shadab', role: 'Royal Mutton Dum Biryani', location: 'Old City' },
      { name: 'The Chocolate Room', role: 'Molten Belgian Chocolate Gateau', location: 'Banjara Hills' },
    ],
    signatureDishes: [
      {
        name: 'Royal Dahi Sev Batata Puri',
        partner: 'Maharaja Chaat',
        dietary: 'VEG',
        pricePerHead: 180,
        image: '/dishes/maharaja-chaat-bowl.jpg',
        description: 'Crisp whole-wheat puris filled with spiced potatoes, sweetened curd, date chutney, and nylon sev.',
      },
      {
        name: 'Cocktail Samosa Platter',
        partner: 'Samosa King',
        dietary: 'VEG',
        pricePerHead: 150,
        image: '/dishes/samosa-king-gourmet.jpg',
        description: 'Golden mini samosas with spiced corn cheese and punjabi aloo fillings served with mint dip.',
      },
      {
        name: 'Nizami Mutton Dum Biryani',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 380,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Slow-cooked in sealed copper handis over charcoal with fragrant aged basmati and saffron.',
      },
      {
        name: 'Molten Belgian Chocolate Fondue',
        partner: 'The Chocolate Room',
        dietary: 'VEG',
        pricePerHead: 270,
        image: '/dishes/chocolate-room-latte.jpg',
        description: 'Velvety dark chocolate fountain with fresh strawberry skewers, churros, and marshmallows.',
      },
    ],
    courseStructure: [
      { phase: 'Welcome & Live Chaat', time: '0:00 – 0:45', desc: 'Interactive Maharaja Chaat counter and crispy samosa bites upon guest arrival.' },
      { phase: 'The Main Dum Feast', time: '0:45 – 1:45', desc: 'Sealed Handi Dum Biryani served with Mirchi Ka Salan, raita, and tandoori sides.' },
      { phase: 'Dessert Atelier & Cake', time: '1:45 – 2:30', desc: 'Custom milestone birthday gateaux and warm molten Belgian chocolate station.' },
      { phase: 'Digestif & Paan', time: '2:30+', desc: 'Chilled artisan fruit coolers and royal Meetha Paan finish.' },
    ],
  },
  {
    id: 'occ_anniversary',
    slug: 'anniversary-evening',
    aliases: ['anniversary-soiree', 'anniversary'],
    title: 'Anniversary Soirée',
    tagline: 'Regal intimate dining with slow-simmered heritage courses and single-origin cacao.',
    guestRange: '10 – 100 guests',
    badge: 'Fine Dining',
    accentColor: '#0D381E',
    category: 'Fine Dining',
    estimatedPerHead: 1250,
    narrative: 'Honoring enduring love demands timeless culinary elegance. Enjoy copper-pot steamed Nizami biryanis, aromatic saffron curries, and West Godavari single-origin craft chocolate truffles curated for candlelit celebration.',
    sampleCourses: '7 Courses • Silver-Vark • Cacao',
    image: '/occasions/anniversary-evening.jpg',
    IconComponent: AnniversaryRingsSketch,
    lineup: [
      { name: 'Hotel Shadab', role: 'Imperial Dastarkhwan & Shahi Tukda', location: 'Old City' },
      { name: 'Manam Chocolate', role: 'Single-Origin West Godavari Bonbons', location: 'Banjara Hills' },
      { name: 'Cafe Niloufer', role: 'Scalded Whole-Milk Irani Chai', location: 'Lakdikapul' },
      { name: 'Dimmy Pan Palace', role: 'Silver-Vark Sweet Meetha Paan', location: 'Jubilee Hills' },
    ],
    signatureDishes: [
      {
        name: 'Nizami Dum Mutton Dastarkhwan',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 420,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Imperial cut baby goat slow-steamed with saffron ghee, kewra, and long-grain aged rice.',
      },
      {
        name: 'Single-Origin Cacao Truffles',
        partner: 'Manam Chocolate',
        dietary: 'VEG',
        pricePerHead: 290,
        image: '/dishes/manam-craft-truffles.jpg',
        description: '68% West Godavari craft dark chocolate ganache enrobed in single-estate nibs.',
      },
      {
        name: 'Royal Irani Chai Service',
        partner: 'Cafe Niloufer',
        dietary: 'VEG',
        pricePerHead: 140,
        image: '/dishes/cafe-niloufer-chai-bun.jpg',
        description: 'Traditional double-boiled spiced whole milk tea served from insulated copper urns.',
      },
      {
        name: 'Silver-Vark Shahi Meetha Paan',
        partner: 'Dimmy Pan Palace',
        dietary: 'VEG',
        pricePerHead: 90,
        image: '/dishes/dimmy-meetha-paan.jpg',
        description: 'Fragrant Calcutta betel leaf loaded with gulkand, natural rose oils, and silver-gold vark.',
      },
    ],
    courseStructure: [
      { phase: 'Amuse-Bouche & Niloufer Chai', time: '0:00 – 0:30', desc: 'Welcome samovar Irani chai pairing with artisan mini baked savories.' },
      { phase: 'Imperial Dastarkhwan', time: '0:30 – 1:30', desc: 'Slow-simmered handi biryani course with artisanal flatbreads and rich gravies.' },
      { phase: 'Single-Origin Chocolate Flight', time: '1:30 – 2:15', desc: 'Curated Manam chocolate tasting with roasted cacao bean pairings.' },
      { phase: 'Digestif Finish', time: '2:15+', desc: 'Dimmy silver-leaf sweet paan to conclude the candlelit feast.' },
    ],
  },
  {
    id: 'occ_family',
    slug: 'family-gathering',
    aliases: ['family-feast', 'family'],
    title: 'Family Gathering',
    tagline: 'Generational comfort fare uniting all palates around one abundant banquet line.',
    guestRange: '12 – 80 guests',
    badge: 'Popular',
    accentColor: '#0D381E',
    category: 'Gathering',
    estimatedPerHead: 920,
    narrative: 'The eternal family debate over where to order from is resolved. We curate the city’s best Mughlai dum pots alongside 100% segregated pure vegetarian specialties so every generation finds their favorite heritage dish.',
    sampleCourses: '8 Courses • Pure Ghee • Sweets',
    image: '/occasions/family-gathering.jpg',
    IconComponent: FamilyFeastSketch,
    lineup: [
      { name: 'Hotel Shadab', role: 'Nizami Chicken 65 & Dum Biryani', location: 'Old City' },
      { name: 'Almond House', role: 'Pure Ghee Badam Halwa & Bisticks', location: 'Himayatnagar' },
      { name: 'Samosa King', role: 'Party Starter Platters', location: 'Hitec City' },
      { name: 'Ice Berg', role: 'Handcrafted Sitaphal & Tender Coconut Scoops', location: 'Madhapur' },
    ],
    signatureDishes: [
      {
        name: 'Hyderabadi Chicken 65 & Tikka',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 280,
        image: '/dishes/shadab-tandoori-chicken-tikka.jpg',
        description: 'Tender chicken tossed with curry leaves, crushed pepper, and fiery Guntur chili oil.',
      },
      {
        name: 'Pure Ghee Badam Halwa',
        partner: 'Almond House',
        dietary: 'VEG',
        pricePerHead: 240,
        image: '/dishes/almond-house-mithai.jpg',
        description: 'Slow-cooked California almond paste in pure A2 cow ghee and saffron milk.',
      },
      {
        name: 'Shadab Kaju Paneer Biryani',
        partner: 'Hotel Shadab',
        dietary: 'VEG',
        pricePerHead: 320,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Golden cashews and fresh cottage cheese slow-steamed with basmati rice.',
      },
      {
        name: 'Sitaphal Organic Gelato',
        partner: 'Ice Berg',
        dietary: 'VEG',
        pricePerHead: 190,
        image: '/dishes/ice-berg-gelato-cup.jpg',
        description: 'Handcrafted with real seasonal custard apple pulp and organic country cream.',
      },
    ],
    courseStructure: [
      { phase: 'Appetizers & Samosa Platters', time: '0:00 – 0:45', desc: 'Samosa King gourmet starters with tangy tamarind dip and cooling shakes.' },
      { phase: 'Grand Shared Banquet', time: '0:45 – 1:45', desc: 'Parallel veg and non-veg dum biryani handis with aromatic salan and raita.' },
      { phase: 'Pure Ghee Sweets & Gelato', time: '1:45 – 2:30', desc: 'Almond House warm badam halwa and live rolled ice cream cups.' },
      { phase: 'Digestif Service', time: '2:30+', desc: 'Meetha paan and Niloufer masala chai kettle service.' },
    ],
  },
  {
    id: 'occ_corporate',
    slug: 'corporate-feast',
    aliases: ['corporate-gathering', 'corporate'],
    title: 'Corporate Feast',
    tagline: 'Refined executive banquets, curated corporate dining, and boardroom tea lounges.',
    guestRange: '20 – 100 guests',
    badge: 'Executive',
    accentColor: '#0D381E',
    category: 'Corporate',
    estimatedPerHead: 1100,
    narrative: 'Impress distinguished clients and reward high-performing teams with fine-dining sophistication. Enjoy timely delivery, diverse dietary accommodations, and consolidated corporate GST invoicing.',
    sampleCourses: 'Executive Boxes • Curated Menus',
    image: '/occasions/corporate-feast.jpg',
    IconComponent: CorporateMeetingSketch,
    lineup: [
      { name: 'Hotel Shadab', role: 'Executive Luncheon & Biryani Buffets', location: 'Old City' },
      { name: 'The Chocolate Room', role: 'Belgian Dessert Degustation', location: 'Banjara Hills' },
      { name: 'Cafe Niloufer', role: 'Executive Irani Chai & Osmania Lounge', location: 'Lakdikapul' },
      { name: 'Karachi Bakery', role: 'Artisanal Cashew Pista Bakes', location: 'Mozamjahi' },
    ],
    signatureDishes: [
      {
        name: 'Executive Dum Biryani Bento',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 360,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Single-serve sealed premium biryani with kebab side, boiled egg, mirchi salan, and raita.',
      },
      {
        name: 'Artisanal Osmania & Fruit Bakes',
        partner: 'Karachi Bakery',
        dietary: 'VEG',
        pricePerHead: 140,
        image: '/dishes/karachi-bakery-biscuits.jpg',
        description: 'Famous sweet-savory melt-in-mouth biscuits and candied fruit bakes.',
      },
      {
        name: 'Royal Irani Chai Samovar Service',
        partner: 'Cafe Niloufer',
        dietary: 'VEG',
        pricePerHead: 150,
        image: '/dishes/cafe-niloufer-chai-bun.jpg',
        description: 'Live brass urn tea staging with double-boiled thickened whole milk.',
      },
      {
        name: 'Belgian Truffle Tasting Box',
        partner: 'The Chocolate Room',
        dietary: 'VEG',
        pricePerHead: 250,
        image: '/dishes/chocolate-room-latte.jpg',
        description: 'Assorted handcrafted pralines, almond rochers, and salted caramel cubes.',
      },
    ],
    courseStructure: [
      { phase: 'Boardroom Welcome & Tea', time: '0:00 – 0:30', desc: 'Cafe Niloufer chai service with Karachi Bakery biscuits and warm buns.' },
      { phase: 'Executive Buffet / Bento', time: '0:30 – 1:30', desc: 'Synchronized warm delivery of Shadab biryani, paneer gravies, and rotis.' },
      { phase: 'Dessert Degustation', time: '1:30 – 2:15', desc: 'Belgian chocolate truffles and seasonal dessert cups.' },
      { phase: 'Post-Meeting Refreshers', time: '2:15+', desc: 'Chilled artisanal shakes and digestif paans.' },
    ],
  },
  {
    id: 'occ_romantic',
    slug: 'romantic-dinner',
    aliases: ['intimate-degustation', 'romantic'],
    title: 'Intimate Degustation',
    tagline: 'Private candlelit residence dining featuring silver-vark delicacies and custom tasting courses.',
    guestRange: '2 – 12 guests',
    badge: 'Bespoke',
    accentColor: '#C85419',
    category: 'Fine Dining',
    estimatedPerHead: 1450,
    narrative: 'A private gastronomic atelier orchestrated in your residence. Enjoy bespoke course pacing, tableside finishing, molten chocolate fondues, and aristocratic digestifs.',
    sampleCourses: '5 Courses • Butler Pairing',
    image: '/occasions/intimate-degustation.jpg',
    IconComponent: RomanticDinnerSketch,
    lineup: [
      { name: 'Hotel Shadab', role: 'Nizami Marag & Galouti Kebabs', location: 'Old City' },
      { name: 'The Chocolate Room', role: 'Italian Sipping Chocolate & Truffles', location: 'Banjara Hills' },
      { name: 'Manam Chocolate', role: 'Craft Chocolate Degustation', location: 'Banjara Hills' },
      { name: 'Dimmy Pan Palace', role: 'Handcrafted Meetha Paan', location: 'Jubilee Hills' },
    ],
    signatureDishes: [
      {
        name: 'Nizami Saffron Marag & Kebabs',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 450,
        image: '/dishes/shadab-tandoori-chicken-tikka.jpg',
        description: 'Rich lamb almond broth seasoned with cardamom and slow-cooked melt-in-mouth kebabs.',
      },
      {
        name: 'Single-Origin Cacao Truffles',
        partner: 'Manam Chocolate',
        dietary: 'VEG',
        pricePerHead: 320,
        image: '/dishes/manam-craft-truffles.jpg',
        description: 'Estate single-origin dark chocolate bonbons filled with mango passionfruit puree.',
      },
      {
        name: 'Belgian Fondue for Two',
        partner: 'The Chocolate Room',
        dietary: 'VEG',
        pricePerHead: 290,
        image: '/dishes/chocolate-room-latte.jpg',
        description: 'Warm liquid chocolate served in ceramic burner with strawberries and waffles.',
      },
      {
        name: 'Gold-Leaf Aristocrat Paan',
        partner: 'Dimmy Pan Palace',
        dietary: 'VEG',
        pricePerHead: 120,
        image: '/dishes/dimmy-meetha-paan.jpg',
        description: 'Bespoke silver and 24k gold leaf paan crafted with rare rose petals and saffron.',
      },
    ],
    courseStructure: [
      { phase: 'Course 1: Royal Marag', time: 'Pacing 1', desc: 'Rich slow-simmered almond lamb soup with flaky naan.' },
      { phase: 'Course 2: Signature Dum Pot', time: 'Pacing 2', desc: 'Mini sealed handi biryani opened tableside for maximum aroma release.' },
      { phase: 'Course 3: Cacao Degustation', time: 'Pacing 3', desc: 'Manam single-origin flight and Italian sipping chocolate.' },
      { phase: 'Course 4: Royal Finale', time: 'Pacing 4', desc: 'Gold-leaf scented paan and artisanal saffron digestifs.' },
    ],
  },
  {
    id: 'occ_festival',
    slug: 'festival-celebration',
    aliases: ['festive-banquet', 'festival'],
    title: 'Festive Banquet',
    tagline: 'Ceremonial holiday feasts with pure ghee sweets and traditional festive menus.',
    guestRange: '20 – 100 guests',
    badge: 'Heritage',
    accentColor: '#C85419',
    category: 'Gathering',
    estimatedPerHead: 1080,
    narrative: 'Celebrate Diwali, Eid, Sankranti, or holiday reunions with traditional sanctity and royal splendor. We offer traditional festive preparations and pure ghee mithai counters with complete segregation for pure vegetarian and Jain dietary needs.',
    sampleCourses: 'Pure Veg / Jain • Heritage Sweets',
    image: '/occasions/festive-banquet.jpg',
    IconComponent: FestivalLampSketch,
    lineup: [
      { name: 'Almond House', role: 'Dry Fruit Kaju Rolls & Badam Halwa', location: 'Himayatnagar' },
      { name: 'Hotel Shadab', role: 'Festive Dum Biryani & Haleem', location: 'Old City' },
      { name: 'Maharaja Chaat', role: 'Interactive Royal Pani Puri', location: 'Jubilee Hills' },
      { name: 'Ice Berg', role: 'Festive Malai Kulfi & Cassata', location: 'Madhapur' },
    ],
    signatureDishes: [
      {
        name: 'Pure Ghee Badam Halwa & Mithai',
        partner: 'Almond House',
        dietary: 'VEG',
        pricePerHead: 260,
        image: '/dishes/almond-house-mithai.jpg',
        description: 'Slow-simmered almond halwa with pure A2 cow ghee, saffron strands, and roasted pistachios.',
      },
      {
        name: 'Shadab Kaju Paneer Dum Biryani',
        partner: 'Hotel Shadab',
        dietary: 'VEG',
        pricePerHead: 340,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Fragrant long-grain aged basmati layered with golden cashews and spiced malai paneer.',
      },
      {
        name: 'Royal Dahi Sev Batata Puri',
        partner: 'Maharaja Chaat',
        dietary: 'VEG',
        pricePerHead: 180,
        image: '/dishes/maharaja-chaat-bowl.jpg',
        description: 'Crisp whole-wheat puris filled with spiced potatoes, sweetened curd, date chutney, and nylon sev.',
      },
      {
        name: 'Artisanal Sitaphal Gelato Cup',
        partner: 'Ice Berg',
        dietary: 'VEG',
        pricePerHead: 210,
        image: '/dishes/ice-berg-gelato-cup.jpg',
        description: 'Fresh custard apple pulp and tender coconut malai hand-spun with organic dairy.',
      },
      {
        name: 'Gold-Vark Shahi Meetha Paan',
        partner: 'Dimmy Pan Palace',
        dietary: 'VEG',
        pricePerHead: 90,
        image: '/dishes/dimmy-meetha-paan.jpg',
        description: 'Fragrant Calcutta betel leaf loaded with gulkand, natural rose oils, and silver-gold vark.',
      },
    ],
    courseStructure: [
      { phase: 'Phase 1: Welcome & Live Chaat', time: '0:00 – 0:45', desc: 'Interactive Maharaja Chaat counter serving chilled Dahi Puri & Samosa starters.' },
      { phase: 'Phase 2: The Royal Dum Table', time: '0:45 – 1:45', desc: 'Hotel Shadab sealed Handi Biryani served with Mirchi Ka Salan & Dahi Chutney.' },
      { phase: 'Phase 3: Heritage Sweets & Gelato', time: '1:45 – 2:30', desc: 'Almond House warm pure ghee halwa paired with Ice Berg seasonal fruit ice creams.' },
      { phase: 'Phase 4: Digestif & Shahi Paan', time: '2:30+', desc: 'Dimmy silver-leaf sweet paan station with Niloufer chai service.' },
    ],
  },
  {
    id: 'occ_weekend',
    slug: 'weekend-celebration',
    aliases: ['weekend-house-party', 'weekend'],
    title: 'Weekend Party',
    tagline: 'High-energy weekend bashes with live charcoal grills and artisanal street bakes.',
    guestRange: '15 – 60 guests',
    badge: 'Vibrant',
    accentColor: '#0D381E',
    category: 'Celebration',
    estimatedPerHead: 890,
    narrative: 'Turn your weekend living room or terrace into a buzzing gourmet lounge with piping hot finger food, artisanal coolers, and late-night biryani pots.',
    sampleCourses: 'Skewers • Chaat • Mocktails',
    image: '/occasions/weekend-party.jpg',
    IconComponent: WeekendPartySketch,
    lineup: [
      { name: 'Samosa King', role: 'Crispy Snack Buckets', location: 'Hitec City' },
      { name: 'Hotel Shadab', role: 'Tandoori Kebabs & Dum Pot', location: 'Old City' },
      { name: 'Ice Berg', role: 'Live Roll Ice Cream Scoops', location: 'Madhapur' },
      { name: 'Cafe Niloufer', role: 'Midnight Tea Kettle Staging', location: 'Lakdikapul' },
    ],
    signatureDishes: [
      {
        name: 'Tandoori Chicken Tikka Platter',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 290,
        image: '/dishes/shadab-tandoori-chicken-tikka.jpg',
        description: 'Charcoal-grilled chicken chunks marinated in hung curd, ginger garlic, and mustard oil.',
      },
      {
        name: 'Cocktail Samosa Basket',
        partner: 'Samosa King',
        dietary: 'VEG',
        pricePerHead: 140,
        image: '/dishes/samosa-king-gourmet.jpg',
        description: 'Bite-sized crispy pastries packed with spiced potatoes and cheese corn.',
      },
      {
        name: 'Thick Belgian Chocolate Shake',
        partner: 'Thick Shake Factory',
        dietary: 'VEG',
        pricePerHead: 180,
        image: '/dishes/thick-shake-boba.jpg',
        description: 'Dense velvety chocolate shake topped with dark chocolate crunch and brownie fudge.',
      },
      {
        name: 'Midnight Irani Chai & Osmania',
        partner: 'Cafe Niloufer',
        dietary: 'VEG',
        pricePerHead: 140,
        image: '/dishes/cafe-niloufer-chai-bun.jpg',
        description: 'Freshly scalded tea delivered in insulated thermal urns with crisp Osmania biscuits.',
      },
    ],
    courseStructure: [
      { phase: 'Lounge Kickoff & Starters', time: '0:00 – 1:00', desc: 'Continuous pass-around platters of hot samosas and tandoori skewers.' },
      { phase: 'Midnight Dum Feast', time: '1:00 – 2:00', desc: 'Sealed piping hot biryani pots served with cooling raita and gravies.' },
      { phase: 'Late-Night Sweets & Shakes', time: '2:00+', desc: 'Thick Belgian shakes and Niloufer midnight tea service.' },
    ],
  },
  {
    id: 'occ_custom',
    slug: 'custom-occasion',
    aliases: ['custom-experience', 'custom'],
    title: 'Custom Experience',
    tagline: 'Your unique vision, architected course-by-course with personalized pairings and seamless coordination.',
    guestRange: 'Bespoke Scale',
    badge: 'Tailored',
    accentColor: '#C85419',
    category: 'Bespoke',
    estimatedPerHead: 1350,
    narrative: 'When no standard format fits, architect your dream banquet from the ground up. Select any combination of master kitchens, specialized live counters, sommelier pairings, and staging styles.',
    sampleCourses: 'Bespoke Menu • Multi-Kitchen Curation',
    image: '/occasions/custom-experience.jpg',
    IconComponent: Sparkles,
    lineup: [
      { name: 'All Atelier Kitchens', role: 'Unified Multi-Brand Access', location: 'Citywide Guild' },
      { name: 'Dedicated Concierge', role: 'End-to-End Banquet Pacing', location: 'White-Glove Team' },
      { name: 'Live Chef Staging', role: 'Tableside Culinary Theatre', location: 'On-Site Crew' },
      { name: 'Sommelier Pairings', role: 'Artisanal Beverage Curation', location: 'Curated Cellar' },
    ],
    signatureDishes: [
      {
        name: 'Nizami Dum Mutton Dastarkhwan',
        partner: 'Hotel Shadab',
        dietary: 'NON_VEG',
        pricePerHead: 420,
        image: '/dishes/shadab-kaju-paneer-biryani.png',
        description: 'Imperial cut baby goat slow-steamed with saffron ghee, kewra, and long-grain aged rice.',
      },
      {
        name: 'Single-Origin Cacao Truffles',
        partner: 'Manam Chocolate',
        dietary: 'VEG',
        pricePerHead: 290,
        image: '/dishes/manam-craft-truffles.jpg',
        description: '68% West Godavari craft dark chocolate ganache enrobed in single-estate nibs.',
      },
      {
        name: 'Pure Ghee Badam Halwa',
        partner: 'Almond House',
        dietary: 'VEG',
        pricePerHead: 240,
        image: '/dishes/almond-house-mithai.jpg',
        description: 'Slow-cooked California almond paste in pure A2 cow ghee and saffron milk.',
      },
      {
        name: 'Gold-Vark Shahi Meetha Paan',
        partner: 'Dimmy Pan Palace',
        dietary: 'VEG',
        pricePerHead: 90,
        image: '/dishes/dimmy-meetha-paan.jpg',
        description: 'Fragrant Calcutta betel leaf loaded with gulkand, natural rose oils, and silver-gold vark.',
      },
    ],
    courseStructure: [
      { phase: 'Curator Consultation', time: 'Step 1', desc: '1-on-1 tasting menu design with our Culinary Director.' },
      { phase: 'Multi-Kitchen Sourcing', time: 'Step 2', desc: 'Consolidated ordering across 8+ heritage institutions on 1 bill.' },
      { phase: 'White-Glove Staging', time: 'Step 3', desc: 'Dedicated banquet captain and customized chafing setup.' },
    ],
  },
];

export default function OccasionsPage() {
  const [filter, setFilter] = React.useState('ALL');

  const filteredOccasions = React.useMemo(() => {
    if (filter === 'ALL') return OCCASIONS_DATA;
    return OCCASIONS_DATA.filter((occ) => occ.category === filter);
  }, [filter]);

  const filterTabs = [
    { id: 'ALL', label: 'All Formats' },
    { id: 'Celebration', label: 'Celebrations & Parties' },
    { id: 'Fine Dining', label: 'Fine Dining & Soirées' },
    { id: 'Gathering', label: 'Family & Festivals' },
    { id: 'Corporate', label: 'Executive & Corporate' },
    { id: 'Bespoke', label: 'Bespoke Formats' },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-slate-900">
      {/* Luxury Porcelain Editorial Header */}
      <section className="relative bg-gradient-to-b from-white via-[#FCFBF7] to-[#F6F4EE] pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5DD] overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#0D381E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C85419]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85419]/10 text-[#C85419] border border-[#C85419]/20 text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C85419]" />
            <span>Bespoke Banqueting Formats • Multi-Brand Calibration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0D381E] max-w-3xl leading-tight">
            Occasions Tailored To Perfection
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Every gathering has its own tempo. Explore calibrated multi-brand lineups engineered for Hyderabad&apos;s most cherished celebratory milestones.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mt-8 pt-6 border-t border-[#E8E5DD]/70">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#0D381E] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-[#EDE8DF] hover:border-[#0D381E]/30 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Editorial Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredOccasions.map((occ) => {
            const Icon = occ.IconComponent;
            return (
              <div
                key={occ.id}
                className="bg-white rounded-3xl overflow-hidden flex flex-col group border border-[#EDE8DF] hover:border-amber-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Visual Header Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
                  <img
                    src={occ.image}
                    alt={occ.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" color={occ.accentColor} />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-300" />
                        <span>{occ.guestRange}</span>
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C85419] text-white shadow-sm">
                      {occ.badge}
                    </span>
                  </div>

                  {/* Bottom Title & Sample Courses */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md mb-1">
                      {occ.title}
                    </h2>
                    <span className="text-xs text-amber-200/95 font-medium">
                      {occ.sampleCourses} • Approx. ₹{occ.estimatedPerHead}/cover
                    </span>
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
                    <div className="mb-6 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EDE8DF]">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85419] block mb-2.5">
                        Curated Partner Lineup
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {occ.lineup.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-[#0D381E]">{item.name}: </span>
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
                      className="text-xs font-bold uppercase tracking-wider text-[#0D381E] hover:text-[#C85419] transition-colors flex items-center gap-1.5 py-2 group/link"
                    >
                      <span>Explore Occasion Folio</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to={`/build-menu?occasion=${encodeURIComponent(occ.id)}`}
                      className="btn-accent px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-1.5 hover:scale-[1.02] active:scale-100 transition-transform"
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
