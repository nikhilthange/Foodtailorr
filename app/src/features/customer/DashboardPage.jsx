'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '../../lib/navigation';
import { api } from '../../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import StatCard from '../../components/ui/StatCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import {
  CalendarCheck,
  UtensilsCrossed,
  BookmarkCheck,
  Plus,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { ClocheSketch } from '../../components/ui/svg/FoodSketches';

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [savedMenus, setSavedMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menusRes] = await Promise.all([
          api.getOrders().catch(() => ({ orders: [] })),
          api.getSavedMenus().catch(() => []),
        ]);
        setOrders(ordersRes.orders || ordersRes || []);
        setSavedMenus(menusRes || []);
      } catch (err) {
        console.error('Failed to load customer dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-terracotta"></span>
            <span className="text-xs uppercase tracking-widest text-brand-terracotta font-bold">
              Guest Tasting Hub
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-slate-900 font-bold tracking-tight">
            Welcome, {user?.firstName || user?.email?.split('@')[0] || 'Host'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Manage your tailored banquets, tasting folios, and past orders.
          </p>
        </div>

        <Link
          to="/build-menu"
          className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm"
        >
          <span>Tailor New Menu</span>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={CalendarCheck}
          label="ACTIVE COMMISSIONS"
          value={activeOrdersCount}
          supportingText={
            activeOrdersCount === 0
              ? 'No active events in preparation'
              : `${activeOrdersCount} event${activeOrdersCount > 1 ? 's' : ''} currently orchestrated`
          }
          accentColor="#0D381E"
        />

        <StatCard
          icon={UtensilsCrossed}
          label="TOTAL FEASTS HOSTED"
          value={orders.length}
          supportingText="Lifetime culinary commissions"
          accentColor="#C85419"
        />

        <StatCard
          icon={BookmarkCheck}
          label="SAVED FOLIOS"
          value={savedMenus.length}
          supportingText="Curated menus ready to re-order"
          accentColor="#0D381E"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'orders'
              ? 'text-brand-forest after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-forest'
              : 'text-slate-500 hover:text-brand-forest'
          }`}
        >
          My Orders & Reservations ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === 'saved'
              ? 'text-brand-forest after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-forest'
              : 'text-slate-500 hover:text-brand-forest'
          }`}
        >
          Saved Menu Folios ({savedMenus.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingState message="Loading Tastings..." />
      ) : activeTab === 'orders' ? (
        <div>
          {orders.length === 0 ? (
            <EmptyState
              sketch={ClocheSketch}
              title="No Feasts Booked Yet"
              description="Your tailored culinary commissions and reservations will appear here."
              actionLabel="Tailor Your First Feast"
              actionHref="/build-menu"
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const partnerCount = new Set(
                  (order.items || [])
                    .map((i) => i.dish?.partnerId || i.dish?.partner?.businessName)
                    .filter(Boolean)
                ).size || 1;

                return (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-forest/40 hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-card-soft"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-serif text-base font-bold text-slate-900 group-hover:text-brand-terracotta transition-colors">
                          {order.orderRef}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-brand-forest/10 text-brand-forest border border-brand-forest/20'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            order.paymentStatus === 'COMPLETED'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-brand-terracotta/15 text-brand-terracotta'
                          }`}
                        >
                          {order.paymentStatus === 'COMPLETED' ? 'PAID' : 'PAYMENT DUE'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-sans">
                        Occasion: <strong className="text-slate-900">{order.occasionName || 'Artisanal Degustation'}</strong> • {partnerCount} Atelier{partnerCount > 1 ? 's' : ''} • {order.guestCount} Guests • Event: {new Date(order.eventDate).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-md font-sans">
                        Venue: {order.venueAddress}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="font-serif text-lg font-bold text-brand-forest">
                          ₹{order.totalAmount?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-sans">
                          {order.items?.length || 0} Courses
                        </span>
                      </div>

                      <Link
                        to={`/order/${order.id}`}
                        className="px-4 py-2 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-forest hover:text-white hover:border-brand-forest transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Track & Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Saved Menus Tab */
        <div>
          {savedMenus.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Folios"
              description="When curating menus, click 'Save Folio' to store your favorite compositions for future events."
              actionLabel="Create a Menu Now"
              actionHref="/build-menu"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-terracotta">
                      Saved Folio
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-1 mt-0.5">
                      {menu.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 font-sans">
                      Calibrated for {menu.guestCount} Guests • ₹{menu.totalPerHead} / head
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {menu.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta" />
                          <span className="font-medium">{item.dish?.name}</span>
                          <span className="text-slate-400 text-[11px]">
                            ({item.dish?.partner?.businessName})
                          </span>
                        </div>
                      ))}
                      {menu.items?.length > 3 && (
                        <span className="text-[11px] text-slate-400 block italic">
                          + {menu.items.length - 3} more selections
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={async () => {
                        await api.deleteSavedMenu(menu.id);
                        setSavedMenus((prev) => prev.filter((m) => m.id !== menu.id));
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
                    >
                      Remove
                    </button>
                    <Link
                      to="/build-menu"
                      className="btn-primary px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider"
                    >
                      Re-order Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
