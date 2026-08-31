// Catalog service — dishes, partners/brands, categories, occasions
import { prisma } from '../config/database.js';

/**
 * Get all approved & active partners (brands)
 */
export async function getPartners({ page = 1, limit = 50, search } = {}) {
  const where = { isApproved: true, isActive: true };
  if (search) {
    where.OR = [
      { businessName: { contains: search, mode: 'insensitive' } },
      { cuisine: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      include: {
        _count: { select: { dishes: { where: { isAvailable: true } } } },
      },
      orderBy: { businessName: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.partner.count({ where }),
  ]);

  return {
    partners: partners.map(p => ({
      id: p.id,
      businessName: p.businessName,
      tagline: p.tagline,
      description: p.description,
      cuisine: p.cuisine,
      whyWePicked: p.whyWePicked,
      established: p.established,
      logoUrl: p.logoUrl,
      serviceAreas: p.serviceAreas,
      dishCount: p._count.dishes,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single partner with all their available dishes
 */
export async function getPartnerWithDishes(partnerId) {
  const partner = await prisma.partner.findUnique({
    where: { id: partnerId },
    include: {
      dishes: {
        where: { isAvailable: true },
        include: { category: true },
        orderBy: { category: { sortOrder: 'asc' } },
      },
    },
  });
  return partner;
}

/**
 * Get all available dishes (optionally filtered)
 */
export async function getDishes({ page = 1, limit = 100, categoryId, partnerId, isVeg, search, minPrice, maxPrice } = {}) {
  const where = { isAvailable: true, partner: { isApproved: true, isActive: true } };
  if (categoryId) where.categoryId = categoryId;
  if (partnerId) where.partnerId = partnerId;
  if (isVeg !== undefined) where.isVeg = isVeg === 'true' || isVeg === true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice || maxPrice) {
    where.pricePerHead = {};
    if (minPrice) where.pricePerHead.gte = parseInt(minPrice);
    if (maxPrice) where.pricePerHead.lte = parseInt(maxPrice);
  }

  const [dishes, total] = await Promise.all([
    prisma.dish.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        partner: { select: { id: true, businessName: true, cuisine: true } },
      },
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dish.count({ where }),
  ]);

  return { dishes, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get all categories
 */
export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

/**
 * Get all cuisines
 */
export async function getCuisines() {
  return prisma.cuisine.findMany({ orderBy: { name: 'asc' } });
}

/**
 * Get all occasions
 */
export async function getOccasions() {
  return prisma.occasion.findMany({ orderBy: { name: 'asc' } });
}

/**
 * Get a single dish by ID
 */
export async function getDishById(dishId) {
  return prisma.dish.findUnique({
    where: { id: dishId },
    include: {
      category: true,
      partner: { select: { id: true, businessName: true, cuisine: true } },
    },
  });
}
