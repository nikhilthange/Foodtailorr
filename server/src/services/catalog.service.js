// Catalog service — dishes, partners/brands, categories, occasions using DynamoDB Repositories
import {
  partnerRepository,
  dishRepository,
  categoryRepository,
  cuisineRepository,
  occasionRepository,
} from '../repositories/dynamodb/index.js';

/**
 * Get all approved & active partners (brands)
 */
export async function getPartners({ page = 1, limit = 50, search, cuisine, location } = {}) {
  const result = await partnerRepository.listApproved({ page, limit, search, cuisine, location });

  // Enrich with active dish counts
  const enriched = await Promise.all(
    result.partners.map(async (p) => {
      const dishes = await dishRepository.findByPartnerId(p.id, { availableOnly: true });
      return {
        id: p.id,
        businessName: p.businessName,
        slug: p.slug || p.id.replace(/^ptr_/, ''),
        tagline: p.tagline,
        description: p.description,
        cuisine: p.cuisine,
        location: p.location || 'Hyderabad',
        whyWePicked: p.whyWePicked,
        established: p.established,
        website: p.website,
        logoUrl: p.logoUrl,
        coverImageUrl: p.coverImageUrl,
        serviceAreas: p.serviceAreas || ['Hyderabad', 'Secunderabad'],
        verified: true,
        dishCount: dishes.length,
      };
    })
  );

  return {
    partners: enriched,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
}

/**
 * Get a single partner with all their available dishes
 */
export async function getPartnerWithDishes(partnerId) {
  const partner = await partnerRepository.findById(partnerId);
  if (!partner) return null;

  const [dishes, categories] = await Promise.all([
    dishRepository.findByPartnerId(partnerId, { availableOnly: true }),
    categoryRepository.listAll(),
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const enrichedDishes = dishes.map(d => {
    const cat = categoryMap.get(d.categoryId) || { id: d.categoryId, name: 'General', sortOrder: 99 };
    return {
      ...d,
      category: cat,
      categoryName: cat.name || 'General',
      partnerName: partner.businessName,
    };
  });

  enrichedDishes.sort((a, b) => (a.category?.sortOrder ?? 0) - (b.category?.sortOrder ?? 0));

  return {
    ...partner,
    dishes: enrichedDishes,
  };
}

/**
 * Get all available dishes (optionally filtered)
 */
export async function getDishes({ page = 1, limit = 100, categoryId, partnerId, isVeg, search, minPrice, maxPrice } = {}) {
  const result = await dishRepository.listCatalog({
    page,
    limit,
    categoryId,
    partnerId,
    isVeg,
    search,
    minPrice,
    maxPrice,
    availableOnly: true,
  });

  const [categories, partners] = await Promise.all([
    categoryRepository.listAll(),
    partnerRepository.listAll({ limit: 1000 }),
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const partnerMap = new Map(partners.partners.map(p => [p.id, p]));

  const enrichedDishes = result.dishes.map(d => {
    const p = partnerMap.get(d.partnerId);
    const cat = categoryMap.get(d.categoryId) || { id: d.categoryId, name: 'General' };
    return {
      ...d,
      category: cat,
      categoryName: cat.name || 'General',
      partner: p ? { id: p.id, businessName: p.businessName, cuisine: p.cuisine } : null,
      partnerName: p ? p.businessName : (d.partnerName || 'Heritage Atelier'),
    };
  });

  return {
    dishes: enrichedDishes,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
}

/**
 * Get all categories
 */
export async function getCategories() {
  return categoryRepository.listAll();
}

/**
 * Get all cuisines
 */
export async function getCuisines() {
  return cuisineRepository.listAll();
}

/**
 * Get all occasions
 */
export async function getOccasions() {
  return occasionRepository.listAll();
}

/**
 * Get a single dish by ID
 */
export async function getDishById(dishId) {
  const dish = await dishRepository.findById(dishId);
  if (!dish) return null;

  const [category, partner] = await Promise.all([
    dish.categoryId ? categoryRepository.findById(dish.categoryId) : null,
    dish.partnerId ? partnerRepository.findById(dish.partnerId) : null,
  ]);

  return {
    ...dish,
    category: category || { id: dish.categoryId, name: 'General' },
    partner: partner ? { id: partner.id, businessName: partner.businessName, cuisine: partner.cuisine } : null,
  };
}
