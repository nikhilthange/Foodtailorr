// Order service — create, list, status transitions, partner management
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

// Valid status transitions
const VALID_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['PENDING_PARTNER', 'CANCELLED'],
  PENDING_PARTNER: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  REJECTED: [],
  PREPARING: ['CONFIRMED'],
  CONFIRMED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Create a new order from validated items
 */
export async function createOrder(userId, data) {
  // Generate unique order reference
  const orderRef = `FT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  // Fetch all dishes to validate and calculate server-side pricing
  const dishIds = data.items.map(i => i.dishId);
  const dishes = await prisma.dish.findMany({
    where: { id: { in: dishIds }, isAvailable: true },
    include: { partner: { select: { id: true, isApproved: true, isActive: true } } },
  });

  if (dishes.length !== dishIds.length) {
    const foundIds = new Set(dishes.map(d => d.id));
    const missing = dishIds.filter(id => !foundIds.has(id));
    throw new AppError(`Some dishes are unavailable: ${missing.join(', ')}`, 400);
  }

  // Verify all partners are approved and active
  for (const dish of dishes) {
    if (!dish.partner.isApproved || !dish.partner.isActive) {
      throw new AppError(`Partner for dish "${dish.name}" is not available`, 400);
    }
  }

  // SERVER-SIDE price recalculation — NEVER trust client prices
  const dishMap = new Map(dishes.map(d => [d.id, d]));
  let totalAmount = 0;
  const orderItems = data.items.map(item => {
    const dish = dishMap.get(item.dishId);
    const pricePerHead = dish.pricePerHead;
    const totalPrice = pricePerHead * item.quantity;
    totalAmount += totalPrice;
    return {
      dishId: item.dishId,
      partnerId: dish.partner.id,
      quantity: item.quantity,
      pricePerHead,
      totalPrice,
    };
  });

  // Add 10% coordination fee
  const coordinationFee = Math.round(totalAmount * 0.10);
  totalAmount += coordinationFee;

  const order = await prisma.order.create({
    data: {
      orderRef,
      userId,
      occasionId: data.occasionId || null,
      guestCount: data.guestCount,
      budgetPerHead: data.budgetPerHead || null,
      dietaryType: data.dietaryType || 'ALL',
      totalAmount,
      status: 'SUBMITTED',
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      venueAddress: data.venueAddress || null,
      contactName: data.contactName,
      contactPhone: data.contactPhone || null,
      contactEmail: data.contactEmail || null,
      notes: data.notes || null,
      items: { create: orderItems },
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: 'SUBMITTED',
          changedBy: userId,
          note: 'Order submitted',
        },
      },
    },
    include: {
      items: { include: { dish: true, partner: { select: { id: true, businessName: true } } } },
      occasion: true,
    },
  });

  return order;
}

/**
 * Get orders for a customer
 */
export async function getUserOrders(userId, { page = 1, limit = 20 } = {}) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            dish: { select: { id: true, name: true } },
            partner: { select: { id: true, businessName: true } },
          },
        },
        occasion: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get a single order by ID (with authorization check)
 */
export async function getOrderById(orderId, userId, role) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          dish: true,
          partner: { select: { id: true, businessName: true } },
        },
      },
      occasion: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  if (!order) throw new AppError('Order not found', 404);

  // Authorization: customer can only see their own orders
  if (role === 'CUSTOMER' && order.userId !== userId) {
    throw new AppError('Not authorized to view this order', 403);
  }

  return order;
}

/**
 * Update order status with transition validation
 */
export async function updateOrderStatus(orderId, newStatus, changedBy, note, role) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { partner: true } } },
  });

  if (!order) throw new AppError('Order not found', 404);

  // Validate transition
  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(`Cannot transition from ${order.status} to ${newStatus}`, 400);
  }

  // Partner can only accept/reject their own orders
  if (role === 'PARTNER') {
    if (!['ACCEPTED', 'REJECTED', 'PREPARING', 'CONFIRMED'].includes(newStatus)) {
      throw new AppError('Partners can only accept, reject, prepare, or confirm orders', 403);
    }
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      statusHistory: {
        create: {
          fromStatus: order.status,
          toStatus: newStatus,
          changedBy,
          note: note || `Status changed to ${newStatus}`,
        },
      },
    },
    include: {
      items: { include: { dish: true, partner: { select: { id: true, businessName: true } } } },
      occasion: true,
      statusHistory: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });

  return updated;
}

/**
 * Get orders for a partner (only orders containing their dishes)
 */
export async function getPartnerOrders(partnerId, { page = 1, limit = 20, status } = {}) {
  const where = { items: { some: { partnerId } } };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          where: { partnerId },
          include: { dish: { select: { id: true, name: true, pricePerHead: true } } },
        },
        occasion: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders({ page = 1, limit = 20, status, search } = {}) {
  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderRef: { contains: search, mode: 'insensitive' } },
      { contactName: { contains: search, mode: 'insensitive' } },
      { contactEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        occasion: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
}
