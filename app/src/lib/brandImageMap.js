/**
 * Centralized Brand & Dish Image Resolver for Food Tailor
 * Ensures 100% visual consistency across all pages (Explore, Home, Partners, Menus, Occasions).
 * Prevents random external placeholders or mismatched photos from ever appearing.
 */

export const BRAND_COVERS = {
  'cafe-niloufer': '/dishes/cafe-niloufer-chai-bun.jpg',
  'hotel-shadab': '/dishes/shadab-kaju-paneer-biryani.png',
  'samosa-king': '/dishes/samosa-king-gourmet.jpg',
  'thick-shake-factory': '/dishes/thick-shake-boba.jpg',
  'ice-berg': '/dishes/ice-berg-gelato-cup.jpg',
  'maharaja-chaat': '/dishes/maharaja-chaat-bowl.jpg',
  'dimmy-pan-palace': '/dishes/dimmy-meetha-paan.jpg',
  'the-chocolate-room': '/dishes/chocolate-room-latte.jpg',
  'almond-house': '/dishes/almond-house-mithai.jpg',
  'manam-chocolate': '/dishes/manam-craft-truffles.jpg',
  'karachi-bakery': '/dishes/karachi-bakery-biscuits.jpg',
};

export const BRAND_LOGOS = {
  'cafe-niloufer': '/brands/cafe-niloufer.png',
};

/**
 * Resolves the authentic, signature cover photo for any partner/brand entity.
 */
export function getPartnerCoverImage(partner) {
  if (!partner) return '/dishes/shadab-kaju-paneer-biryani.png';

  const slug = (partner.slug || partner.id?.replace('ptr_', '') || '').toLowerCase();
  if (slug && BRAND_COVERS[slug]) {
    return BRAND_COVERS[slug];
  }

  const name = (partner.businessName || partner.name || '').toLowerCase();
  if (name.includes('almond house') || name.includes('almond')) return '/dishes/almond-house-mithai.jpg';
  if (name.includes('niloufer')) return '/dishes/cafe-niloufer-chai-bun.jpg';
  if (name.includes('shadab')) return '/dishes/shadab-kaju-paneer-biryani.png';
  if (name.includes('dimmy') || name.includes('dummies') || name.includes('paan')) return '/dishes/dimmy-meetha-paan.jpg';
  if (name.includes('samosa')) return '/dishes/samosa-king-gourmet.jpg';
  if (name.includes('thick shake') || name.includes('shake factory')) return '/dishes/thick-shake-boba.jpg';
  if (name.includes('ice berg') || name.includes('iceberg')) return '/dishes/ice-berg-gelato-cup.jpg';
  if (name.includes('maharaja') || name.includes('chaat')) return '/dishes/maharaja-chaat-bowl.jpg';
  if (name.includes('chocolate room')) return '/dishes/chocolate-room-latte.jpg';
  if (name.includes('manam')) return '/dishes/manam-craft-truffles.jpg';
  if (name.includes('karachi')) return '/dishes/karachi-bakery-biscuits.jpg';

  // If already a valid local path, keep it
  if (partner.coverImageUrl && partner.coverImageUrl.startsWith('/') && !partner.coverImageUrl.includes('unsplash')) {
    return partner.coverImageUrl;
  }

  return '/dishes/shadab-kaju-paneer-biryani.png';
}

/**
 * Resolves authentic image for any dish by name or partner.
 */
export function getDishImage(dish) {
  if (!dish) return '/dishes/shadab-kaju-paneer-biryani.png';
  if (dish.imageUrl && dish.imageUrl.startsWith('/') && !dish.imageUrl.includes('unsplash')) {
    return dish.imageUrl;
  }
  if (dish.image && dish.image.startsWith('/') && !dish.image.includes('unsplash')) {
    return dish.image;
  }

  const name = (dish.name || dish.title || '').toLowerCase();
  if (name.includes('chai') || name.includes('maskabun') || name.includes('bun')) return '/dishes/cafe-niloufer-chai-bun.jpg';
  if (name.includes('samosa')) return '/dishes/samosa-king-gourmet.jpg';
  if (name.includes('halwa') || name.includes('mithai') || name.includes('jamun') || name.includes('kaju roll') || name.includes('sweet')) return '/dishes/almond-house-mithai.jpg';
  if (name.includes('paan') || name.includes('meetha')) return '/dishes/dimmy-meetha-paan.jpg';
  if (name.includes('tikka') || name.includes('tandoori') || name.includes('kebab') || name.includes('65')) return '/dishes/shadab-tandoori-chicken-tikka.jpg';
  if (name.includes('biryani') || name.includes('dum') || name.includes('haleem') || name.includes('marag')) return '/dishes/shadab-kaju-paneer-biryani.png';
  if (name.includes('gelato') || name.includes('ice cream') || name.includes('sitaphal') || name.includes('kulfi')) return '/dishes/ice-berg-gelato-cup.jpg';
  if (name.includes('chaat') || name.includes('puri') || name.includes('bhel')) return '/dishes/maharaja-chaat-bowl.jpg';
  if (name.includes('truffle') || name.includes('cacao') || name.includes('bonbon')) return '/dishes/manam-craft-truffles.jpg';
  if (name.includes('fondue') || name.includes('chocolate')) return '/dishes/chocolate-room-latte.jpg';
  if (name.includes('biscuit') || name.includes('osmania') || name.includes('bake')) return '/dishes/karachi-bakery-biscuits.jpg';
  if (name.includes('shake') || name.includes('boba')) return '/dishes/thick-shake-boba.jpg';

  const partner = (dish.partnerName || dish.partner || '').toLowerCase();
  if (partner.includes('niloufer')) return '/dishes/cafe-niloufer-chai-bun.jpg';
  if (partner.includes('almond')) return '/dishes/almond-house-mithai.jpg';
  if (partner.includes('dimmy')) return '/dishes/dimmy-meetha-paan.jpg';
  if (partner.includes('shadab')) return '/dishes/shadab-kaju-paneer-biryani.png';
  if (partner.includes('samosa')) return '/dishes/samosa-king-gourmet.jpg';
  if (partner.includes('ice berg')) return '/dishes/ice-berg-gelato-cup.jpg';
  if (partner.includes('maharaja')) return '/dishes/maharaja-chaat-bowl.jpg';
  if (partner.includes('manam')) return '/dishes/manam-craft-truffles.jpg';
  if (partner.includes('karachi')) return '/dishes/karachi-bakery-biscuits.jpg';
  if (partner.includes('shake')) return '/dishes/thick-shake-boba.jpg';

  return '/dishes/shadab-kaju-paneer-biryani.png';
}
