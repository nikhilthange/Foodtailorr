// Admin service — user management, partner approval, catalog, analytics
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Admin dashboard summary
 */
export async function getDashboard() {
  const [totalUsers, totalPartners, pendingPartners, totalOrders, pendingOrders, totalDishes, recentOrders, totalRecommendations] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.partner.count(),
    prisma.partner.count({ where: { isApproved: false } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['SUBMITTED', 'PENDING_PARTNER'] } } }),
    prisma.dish.count(),
    prisma.order.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } }, occasion: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.aIRecommendation.count(),
  ]);

  const revenue = await prisma.order.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true },
  });

  return {
    stats: {
      totalUsers,
      totalPartners,
      pendingPartners,
      totalOrders,
      pendingOrders,
      totalDishes,
      totalRecommendations,
      totalRevenue: revenue._sum.totalAmount || 0,
    },
    recentOrders,
  };
}

/**
 * List all users with pagination
 */
export async function getUsers({ page = 1, limit = 20, search, role } = {}) {
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Update user status or role
 */
export async function updateUser(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
  });
}

/**
 * Soft delete / deactivate user
 */
export async function deleteUser(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: { id: true, isActive: true },
  });
}

/**
 * List all partners with pagination
 */
export async function getAllPartners({ page = 1, limit = 20, search, approved } = {}) {
  const where = {};
  if (approved !== undefined) where.isApproved = approved === 'true' || approved === true;
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
        user: { select: { email: true, firstName: true, lastName: true } },
        _count: { select: { dishes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.partner.count({ where }),
  ]);

  return { partners, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Update partner approval status
 */
export async function updatePartner(partnerId, data) {
  return prisma.partner.update({
    where: { id: partnerId },
    data,
    include: { user: { select: { email: true, firstName: true, lastName: true } } },
  });
}

/**
 * Admin CRUD for categories
 */
export async function createCategory(name, sortOrder = 0) {
  return prisma.category.create({ data: { name, sortOrder } });
}

export async function updateCategory(id, data) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id) {
  const dishCount = await prisma.dish.count({ where: { categoryId: id } });
  if (dishCount > 0) throw new AppError('Cannot delete category with existing dishes', 400);
  return prisma.category.delete({ where: { id } });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

/**
 * Admin CRUD for dishes
 */
export async function getDishes({ page = 1, limit = 20, search } = {}) {
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [dishes, total] = await Promise.all([
    prisma.dish.findMany({
      where,
      include: { category: true, partner: { select: { businessName: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dish.count({ where }),
  ]);

  return { dishes, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createDish(data) {
  return prisma.dish.create({ data });
}

export async function updateDish(id, data) {
  return prisma.dish.update({ where: { id }, data });
}

export async function deleteDish(id) {
  return prisma.dish.delete({ where: { id } });
}

/**
 * Admin CRUD for cuisines
 */
export async function createCuisine(name, description) {
  return prisma.cuisine.create({ data: { name, description } });
}

/**
 * Admin CRUD for occasions
 */
export async function createOccasion(data) {
  return prisma.occasion.create({ data });
}

export async function updateOccasion(id, data) {
  return prisma.occasion.update({ where: { id }, data });
}

/**
 * Get AI recommendation logs
 */
export async function getAILogs({ page = 1, limit = 20 } = {}) {
  const [logs, total] = await Promise.all([
    prisma.aIRecommendation.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.aIRecommendation.count(),
  ]);

  return { logs, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get Analytics for Charts
 */
export async function getAnalytics(days = 30) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: dateLimit } },
    select: { createdAt: true, totalAmount: true, status: true }
  });

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: dateLimit }, role: 'CUSTOMER' },
    select: { createdAt: true }
  });

  return { orders, users };
}
