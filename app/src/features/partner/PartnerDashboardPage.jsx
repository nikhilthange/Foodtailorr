'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '../../lib/navigation';
import { api } from '../../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import StatCard from '../../components/ui/StatCard';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import {
  Inbox,
  CheckCircle2,
  Utensils,
  Users,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { KitchenAtelierSketch } from '../../components/ui/svg/PlatformSketches';

export default function PartnerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadPartnerData = useCallback(async () => {
    try {
      const [profileRes, ordersRes, dishesRes, onboardingRes] = await Promise.all([
        api.getPartnerProfile().catch(() => null),
        api.getPartnerOrders().catch(() => ({ orders: [] })),
        api.getPartnerDishes().catch(() => []),
        api.getOnboardingStatus().catch(() => null),
      ]);

      setProfile(profileRes);
      setOrders(ordersRes.orders || ordersRes || []);
      setDishes(dishesRes || []);
      setOnboardingStatus(onboardingRes);
    } catch (err) {
      console.error('Failed to load partner portal data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPartnerData();
  }, [loadPartnerData]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updatePartnerOrderStatus(
        orderId,
        newStatus,
        `Updated by ${profile?.businessName || 'Partner'}`
      );
      showToast(`Order status transitioned to ${newStatus}`);
      await loadPartnerData();
    } catch (err) {
      console.error('Failed to update status', err);
      showToast(
        err.response?.data?.error?.message ||
          err.response?.data?.error ||
          'Status update not permitted'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleToggleDish = async (dish) => {
    try {
      await api.updatePartnerDish(dish.id, {
        name: dish.name,
        pricePerHead: dish.pricePerHead,
        isAvailable: !dish.isAvailable,
      });
      showToast(`Dish "${dish.name}" availability updated`);
      await loadPartnerData();
    } catch (err) {
      console.error('Failed to toggle dish', err);
      showToast('Could not update dish availability');
    }
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const activeDishesCount = dishes.filter((d) => d.isAvailable).length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#173E23] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-white/20 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE3D5]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C55418]"></span>
            <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold">
              Partner Atelier Workspace
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#173E23] font-bold tracking-tight">
            Your Culinary Atelier
          </h1>
          <p className="text-xs text-[#1c1c18]/70 mt-0.5 font-sans">
            <strong className="text-[#173E23]">{profile?.businessName || user?.partner?.businessName || 'Heritage Kitchen'}</strong> • {profile?.tagline || 'Artisanal Culinary Partner'} • Cuisine:{' '}
            <strong>{profile?.cuisine || 'Heritage'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/partner/onboarding"
            className="px-4 py-2 border border-[#C55418] text-[#C55418] hover:bg-[#C55418] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Guild Onboarding</span>
          </Link>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              profile?.isApproved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#C55418]/15 text-[#C55418] border border-[#C55418]/30'
            }`}
          >
            {profile?.isApproved
              ? 'Verified Guild Member'
              : onboardingStatus?.status === 'PENDING_REVIEW'
              ? 'Under Review'
              : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Onboarding Callout Banner */}
      {(!profile?.isApproved || onboardingStatus?.status !== 'APPROVED') && (
        <div className="mb-8 p-5 bg-[#FAF6EF] border border-[#C55418]/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C55418]/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#C55418]">
              <ShieldCheck className="w-5 h-5 text-[#C55418]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#173E23]">
                {onboardingStatus?.status === 'PENDING_REVIEW'
                  ? 'Guild Onboarding Application Submitted & Under Audit'
                  : 'Complete Official Partner Guild Onboarding'}
              </h3>
              <p className="text-xs text-[#1c1c18]/70 mt-0.5 font-sans">
                {onboardingStatus?.status === 'PENDING_REVIEW'
                  ? 'Your culinary credentials, FSSAI compliance, and bank settlement details are currently being audited by the platform administration team.'
                  : 'To receive commissions and publish dishes to the Food Tailor catalog, submit your official culinary credentials, FSSAI license, and settlement details.'}
              </p>
            </div>
          </div>
          <Link
            to="/partner/onboarding"
            className="px-5 py-2.5 bg-[#C55418] hover:bg-[#d95d1c] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>
              {onboardingStatus?.status === 'PENDING_REVIEW'
                ? 'View Application'
                : 'Complete Onboarding'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metrics Row — Structured StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Inbox}
          label="Incoming Orders"
          value={activeOrdersCount}
          supportingText={
            activeOrdersCount === 0
              ? 'No pending preparations'
              : `${activeOrdersCount} commission${activeOrdersCount > 1 ? 's' : ''} awaiting action`
          }
          accentColor="#C55418"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed Feasts"
          value={completedOrdersCount}
          supportingText="Successfully fulfilled events"
          accentColor="#173E23"
        />

        <StatCard
          icon={Utensils}
          label="Active Menu Dishes"
          value={`${activeDishesCount} / ${dishes.length}`}
          supportingText="Published in live catalog"
          accentColor="#173E23"
        />

        <StatCard
          icon={Users}
          label="Event Capacity"
          value={`${profile?.maxEventCapacity || 200}`}
          supportingText="Maximum simultaneous covers"
          accentColor="#C55418"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-[#EBE3D5] mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'orders'
              ? 'text-[#173E23] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#173E23]'
              : 'text-[#1c1c18]/60 hover:text-[#173E23]'
          }`}
        >
          Kitchen Production Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'dishes'
              ? 'text-[#173E23] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#173E23]'
              : 'text-[#1c1c18]/60 hover:text-[#173E23]'
          }`}
        >
          Dishes & Availability ({dishes.length})
        </button>
      </div>

      {/* Tab 1: Orders */}
      {loading ? (
        <LoadingState message="Syncing Kitchen Tickets..." />
      ) : activeTab === 'orders' ? (
        <div>
          {orders.length === 0 ? (
            <EmptyState
              sketch={KitchenAtelierSketch}
              title="No Production Tickets Yet"
              description="When customers include your signature dishes in their commission, orders appear here for batch confirmation."
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="sketch-card p-6 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#EBE3D5]">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-base font-bold text-[#173E23]">
                          {order.orderRef}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#173E23]/10 text-[#173E23] border border-[#173E23]/20'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            order.paymentStatus === 'COMPLETED'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#C55418]/15 text-[#C55418]'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#1c1c18]/70 mt-1 font-sans">
                        Event Date:{' '}
                        <strong>{new Date(order.eventDate).toLocaleDateString()}</strong> • Total
                        Guests: <strong>{order.guestCount}</strong>
                      </p>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {order.status === 'SUBMITTED' || order.status === 'PENDING_PARTNER' ? (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                          className="px-4 py-2 bg-[#173E23] hover:bg-[#1f502f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          Accept Order
                        </button>
                      ) : null}

                      {order.status === 'ACCEPTED' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          className="px-4 py-2 bg-[#C55418] hover:bg-[#d95d1c] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Kitchen specific items */}
                  <div className="bg-white rounded-xl p-4 border border-[#EBE3D5] text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#C55418] block mb-2 text-[10px]">
                      Your Kitchen's Assigned Preparations
                    </span>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1 border-b border-[#EBE3D5]/50 last:border-0"
                        >
                          <span className="font-medium text-[#173E23]">
                            {item.dish?.name || 'Assigned Dish'}
                          </span>
                          <span className="text-[#1c1c18]/70 font-medium font-sans">
                            Quantity: {item.quantity} covers
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Dishes */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="sketch-card p-5 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] shadow-sm flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  />
                  <span className="text-[10px] uppercase font-bold text-[#C55418]">
                    {dish.category?.name || 'Specialty'}
                  </span>
                  {dish.isSignature && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#C55418]/10 text-[#C55418] rounded font-bold">
                      Signature
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-bold text-[#173E23]">
                  {dish.name}
                </h3>
                <p className="text-xs text-[#1c1c18]/70 line-clamp-2 mt-0.5 font-sans">
                  {dish.description}
                </p>

                <div className="mt-2 text-xs font-bold text-[#173E23]">
                  ₹{dish.pricePerHead}{' '}
                  <span className="text-[10px] font-normal text-[#1c1c18]/60">/ cover</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleDish(dish)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                  dish.isAvailable
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                    : 'bg-white border border-[#EBE3D5] text-[#1c1c18]/60 hover:text-[#1c1c18]'
                }`}
              >
                {dish.isAvailable ? 'Available' : 'Paused'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
