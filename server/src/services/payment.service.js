// Payment service — abstraction layer with mock provider for MVP
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Payment provider interface:
 * - initiatePayment(orderId, amount, currency) → { paymentId, status, redirectUrl? }
 * - verifyPayment(paymentId) → { status, transactionId }
 * - refundPayment(paymentId, amount) → { status, refundId }
 */

class MockPaymentProvider {
  async initiatePayment(orderId, amount, currency = 'INR') {
    logger.info('Mock payment initiated', { orderId, amount, currency });
    return {
      paymentId: `MOCK-PAY-${Date.now().toString(36).toUpperCase()}`,
      status: 'PROCESSING',
      redirectUrl: null,
      message: '⚠️ DEVELOPMENT MOCK — no real payment processed',
    };
  }

  async verifyPayment(paymentId) {
    logger.info('Mock payment verified', { paymentId });
    return {
      status: 'COMPLETED',
      transactionId: `MOCK-TXN-${Date.now().toString(36).toUpperCase()}`,
      message: '⚠️ DEVELOPMENT MOCK — auto-verified',
    };
  }

  async refundPayment(paymentId, amount) {
    logger.info('Mock refund processed', { paymentId, amount });
    return {
      status: 'REFUNDED',
      refundId: `MOCK-REF-${Date.now().toString(36).toUpperCase()}`,
    };
  }
}

function getPaymentProvider() {
  switch (env.PAYMENT_PROVIDER) {
    case 'mock':
      return new MockPaymentProvider();
    // Future: case 'razorpay': return new RazorpayProvider();
    // Future: case 'stripe': return new StripeProvider();
    default:
      logger.warn(`Unknown payment provider: ${env.PAYMENT_PROVIDER}, falling back to mock`);
      return new MockPaymentProvider();
  }
}

export const paymentProvider = getPaymentProvider();
