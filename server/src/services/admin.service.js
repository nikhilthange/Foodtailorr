// Admin service — user management, partner approval, catalog, analytics using DynamoDB Repositories
import {
  userRepository,
  partnerRepository,
  dishRepository,
  categoryRepository,
  cuisineRepository,
  occasionRepository,
  orderRepository,
  aiRepository,
} from '../repositories/dynamodb/index.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Admin dashboard summary
 */
export async function getDashboard() {
  const [
    totalUsers,
    totalPartners,
    pendingPartners,
    ordersResult,
    totalDishes,
    totalRecommendations,
    totalRevenue,
  ] = await Promise.all([
    userRepository.countUsers({ role: 'CUSTOMER' }),
    partnerRepository.count(),
    partnerRepository.count({ isApproved: false }),
    orderRepository.listAll({ limit: 1000 }),
    dishRepository.count(),
    aiRepository.count(),
    orderRepository.aggregateCompletedRevenue(),
  ]);

  const totalOrders = ordersResult.total;
  const pendingOrders = ordersResult.orders.filter(o => ['SUBMITTED', 'PENDING_PARTNER'].includes(o.status)).length;
  const recentOrders = ordersResult.orders.slice(0, 10);

  return {
    stats: {
      totalUsers,
      totalPartners,
      pendingPartners,
      totalOrders,
      pendingOrders,
      totalDishes,
      totalRecommendations,
      totalRevenue,
    },
    recentOrders,
  };
}

/**
 * List all users with pagination
 */
export async function getUsers({ page = 1, limit = 20, search, role } = {}) {
  return userRepository.listUsers({ page, limit, search, role });
}

/**
 * Update user status or role
 */
export async function updateUser(userId, data) {
  return userRepository.update(userId, data);
}

/**
 * Soft delete / deactivate user
 */
export async function deleteUser(userId) {
  return userRepository.update(userId, { isActive: false });
}

/**
 * List all partners with pagination
 */
export async function getAllPartners({ page = 1, limit = 20, search, approved } = {}) {
  const result = await partnerRepository.listAll({ page, limit, search, approved });

  // Enrich with user email/name and dish count
  const enriched = await Promise.all(
    result.partners.map(async (p) => {
      const [user, dishes] = await Promise.all([
        p.userId ? userRepository.findById(p.userId) : null,
        dishRepository.findByPartnerId(p.id),
      ]);

      return {
        ...p,
        user: user ? { email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
        _count: { dishes: dishes.length },
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
 * Update partner approval status
 */
export async function updatePartner(partnerId, data) {
  const updated = await partnerRepository.update(partnerId, data);
  const user = updated.userId ? await userRepository.findById(updated.userId) : null;

  return {
    ...updated,
    user: user ? { email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
  };
}

/**
 * Admin CRUD for categories
 */
export async function createCategory(name, sortOrder = 0) {
  return categoryRepository.create({ name, sortOrder });
}

export async function updateCategory(id, data) {
  return categoryRepository.update(id, data);
}

export async function deleteCategory(id) {
  const catalog = await dishRepository.listCatalog({ categoryId: id, limit: 10 });
  if (catalog.total > 0) {
    throw new AppError('Cannot delete category with existing dishes', 400);
  }
  return categoryRepository.delete(id);
}

export async function getCategories() {
  return categoryRepository.listAll();
}

/**
 * Admin CRUD for dishes
 */
export async function getDishes({ page = 1, limit = 20, search } = {}) {
  const result = await dishRepository.listCatalog({ page, limit, search, availableOnly: false });

  const [categories, partners] = await Promise.all([
    categoryRepository.listAll(),
    partnerRepository.listAll({ limit: 1000 }),
  ]);

  const catMap = new Map(categories.map(c => [c.id, c]));
  const ptrMap = new Map(partners.partners.map(p => [p.id, p]));

  const enriched = result.dishes.map(d => ({
    ...d,
    category: catMap.get(d.categoryId) || { id: d.categoryId, name: 'General' },
    partner: ptrMap.get(d.partnerId) ? { businessName: ptrMap.get(d.partnerId).businessName } : null,
  }));

  return {
    dishes: enriched,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
}

export async function createDish(data) {
  return dishRepository.create(data);
}

export async function updateDish(id, data) {
  return dishRepository.update(id, data);
}

export async function deleteDish(id) {
  return dishRepository.delete(id);
}

/**
 * Admin CRUD for cuisines
 */
export async function createCuisine(name, description) {
  return cuisineRepository.create({ name, description });
}

/**
 * Admin CRUD for occasions
 */
export async function createOccasion(data) {
  return occasionRepository.create(data);
}

export async function updateOccasion(id, data) {
  return occasionRepository.update(id, data);
}

/**
 * Get AI recommendation logs
 */
export async function getAILogs({ page = 1, limit = 20 } = {}) {
  return aiRepository.listLogs({ page, limit });
}

/**
 * Get Analytics for Charts
 */
export async function getAnalytics(days = 30) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const [ordersRes, usersRes] = await Promise.all([
    orderRepository.listAll({ limit: 1000 }),
    userRepository.listUsers({ role: 'CUSTOMER', limit: 1000 }),
  ]);

  const orders = ordersRes.orders
    .filter(o => new Date(o.createdAt) >= dateLimit)
    .map(o => ({
      createdAt: o.createdAt,
      totalAmount: o.totalAmount,
      status: o.status,
    }));

  const users = usersRes.users
    .filter(u => new Date(u.createdAt) >= dateLimit)
    .map(u => ({
      createdAt: u.createdAt,
    }));

  return { orders, users };
}
