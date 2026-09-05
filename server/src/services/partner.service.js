// Partner service — profile, dishes, dashboard using DynamoDB Repositories
import {
  partnerRepository,
  dishRepository,
  orderRepository,
  userRepository,
  categoryRepository,
} from '../repositories/dynamodb/index.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get partner profile for the authenticated partner user
 */
export async function getPartnerProfile(userId) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const [user, dishes, orders] = await Promise.all([
    userRepository.findById(userId),
    dishRepository.findByPartnerId(partner.id),
    orderRepository.findByPartnerId(partner.id),
  ]);

  return {
    ...partner,
    user: user ? { email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone } : null,
    _count: {
      dishes: dishes.length,
      orderItems: orders.total,
    },
  };
}

/**
 * Update partner profile
 */
export async function updatePartnerProfile(userId, data) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  return partnerRepository.update(partner.id, data);
}

/**
 * Get partner's dishes
 */
export async function getPartnerDishes(userId) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const [dishes, categories] = await Promise.all([
    dishRepository.findByPartnerId(partner.id),
    categoryRepository.listAll(),
  ]);

  const catMap = new Map(categories.map(c => [c.id, c]));

  const enriched = dishes.map(d => ({
    ...d,
    category: catMap.get(d.categoryId) || { id: d.categoryId, name: 'General' },
  }));

  enriched.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return enriched;
}

/**
 * Create a dish for the partner
 */
export async function createPartnerDish(userId, data) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dish = await dishRepository.create({
    ...data,
    partnerId: partner.id,
  });

  const category = data.categoryId ? await categoryRepository.findById(data.categoryId) : null;
  return {
    ...dish,
    category: category || { id: data.categoryId, name: 'General' },
  };
}

/**
 * Update a dish owned by the partner
 */
export async function updatePartnerDish(userId, dishId, data) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dish = await dishRepository.findById(dishId);
  if (!dish || dish.partnerId !== partner.id) {
    throw new AppError('Dish not found or not owned by you', 404);
  }

  const updated = await dishRepository.update(dishId, data, partner.id);
  const category = updated.categoryId ? await categoryRepository.findById(updated.categoryId) : null;

  return {
    ...updated,
    category: category || { id: updated.categoryId, name: 'General' },
  };
}

/**
 * Delete a dish owned by the partner
 */
export async function deletePartnerDish(userId, dishId) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dish = await dishRepository.findById(dishId);
  if (!dish || dish.partnerId !== partner.id) {
    throw new AppError('Dish not found or not owned by you', 404);
  }

  return dishRepository.delete(dishId, partner.id);
}

/**
 * Get partner dashboard summary
 */
export async function getPartnerDashboard(userId) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const [dishes, ordersResult, totalRevenue] = await Promise.all([
    dishRepository.findByPartnerId(partner.id),
    orderRepository.findByPartnerId(partner.id, { limit: 1000 }),
    orderRepository.aggregateCompletedRevenue(partner.id),
  ]);

  const activeDishes = dishes.filter(d => d.isAvailable !== false).length;
  const pendingOrders = ordersResult.orders.filter(o => ['SUBMITTED', 'PENDING_PARTNER'].includes(o.status)).length;
  const recentOrders = ordersResult.orders.slice(0, 5);

  return {
    partner,
    stats: {
      totalDishes: dishes.length,
      activeDishes,
      pendingOrders,
      totalOrders: ordersResult.total,
      totalRevenue,
    },
    recentOrders,
  };
}

/**
 * Get Analytics for Charts for a specific partner
 */
export async function getPartnerAnalytics(userId, days = 30) {
  const partner = await partnerRepository.findByUserId(userId);
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const ordersResult = await orderRepository.findByPartnerId(partner.id, { limit: 1000 });
  const recent = ordersResult.orders.filter(o => new Date(o.createdAt) >= dateLimit);

  const orders = [];
  for (const o of recent) {
    const partnerItems = (o.items || []).filter(i => (i.partnerId || i.partner?.id) === partner.id);
    for (const item of partnerItems) {
      orders.push({
        createdAt: o.createdAt,
        totalAmount: item.totalPrice || (item.pricePerHead * item.quantity),
        status: o.status,
        dishName: item.dish?.name || 'Dish',
      });
    }
  }

  return { orders };
}
