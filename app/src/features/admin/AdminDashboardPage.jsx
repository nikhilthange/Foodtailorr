'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/apiClient';
import StatCard from '../../components/ui/StatCard';
import { CheckCircle2, TrendingUp, Building2, Sparkles, ScrollText } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [toastMessage, setToastMessage] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAdminData = useCallback(async () => {
    try {
      const [dashRes, ordersRes, partnersRes, usersRes, logsRes, appsRes] = await Promise.all([
        api.getAdminDashboard().catch(() => null),
        api.getAdminOrders().catch(() => ({ orders: [] })),
        api.getAdminPartners().catch(() => ({ partners: [] })),
        api.getAdminUsers().catch(() => ({ users: [] })),
        api.getAdminAiLogs().catch(() => ({ logs: [] })),
        api.getAdminOnboardingApplications().catch(() => ({ applications: [] })),
      ]);

      setStats(dashRes);
      setOrders(ordersRes.orders || ordersRes || []);
      setPartners(partnersRes.partners || partnersRes || []);
      setUsers(usersRes.users || usersRes || []);
      setAiLogs(logsRes.logs || logsRes || []);
      setApplications(appsRes.applications || appsRes || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionLoadingId(orderId);
    try {
      await api.updateAdminOrderStatus(orderId, newStatus, 'Admin override');
      showToast(`Order ${orderId.slice(0, 8)} status set to ${newStatus}`);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to update order', err);
      showToast('Could not update order status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePartnerApproval = async (partner) => {
    try {
      await api.updateAdminPartner(partner.id, {
        isApproved: !partner.isApproved,
      });
      showToast(`Partner ${partner.businessName} ${partner.isApproved ? 'paused' : 'approved'}`);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to toggle partner', err);
      showToast('Could not update partner approval');
    }
  };

  const handleUpdateApplicationStatus = async (appId, status, reviewNotes = '') => {
    setActionLoadingId(appId);
    try {
      await api.updateAdminOnboardingStatus(appId, status, reviewNotes || `Reviewed & ${status.toLowerCase()} by admin`);
      showToast(`Application ${appId.slice(0, 8)} marked as ${status}`);
      await loadAdminData();
    } catch (err) {
      console.error('Failed to update application status', err);
      showToast(err.response?.data?.error?.message || 'Could not update application status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#173E23] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-white/20 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 mb-8 border-b border-[#EBE3D5]">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C55418]"></span>
          <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold">
            Atelier Executive Console
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#173E23] font-bold tracking-tight">
          Platform Administration & Culinary Audit
        </h1>
        <p className="text-xs text-[#1c1c18]/70 mt-0.5 font-sans">
          Global supervision of commissions, partner ateliers, revenue, and AI recommendation telemetry.
        </p>
      </div>

      {/* Stats Cards — Structured StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ScrollText}
          label="Total Commissions"
          value={stats?.ordersCount ?? orders.length}
          supportingText="All platform bookings"
          accentColor="#173E23"
        />

        <StatCard
          icon={TrendingUp}
          label="Gross Commission Value"
          value={`₹${(stats?.totalRevenue ?? orders.reduce((s, o) => s + (o.totalAmount || 0), 0)).toLocaleString()}`}
          supportingText="Total processed volume"
          accentColor="#C55418"
        />

        <StatCard
          icon={Building2}
          label="Atelier Partners"
          value={`${partners.filter(p => p.isApproved).length} / ${partners.length}`}
          supportingText="Verified kitchen institutions"
          accentColor="#173E23"
        />

        <StatCard
          icon={Sparkles}
          label="AI Synthesis Events"
          value={aiLogs.length}
          supportingText="Curated degustation generations"
          accentColor="#C55418"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-[#EBE3D5] mb-6 overflow-x-auto scrollbar-none">
        {[
          { key: 'orders', label: `Commissions (${orders.length})` },
          { key: 'partners', label: `Ateliers (${partners.length})` },
          { key: 'onboarding', label: `Onboarding Applications (${applications.length})` },
          { key: 'users', label: `Users (${users.length})` },
          { key: 'logs', label: `AI Telemetry (${aiLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all relative ${
              activeTab === tab.key
                ? 'text-[#173E23] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#173E23]'
                : 'text-[#1c1c18]/60 hover:text-[#173E23]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-[#173E23] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#1c1c18]/70 uppercase tracking-wider">Syncing Admin Console...</p>
        </div>
      ) : activeTab === 'orders' ? (
        /* Orders Tab */
        <div className="bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] border-b border-[#EBE3D5] text-[#1c1c18]/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Host / Email</th>
                  <th className="p-4">Event Date</th>
                  <th className="p-4">Covers</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Admin Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]/60 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="p-4 font-bold text-[#173E23] font-serif">
                      {order.orderRef}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#1c1c18]">{order.contactName}</div>
                      <div className="text-[11px] text-[#1c1c18]/60">{order.contactEmail}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-[#1c1c18]">
                      {new Date(order.eventDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-[#1c1c18]">
                      {order.guestCount}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#173E23]/10 text-[#173E23] border border-[#173E23]/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-[#C55418]/15 text-[#C55418]'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#173E23] whitespace-nowrap font-serif">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={order.status}
                        disabled={actionLoadingId === order.id}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#EBE3D5] rounded-xl text-xs font-medium text-[#173E23] focus:outline-none focus:border-[#173E23]"
                      >
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="PENDING_PARTNER">PENDING_PARTNER</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'partners' ? (
        /* Partners Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#C55418]">{p.cuisine}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    p.isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-[#C55418]/15 text-[#C55418]'
                  }`}>
                    {p.isApproved ? 'Approved' : 'Unapproved'}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#173E23] mb-1">
                  {p.businessName}
                </h3>
                <p className="text-xs text-[#1c1c18]/70 line-clamp-2 mb-3 font-sans">
                  {p.description}
                </p>

                <div className="text-[11px] text-[#1c1c18]/80 space-y-0.5 font-sans">
                  <div>Min Order: <strong>₹{p.minOrderAmount?.toLocaleString()}</strong></div>
                  <div>Max Event Capacity: <strong>{p.maxEventCapacity} Covers</strong></div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#EBE3D5] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleTogglePartnerApproval(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                    p.isApproved
                      ? 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
                      : 'bg-[#173E23] text-white hover:bg-[#1f502f]'
                  }`}
                >
                  {p.isApproved ? 'Revoke Approval' : 'Approve Partner'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'users' ? (
        /* Users Tab */
        <div className="bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] border-b border-[#EBE3D5] text-[#1c1c18]/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]/60 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="p-4 font-semibold text-[#173E23]">
                      {u.firstName || 'User'} {u.lastName || ''}
                    </td>
                    <td className="p-4 text-[#1c1c18]/70">
                      {u.email}
                    </td>
                    <td className="p-4 font-bold text-[11px] text-[#C55418]">
                      {u.role}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-[#1c1c18]/60">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'logs' ? (
        /* AI Logs Tab */
        <div className="bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] border-b border-[#EBE3D5] text-[#1c1c18]/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Budget / Head</th>
                  <th className="p-4">Diet & Spice</th>
                  <th className="p-4">Provider / Model</th>
                  <th className="p-4">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]/60 bg-white">
                {aiLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="p-4 text-[#1c1c18]/70 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-[#173E23]">
                      {log.guestCount} Guests
                    </td>
                    <td className="p-4 font-bold text-[#173E23] font-serif">
                      ₹{log.budgetPerHead}
                    </td>
                    <td className="p-4 text-[#1c1c18]">
                      {log.dietaryType} • {log.spiceLevel}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#C55418]">{log.provider}</span> ({log.model?.split('/')[1] || log.model || 'fallback'})
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#1c1c18]/70">
                      {log.durationMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'onboarding' ? (
        /* Onboarding Applications Tab */
        <div className="bg-[#FAF6EF] rounded-2xl border border-[#EBE3D5] overflow-hidden shadow-sm">
          <div className="p-4 bg-[#FAF6EF] border-b border-[#EBE3D5] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#173E23]">Partner Guild Onboarding Verification</h3>
              <p className="text-[11px] text-[#1c1c18]/70">Review official compliance credentials, FSSAI licenses, and settlement information submitted by restaurant partners.</p>
            </div>
            <span className="text-xs font-bold text-[#C55418]">{applications.length} Total Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF]/60 border-b border-[#EBE3D5] text-[#1c1c18]/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Restaurant & Type</th>
                  <th className="p-4">Location & Outlets</th>
                  <th className="p-4">Owner / Contact</th>
                  <th className="p-4">Legal & Compliance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]/60 bg-white">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#1c1c18]/60">
                      No partner onboarding applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#173E23] text-sm font-serif">{app.data?.restaurantName || 'Unnamed Kitchen'}</div>
                        <div className="text-[11px] text-[#C55418] font-medium">{app.data?.restaurantType || 'Heritage Restaurant'}</div>
                        <div className="text-[10px] text-[#1c1c18]/50 font-mono mt-0.5">ID: {app.id?.slice(0, 14)}...</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#173E23]">{app.data?.city || 'Hyderabad'}</div>
                        <div className="text-[11px] text-[#1c1c18]/70 max-w-xs truncate">{app.data?.address || 'Address provided'}</div>
                        <div className="text-[10px] text-[#1c1c18]/60 mt-0.5">{app.data?.outletsCount || '1'} Outlet(s)</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#173E23]">{app.data?.ownerName || 'Authorized Rep'}</div>
                        <div className="text-[11px] text-[#1c1c18]/70">{app.data?.ownerMobile || app.data?.contactNumber || '—'}</div>
                        <div className="text-[10px] text-[#1c1c18]/60">{app.data?.ownerEmail || app.data?.email || '—'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-[11px] text-[#173E23]">FSSAI: {app.data?.fssaiNumber || 'Pending'}</div>
                        <div className="font-mono text-[10px] text-[#1c1c18]/60">PAN: {app.data?.panNumber || '—'}</div>
                        <div className="font-mono text-[10px] text-[#1c1c18]/60">GST: {app.data?.gstin || (app.data?.gstRegistered === 'Yes' ? 'Registered' : 'Not Registered')}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {app.status}
                        </span>
                        {app.submittedAt && (
                          <div className="text-[10px] text-[#1c1c18]/60 mt-1">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.status !== 'APPROVED' && (
                            <button
                              disabled={actionLoadingId === app.id}
                              onClick={() => handleUpdateApplicationStatus(app.id, 'APPROVED', 'Approved by Guild Audit')}
                              className="px-3 py-1.5 bg-[#173E23] text-white hover:bg-[#1f502f] rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          {app.status !== 'REJECTED' && (
                            <button
                              disabled={actionLoadingId === app.id}
                              onClick={() => handleUpdateApplicationStatus(app.id, 'REJECTED', 'Compliance criteria not met')}
                              className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
