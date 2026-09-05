// Order service — create, list, status transitions, partner management using DynamoDB Repositories
import {
  orderRepository,
  dishRepository,
  partnerRepository,
  userRepository,
  occasionRepository,
} from '../repositories/dynamodb/index.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

// Valid status transitions
export const VALID_TRANSITIONS = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['PENDING_PARTNER', 'ACCEPTED', 'CANCELLED'],
  PENDING_PARTNER: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  REJECTED: [],
  PREPARING: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
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
  const dishes = await dishRepository.findManyByIds(dishIds);

  if (dishes.length !== dishIds.length) {
    const foundIds = new Set(dishes.map(d => d.id));
    const missing = dishIds.filter(id => !foundIds.has(id));
    throw new AppError(`Some dishes are unavailable: ${missing.join(', ')}`, 400);
  }

  // Fetch partners to verify they are active & approved
  const partnerIds = [...new Set(dishes.map(d => d.partnerId))];
  const partnerMap = new Map();
  for (const pid of partnerIds) {
    const partner = await partnerRepository.findById(pid);
    if (!partner || partner.isApproved === false || partner.isActive === false) {
      throw new AppError(`Partner for dishes is not available or approved`, 400);
    }
    partnerMap.set(pid, partner);
  }

  // SERVER-SIDE price recalculation — NEVER trust client prices
  const dishMap = new Map(dishes.map(d => [d.id, d]));
  let totalAmount = 0;
  const orderItems = data.items.map(item => {
    const dish = dishMap.get(item.dishId);
    const partner = partnerMap.get(dish.partnerId);
    const pricePerHead = Number(dish.pricePerHead);
    const totalPrice = pricePerHead * item.quantity;
    totalAmount += totalPrice;
    return {
      dishId: item.dishId,
      partnerId: dish.partnerId,
      partner: { id: partner.id, businessName: partner.businessName },
      dish: { id: dish.id, name: dish.name, pricePerHead },
      quantity: item.quantity,
      pricePerHead,
      totalPrice,
    };
  });

  // Add 10% coordination fee
  const coordinationFee = Math.round(totalAmount * 0.10);
  totalAmount += coordinationFee;

  let occasion = null;
  if (data.occasionId) {
    occasion = await occasionRepository.findById(data.occasionId);
  }

  const order = await orderRepository.create({
    orderRef,
    userId,
    occasionId: data.occasionId || null,
    occasion: occasion ? { id: occasion.id, name: occasion.name } : null,
    guestCount: data.guestCount,
    budgetPerHead: data.budgetPerHead || null,
    dietaryType: data.dietaryType || 'ALL',
    totalAmount,
    status: 'SUBMITTED',
    paymentStatus: 'PENDING',
    paymentProvider: 'mock',
    eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : null,
    venueAddress: data.venueAddress || null,
    contactName: data.contactName,
    contactPhone: data.contactPhone || null,
    contactEmail: data.contactEmail || null,
    notes: data.notes || null,
    items: orderItems,
  });

  return order;
}

/**
 * Get orders for a customer
 */
export async function getUserOrders(userId, { page = 1, limit = 20 } = {}) {
  return orderRepository.findByUserId(userId, { page, limit });
}

/**
 * Get a single order by ID (with authorization check)
 */
export async function getOrderById(orderId, userId, role) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  // Authorization: customer can only see their own orders; partner only if their dishes are in the order
  if (role === 'CUSTOMER' && order.userId !== userId) {
    throw new AppError('Not authorized to view this order', 403);
  }
  if (role === 'PARTNER') {
    const partner = await partnerRepository.findByUserId(userId);
    const hasItems = order.items.some(item => (item.partnerId || item.partner?.id) === partner?.id);
    if (!hasItems) {
      throw new AppError('Not authorized to view this order', 403);
    }
  }

  // Enrich user info if not present
  if (!order.user && order.userId) {
    const user = await userRepository.findById(order.userId);
    if (user) {
      order.user = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
    }
  }

  return order;
}

/**
 * Update order status with transition validation
 */
export async function updateOrderStatus(orderId, newStatus, changedBy, note, role) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  // 1. Partner authorization & ownership validation
  if (role === 'PARTNER') {
    const partner = await partnerRepository.findByUserId(changedBy);
    const partnerOwnsItem = order.items.some(item => (item.partnerId || item.partner?.id) === partner?.id);
    if (!partnerOwnsItem) {
      throw new AppError('Not authorized to update an order containing no items from your kitchen', 403);
    }
    if (!['ACCEPTED', 'REJECTED', 'PREPARING', 'CONFIRMED', 'COMPLETED'].includes(newStatus)) {
      throw new AppError('Partners can only accept, reject, prepare, confirm, or complete orders', 403);
    }
  }

  // 2. Validate transition
  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (role !== 'ADMIN' && !allowed.includes(newStatus)) {
    throw new AppError(`Cannot transition from ${order.status} to ${newStatus}`, 400);
  }

  const updated = await orderRepository.updateStatus(orderId, newStatus, changedBy, note);
  return updated;
}

/**
 * Get orders for a partner (only orders containing their dishes)
 */
export async function getPartnerOrders(partnerId, { page = 1, limit = 20, status } = {}) {
  return orderRepository.findByPartnerId(partnerId, { page, limit, status });
}

/**
 * Get all orders (admin)
 */
export async function getAllOrders({ page = 1, limit = 20, status, search } = {}) {
  return orderRepository.listAll({ page, limit, status, search });
}
