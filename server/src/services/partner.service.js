// Partner service — profile, dishes, dashboard
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get partner profile for the authenticated partner user
 */
export async function getPartnerProfile(userId) {
  const partner = await prisma.partner.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true, firstName: true, lastName: true, phone: true } },
      _count: { select: { dishes: true, orderItems: true } },
    },
  });
  if (!partner) throw new AppError('Partner profile not found', 404);
  return partner;
}

/**
 * Update partner profile
 */
export async function updatePartnerProfile(userId, data) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  return prisma.partner.update({
    where: { id: partner.id },
    data,
  });
}

/**
 * Get partner's dishes
 */
export async function getPartnerDishes(userId) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  return prisma.dish.findMany({
    where: { partnerId: partner.id },
    include: { category: true },
    orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
  });
}

/**
 * Create a dish for the partner
 */
export async function createPartnerDish(userId, data) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  return prisma.dish.create({
    data: {
      ...data,
      partnerId: partner.id,
    },
    include: { category: true },
  });
}

/**
 * Update a dish owned by the partner
 */
export async function updatePartnerDish(userId, dishId, data) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish || dish.partnerId !== partner.id) {
    throw new AppError('Dish not found or not owned by you', 404);
  }

  return prisma.dish.update({
    where: { id: dishId },
    data,
    include: { category: true },
  });
}

/**
 * Delete a dish owned by the partner
 */
export async function deletePartnerDish(userId, dishId) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish || dish.partnerId !== partner.id) {
    throw new AppError('Dish not found or not owned by you', 404);
  }

  return prisma.dish.delete({ where: { id: dishId } });
}

/**
 * Get partner dashboard summary
 */
export async function getPartnerDashboard(userId) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  const [totalDishes, activeDishes, pendingOrders, totalOrders, recentOrders] = await Promise.all([
    prisma.dish.count({ where: { partnerId: partner.id } }),
    prisma.dish.count({ where: { partnerId: partner.id, isAvailable: true } }),
    prisma.order.count({ where: { items: { some: { partnerId: partner.id } }, status: { in: ['SUBMITTED', 'PENDING_PARTNER'] } } }),
    prisma.order.count({ where: { items: { some: { partnerId: partner.id } } } }),
    prisma.order.findMany({
      where: { items: { some: { partnerId: partner.id } } },
      include: {
        items: { where: { partnerId: partner.id }, include: { dish: { select: { name: true } } } },
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Calculate total revenue from completed orders
  const completedItems = await prisma.orderItem.aggregate({
    where: { partnerId: partner.id, order: { status: 'COMPLETED' } },
    _sum: { totalPrice: true },
  });

  return {
    partner,
    stats: {
      totalDishes,
      activeDishes,
      pendingOrders,
      totalOrders,
      totalRevenue: completedItems._sum.totalPrice || 0,
    },
    recentOrders,
  };
}

/**
 * Get Analytics for Charts for a specific partner
 */
export async function getPartnerAnalytics(userId, days = 30) {
  const partner = await prisma.partner.findUnique({ where: { userId } });
  if (!partner) throw new AppError('Partner profile not found', 404);

  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const orderItems = await prisma.orderItem.findMany({
    where: { 
      partnerId: partner.id,
      createdAt: { gte: dateLimit } 
    },
    include: {
      order: { select: { status: true, createdAt: true } },
      dish: { select: { name: true } }
    }
  });

  // Simplify response for frontend aggregation
  const orders = orderItems.map(item => ({
    createdAt: item.createdAt,
    totalAmount: item.totalPrice,
    status: item.order.status,
    dishName: item.dish.name
  }));

  return { orders };
}
