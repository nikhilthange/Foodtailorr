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

  async verifyPayment(paymentData) {
    const paymentId = typeof paymentData === 'string'
      ? paymentData
      : (paymentData?.razorpay_payment_id || paymentData?.paymentId || 'MOCK-PAY');
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

import crypto from 'crypto';
import Razorpay from 'razorpay';

class RazorpayProvider {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async initiatePayment(orderId, amount, currency = 'INR') {
    logger.info('Razorpay payment initiated', { orderId, amount, currency });
    try {
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest currency unit)
        currency,
        receipt: `rcpt_${orderId.substring(0, 30)}`,
      };
      const order = await this.razorpay.orders.create(options);
      
      return {
        paymentId: order.id,
        status: 'PROCESSING',
        redirectUrl: null,
      };
    } catch (error) {
      logger.error('Razorpay initiation failed', { error });
      throw new AppError('Payment initiation failed', 500);
    }
  }

  async verifyPayment(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    logger.info('Razorpay payment verified', { razorpay_order_id, razorpay_payment_id });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return {
        status: 'COMPLETED',
        transactionId: razorpay_payment_id,
      };
    } else {
      throw new AppError('Invalid payment signature', 400);
    }
  }

  async refundPayment(paymentId, amount) {
    logger.info('Razorpay refund initiated', { paymentId, amount });
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100),
      });
      return {
        status: 'REFUNDED',
        refundId: refund.id,
      };
    } catch (error) {
      logger.error('Razorpay refund failed', { error });
      throw new AppError('Payment refund failed', 500);
    }
  }
}

function getPaymentProvider() {
  switch (env.PAYMENT_PROVIDER) {
    case 'mock':
      return new MockPaymentProvider();
    case 'razorpay':
      return new RazorpayProvider();
    // Future: case 'stripe': return new StripeProvider();
    default:
      logger.warn(`Unknown payment provider: ${env.PAYMENT_PROVIDER}, falling back to mock`);
      return new MockPaymentProvider();
  }
}

export const paymentProvider = getPaymentProvider();
