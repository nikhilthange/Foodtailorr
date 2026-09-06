'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { AlertCircle, CheckCircle2, CreditCard, RefreshCw, ChevronLeft, ShieldCheck, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { OrderTrackingTimelineSketch, PaymentShieldSketch } from '../components/ui/svg/PlatformSketches';

const TIMELINE_STEPS = [
  { key: 'CREATED', label: 'CREATED', desc: 'Requirements recorded and banquet folio initialized.' },
  { key: 'PAYMENT_PENDING', label: 'PAYMENT PENDING', desc: 'Awaiting host commission payment confirmation.' },
  { key: 'PAYMENT_VERIFIED', label: 'PAYMENT VERIFIED', desc: 'Payment verified and kitchen slots reserved.' },
  { key: 'PARTNER_ACCEPTED', label: 'PARTNER ACCEPTED', desc: 'Partner ateliers confirmed batch allocations.' },
  { key: 'PREPARING', label: 'PREPARING', desc: 'Slow-simmered preparations active in copper deghs.' },
  { key: 'READY', label: 'READY', desc: 'Quality audited and sealed in thermal carriers.' },
  { key: 'COMPLETED', label: 'COMPLETED', desc: 'Delivered to venue and banquet staged.' },
];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order', err);
      setError('Order not found or session expired');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  const handlePay = async () => {
    setPaying(true);
    setPaymentError(null);
    try {
      const paymentResponse = await api.payOrder(id);
      const paymentData = paymentResponse.data || paymentResponse;

      const verifyRes = await api.verifyPayment(id, {
        razorpay_order_id: paymentData.orderId || `MOCK-${Date.now()}`,
        razorpay_payment_id: `MOCK-TXN-${Date.now().toString(36).toUpperCase()}`,
        razorpay_signature: 'mock-verified',
      });

      setPaymentSuccess(true);
      if (verifyRes.data) {
        setOrder(verifyRes.data);
      } else {
        await fetchOrder();
      }
    } catch (err) {
      console.error('Payment failed', err);
      setPaymentError(err.response?.data?.error || 'Payment could not be processed. Please retry.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-slate-500">Loading Atelier Reservation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mb-3" />
        <h2 className="font-serif font-bold text-xl text-slate-900 mb-1">Reservation Notice</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'Order could not be located.'}</p>
        <Link
          to="/dashboard"
          className="btn-primary px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider"
        >
          Return to My Tastings
        </Link>
      </div>
    );
  }

  const getTimelineLevel = (status, paymentStatus) => {
    if (status === 'COMPLETED') return 7;
    if (status === 'CONFIRMED' || status === 'READY') return 6;
    if (status === 'PREPARING') return 5;
    if (status === 'ACCEPTED') return 4;
    if (paymentStatus === 'COMPLETED' || status === 'PENDING_PARTNER') return 3;
    if (paymentStatus !== 'COMPLETED') return 2;
    return 1;
  };

  const currentLevel = getTimelineLevel(order.status, order.paymentStatus);
  const subtotal = order.items?.reduce((sum, item) => sum + (item.totalPrice || item.pricePerHead * item.quantity), 0) || Math.round(order.totalAmount / 1.1);
  const charges = Math.round(subtotal * 0.1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-forest hover:text-brand-terracotta transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Tastings</span>
        </Link>

        {/* Success Alert */}
        {paymentSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-between border border-emerald-200 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm">Commission Secured & Paid</h3>
                <p className="text-xs text-emerald-700">Payment verified. Kitchen production tickets issued to partner ateliers.</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Order Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-card-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-brand-terracotta"></span>
                <span className="text-xs uppercase tracking-widest text-brand-terracotta font-bold">
                  Bespoke Atelier Commission
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
                {order.orderRef}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reserved on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-brand-forest/10 text-brand-forest border border-brand-forest/20'
              }`}>
                {order.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.paymentStatus === 'COMPLETED'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-brand-terracotta/15 text-brand-terracotta border border-brand-terracotta/30'
              }`}>
                {order.paymentStatus === 'COMPLETED' ? 'PAYMENT VERIFIED' : 'PAYMENT PENDING'}
              </span>
            </div>
          </div>

          {/* Key Logistics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Occasion</span>
              <p className="font-bold text-slate-900 mt-1 capitalize font-serif">{order.occasionId || 'Banquet Gathering'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Event Date</span>
              <p className="font-bold text-slate-900 mt-1 font-serif">
                {new Date(order.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Guest Count</span>
              <p className="font-bold text-slate-900 mt-1 font-serif">{order.guestCount} Covers</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
              <p className="font-bold text-brand-forest mt-1 text-sm font-serif">
                ₹{order.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Host & Venue Details */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-brand-terracotta uppercase tracking-wider text-[10px] block">Host & Contact</span>
              <p className="text-slate-900 font-semibold mt-0.5">{order.contactName} • {order.contactPhone}</p>
              <p className="text-slate-500">{order.contactEmail}</p>
            </div>
            <div>
              <span className="font-bold text-brand-terracotta uppercase tracking-wider text-[10px] block">Event Venue Address</span>
              <p className="text-slate-900 font-semibold mt-0.5">{order.venueAddress}</p>
              {order.notes && <p className="text-slate-500 italic mt-1 font-serif">"{order.notes}"</p>}
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-card-soft">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-brand-terracotta" />
            <h2 className="font-serif font-bold text-xl text-slate-900">
              Order Status Timeline
            </h2>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:border-l-2 before:border-dashed before:border-slate-200">
            {TIMELINE_STEPS.map((step, idx) => {
              const stepLevel = idx + 1;
              const isPast = currentLevel > stepLevel;
              const isCurrent = currentLevel === stepLevel;
              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                      isPast
                        ? 'bg-brand-forest text-white shadow-sm'
                        : isCurrent
                        ? 'bg-brand-terracotta text-white ring-4 ring-brand-terracotta/20 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : stepLevel}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-brand-terracotta' : isPast ? 'text-brand-forest' : 'text-slate-400'}`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-slate-500 font-light mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment UI */}
        {order.paymentStatus !== 'COMPLETED' && (
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-brand-terracotta/40 bg-orange-50/40 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-orange-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-brand-terracotta" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Commission Payment Outstanding
                  </h3>
                  <p className="text-xs text-slate-500">
                    Secure production locks with partner kitchens. Development environment uses instant mock verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Dishes Subtotal ({order.items?.length || 0} Courses)</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Atelier Coordination & Packaging Charges (10%)</span>
                <span className="font-semibold text-brand-terracotta">₹{charges.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-orange-200/60 flex justify-between items-baseline">
                <span className="font-serif font-bold text-sm text-slate-900">Total Payable</span>
                <span className="font-display text-2xl font-bold text-brand-forest">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Failure state alert */}
            {paymentError && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Payment CTA */}
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full btn-accent py-4 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {paying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment Authorization...</span>
                </>
              ) : paymentError ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Payment (₹{order.totalAmount?.toLocaleString()})</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize & Pay ₹{order.totalAmount?.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Ordered Courses Breakdown */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/80 bg-white shadow-card-soft">
          <h2 className="font-serif font-bold text-lg text-slate-900 mb-4">
            Curated Menu Selections ({order.items?.length || 0} Courses)
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dish?.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                    <span className="font-serif font-bold text-slate-900 text-sm">
                      {item.dish?.name || item.name || 'Artisanal Selection'}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-terracotta font-medium block mt-0.5">
                    Atelier: {item.partner?.businessName || item.partnerName || 'Specialty House'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    ₹{item.totalPrice?.toLocaleString() || (item.pricePerHead * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-light">
                    ({item.quantity} covers @ ₹{item.pricePerHead})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-baseline">
            <span className="font-serif font-bold text-sm text-slate-900">Total Commission Amount</span>
            <span className="font-display text-2xl font-bold text-brand-forest">
              ₹{order.totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
