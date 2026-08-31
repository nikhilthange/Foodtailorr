import React from 'react';
import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import BookOccasionSection from '../components/landing/BookOccasionSection';
import CraftStorySection from '../components/landing/CraftStorySection';
import CollageVibeSection from '../components/landing/CollageVibeSection';
import CuratedMomentsSection from '../components/landing/CuratedMomentsSection';
import MenuOffersSection from '../components/landing/MenuOffersSection';
import ReservationNightSection from '../components/landing/ReservationNightSection';
import TriplePhotoStrip from '../components/landing/TriplePhotoStrip';
import MomentsGallerySection from '../components/landing/MomentsGallerySection';
import NewInOurOfferSection from '../components/landing/NewInOurOfferSection';
import FestiveGigsSection from '../components/landing/FestiveGigsSection';
import TestimonialStorySection from '../components/landing/TestimonialStorySection';
import NewsletterSection from '../components/landing/NewsletterSection';
import EditorialFooter from '../components/landing/EditorialFooter';
import { FoodArtDivider } from '../components/landing/EditorialDecorations';

export default function HomePage() {
  return (
    <div className="editorial-landing">
      {/* 1. Liquid Glass Luxury Editorial Navigation */}
      <LandingNav />

      {/* 2. Cinematic Hero Section */}
      <HeroSection />

      {/* 3. Book Your Occasion & Philosophy (Asymmetric 2-Column Desktop Spread) */}
      <BookOccasionSection />

      {/* 4. Craft Story: "Iconic Brands, Authentic Taste, Tailored Feasts" */}
      <CraftStorySection />

      {/* Subtle Food Art Divider */}
      <FoodArtDivider icon="biryani" label="CURATED HERITAGE" />

      {/* 5. Visual Collage & Culinary Atmosphere */}
      <CollageVibeSection />

      {/* 6. "The Food You Love. The Moments You Create." (Asymmetric 2-Column Editorial Spread) */}
      <CuratedMomentsSection />

      {/* 7. Curated Signature Dishes & Desserts (Bon Appétit Badge, Niloufer, Shadab, Almond House) */}
      <MenuOffersSection />

      {/* 8. Plan Your Celebration (Warm glowing evening ambience, 4-column planner form) */}
      <ReservationNightSection />

      {/* Subtle Food Art Divider */}
      <FoodArtDivider icon="chai" label="AUTHENTIC DELIGHTS" />

      {/* 9. Triple Photo Strip Band */}
      <TriplePhotoStrip />

      {/* 10. Moments We Create (Editorial Asymmetrical Food & Banquet Mosaic) */}
      <MomentsGallerySection />

      {/* 11. New In Our Offer (Curated Tasting Experience & Multi-Brand Service Features) */}
      <NewInOurOfferSection />

      {/* 12. Festive Gigs Banner */}
      <FestiveGigsSection />

      {/* 13. Testimonial Story (GastroBar Reference Review Carousel with Botanical Linework) */}
      <TestimonialStorySection />

      {/* 14. Newsletter / Private Tasting Updates (Cream Paper & Air-mail Vector) */}
      <NewsletterSection />

      {/* 15. Complete 4-Column Editorial Footer */}
      <EditorialFooter />
    </div>
  );
}
