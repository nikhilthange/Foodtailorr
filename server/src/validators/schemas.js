// Zod validators for all request schemas
import { z } from 'zod';

// ─── Auth Validators ─────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'PARTNER']).default('CUSTOMER'),
  // Partner-specific fields (only when role === PARTNER)
  businessName: z.string().optional(),
  cuisine: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
}).refine(data => {
  if (data.role === 'PARTNER' && !data.businessName) {
    return false;
  }
  return true;
}, { message: 'Business name is required for partner registration', path: ['businessName'] });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// ─── Menu Builder / AI Validators ────────────────────

export const menuRecommendationSchema = z.object({
  occasionId: z.string().min(1).optional(),
  occasionName: z.string().optional(),
  guestCount: z.number().int().min(10, 'Minimum 10 guests required').max(5000),
  budgetPerHead: z.number().int().min(100).max(10000),
  dietaryType: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'ALL']).default('ALL'),
  spiceLevel: z.enum(['MILD', 'MEDIUM', 'SPICY', 'EXTRA_SPICY']).default('MEDIUM'),
  allergies: z.array(z.string()).default([]),
  cuisinePreferences: z.array(z.string()).default([]),
  dislikedIngredients: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
});

export const menuRefineSchema = z.object({
  recommendationId: z.string().min(1),
  action: z.enum([
    'make_vegetarian', 'reduce_budget', 'increase_premium',
    'add_desserts', 'kid_friendly', 'more_starters',
    'swap_dish', 'remove_dish', 'add_dish', 'regenerate',
  ]),
  dishId: z.string().min(1).optional(),
  replacementDishId: z.string().min(1).optional(),
  guestCount: z.number().int().min(10).optional(),
  budgetPerHead: z.number().int().min(100).optional(),
});

// ─── Order Validators ────────────────────────────────

export const createOrderSchema = z.object({
  occasionId: z.string().min(1).optional().nullable(),
  guestCount: z.number().int().min(10),
  budgetPerHead: z.number().int().optional(),
  dietaryType: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'ALL']).default('ALL'),
  eventDate: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  items: z.array(z.object({
    dishId: z.string().min(1),
    quantity: z.number().int().min(1),
  })).min(1, 'At least one dish is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'SUBMITTED', 'PENDING_PARTNER', 'ACCEPTED', 'REJECTED',
    'PREPARING', 'CONFIRMED', 'COMPLETED', 'CANCELLED',
  ]),
  note: z.string().max(500).optional(),
});

// ─── Saved Menu Validators ───────────────────────────

export const savedMenuSchema = z.object({
  name: z.string().min(1).max(200),
  occasionId: z.string().min(1).optional().nullable(),
  guestCount: z.number().int().min(10),
  items: z.array(z.object({
    dishId: z.string().min(1),
    quantity: z.number().int().min(1),
  })).min(1),
});

// ─── Partner Validators ──────────────────────────────

export const updatePartnerProfileSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  tagline: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  cuisine: z.string().max(100).optional(),
  whyWePicked: z.string().max(500).optional(),
  established: z.number().int().optional(),
  minOrderAmount: z.number().int().optional(),
  maxEventCapacity: z.number().int().optional(),
  serviceAreas: z.array(z.string()).optional(),
});

export const dishSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.string().min(1),
  description: z.string().max(1000).optional(),
  pricePerHead: z.number().int().min(1),
  isVeg: z.boolean().default(false),
  isSignature: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  servesMin: z.number().int().default(10),
  spiceLevel: z.enum(['MILD', 'MEDIUM', 'SPICY', 'EXTRA_SPICY']).default('MEDIUM'),
  allergens: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

// ─── Admin Validators ────────────────────────────────

export const adminUpdateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'PARTNER']).optional(),
});

export const adminUpdatePartnerSchema = z.object({
  isApproved: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// ─── Profile Validators ──────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
});

export const updatePreferencesSchema = z.object({
  dietaryType: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'ALL']).optional(),
  spiceLevel: z.enum(['MILD', 'MEDIUM', 'SPICY', 'EXTRA_SPICY']).optional(),
  allergies: z.array(z.string()).optional(),
  dislikedIngredients: z.array(z.string()).optional(),
  cuisinePreferences: z.array(z.string()).optional(),
});

// ─── Pagination ──────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});
