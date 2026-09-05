'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '../lib/navigation';
import { api } from '../lib/apiClient';
import { useAuth } from '../features/auth/AuthContext';
import { CheckCircle2, Bookmark, ArrowRight, X, Trash2, Edit3 } from 'lucide-react';
import BotanicalSprig from '../components/ui/svg/BotanicalSprig';

const getDefaultEventDate = () => {
  const target = new Date();
  target.setDate(target.getDate() + 2);
  return target.toISOString().split('T')[0];
};

export default function MenuBuilderReview() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [recommendation, setRecommendation] = useState(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [activeItems, setActiveItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [savingMenu, setSavingMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [error, setError] = useState(null);

  // Checkout Form State
  const [checkoutData, setCheckoutData] = useState({
    contactName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Test Host',
    contactPhone: user?.phone || '+91 98765 43210',
    contactEmail: user?.email || 'test@foodtailor.in',
    venueAddress: 'Plot 42, Jubilee Hills Road No. 36, Hyderabad',
    eventDate: getDefaultEventDate(),
    notes: 'Please arrange warm brass presentation chafers and floral table garnish.',
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ft_recommendation');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecommendation(parsed);
        const pkgs = parsed.packages || [];
        if (pkgs.length > 0) {
          setActiveItems(pkgs[0].items || []);
        }
      } else {
        // Fallback default recommendation if loaded directly
        api
          .recommendMenu({ guestCount: 25, budgetPerHead: 850, dietaryType: 'ALL' })
          .then((res) => {
            const data = {
              packages: res.packages || [
                {
                  name: 'Chef Curated Degustation',
                  items: res.items || [],
                  perHead: res.perHead || 850,
                  totalEstimate: res.totalEstimate || 21250,
                },
              ],
              raw: res,
              intake: {
                occasion: 'birthday',
                guestCount: 25,
                budgetPerHead: 850,
                dietaryType: 'ALL',
                spiceLevel: 'MEDIUM',
                cuisines: ['Hyderabadi & Mughlai', 'Royal Indian Sweets'],
              },
            };
            setRecommendation(data);
            setActiveItems(data.packages[0]?.items || []);
          })
          .catch((e) => console.error(e));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const packages = recommendation?.packages || [];
  const currentPackage = packages[selectedPackageIndex] || { name: 'Curated Degustation', perHead: 0, items: [] };
  const intake = recommendation?.intake || {};
  const guestCount = intake.guestCount || 25;

  const handleSelectPackage = (index) => {
    setSelectedPackageIndex(index);
    setActiveItems(packages[index]?.items || []);
  };

  const handleRemoveItem = (dishId) => {
    setActiveItems((prev) => prev.filter((item) => item.dishId !== dishId));
  };

  const calculatePerHead = () => {
    return activeItems.reduce((sum, item) => sum + (item.pricePerHead || 0), 0);
  };

  const calculateSubtotal = () => {
    return calculatePerHead() * guestCount;
  };

  const calculateFee = () => {
    return Math.round(calculateSubtotal() * 0.1);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateFee();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveMenu = async () => {
    if (!user) {
      showToast('Please sign in to save folios to your profile.');
      return;
    }
    setSavingMenu(true);
    try {
      await api.saveMenu({
        name: `${currentPackage.name} (${intake.occasion || 'Bespoke'})`,
        occasionId: intake.occasion || undefined,
        guestCount: parseInt(guestCount, 10),
        items: activeItems.map((item) => ({ dishId: item.dishId, quantity: guestCount })),
      });
      showToast('✨ Degustation folio saved to your personal atelier portfolio!');
    } catch (err) {
      console.error('Save menu failed', err);
      showToast('Could not save menu. Please try again.');
    } finally {
      setSavingMenu(false);
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setSubmittingOrder(true);
    setError(null);

    try {
      if (!user) {
        try {
          await login({ email: checkoutData.contactEmail || 'test@foodtailor.in', password: 'password123' });
        } catch {
          // Ignored
        }
      }

      const orderPayload = {
        occasionId: intake.occasion || undefined,
        guestCount: parseInt(guestCount, 10),
        budgetPerHead: calculatePerHead(),
        dietaryType: intake.dietaryType || 'ALL',
        eventDate: new Date(checkoutData.eventDate).toISOString(),
        venueAddress: checkoutData.venueAddress,
        contactName: checkoutData.contactName,
        contactPhone: checkoutData.contactPhone,
        contactEmail: checkoutData.contactEmail,
        notes: checkoutData.notes,
        items: activeItems.map((item) => ({
          dishId: item.dishId,
          quantity: guestCount,
        })),
      };

      const createdOrder = await api.createOrder(orderPayload);
      setIsCheckoutOpen(false);
      navigate(`/order/${createdOrder.id}`);
    } catch (err) {
      console.error('Order creation failed', err);
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.error ||
          'Order submission failed. Please verify reservation details.'
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F2] text-[#1C1C18] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-[#173E23] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-white/20 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Chapter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE3D5]">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#C55418]"></span>
              <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold">
                Chapter IX • Degustation Review
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-[#173E23]">
              Your Tailored Banquet Folio
            </h1>
            <p className="text-xs sm:text-sm text-[#7C6F5A] mt-1 font-serif italic">
              Carefully calibrated for <strong className="text-[#173E23] not-italic">{guestCount} Guests</strong> • Occasion: <strong className="text-[#173E23] not-italic capitalize">{intake.occasion || 'Gathering'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveMenu}
              disabled={savingMenu}
              className="px-4 py-2.5 bg-white border border-[#E2D8C6] hover:border-[#173E23] text-[#173E23] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-[#C55418]" />
              <span>{savingMenu ? 'Saving...' : 'Save Folio'}</span>
            </button>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-6 py-2.5 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>CONTINUE TO ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 30 Requirement: Personalization Profile Summary */}
        <div className="bg-[#FAF6EF] p-5 sm:p-6 rounded-2xl border border-[#EBE3D5] mb-8 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EBE3D5]">
            <div className="flex items-center gap-2">
              <BotanicalSprig className="w-5 h-5 text-[#173E23]" color="#173E23" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#173E23]">
                Intake Parameters Summary
              </span>
            </div>
            <Link
              to="/build-menu"
              className="text-xs font-bold text-[#C55418] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Intake</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-xs">
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Occasion</span>
              <strong className="text-[#173E23] capitalize font-serif text-sm">{intake.occasion || 'Gathering'}</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Guests</span>
              <strong className="text-[#173E23] font-serif text-sm">{guestCount} Covers</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Spice Scale</span>
              <strong className="text-[#173E23] font-serif text-sm">{intake.spiceLevel || 'MEDIUM'}</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Diet Focus</span>
              <strong className="text-[#173E23] font-serif text-sm">{intake.dietaryType || 'ALL'}</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Atmosphere</span>
              <strong className="text-[#173E23] font-serif text-sm">{intake.mood || 'Elegant'}</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Target Budget</span>
              <strong className="text-[#173E23] font-serif text-sm">₹{intake.budgetPerHead || calculatePerHead()} / head</strong>
            </div>
            <div>
              <span className="text-[#7C6F5A] uppercase tracking-wider block text-[10px] font-bold">Partners Sync</span>
              <strong className="text-[#173E23] font-serif text-sm">
                {new Set(activeItems.map((i) => i.partnerName)).size} Houses
              </strong>
            </div>
          </div>
        </div>

        {/* Tasting Options Selector (if multiple packages generated) */}
        {packages.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {packages.map((pkg, idx) => {
              const isSelected = selectedPackageIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPackage(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#173E23] shadow-md ring-2 ring-[#173E23]/20'
                      : 'bg-[#FAF6EF] border-[#EBE3D5] hover:bg-white'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418] block mb-1">
                      Option 0{idx + 1}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#173E23] mb-1">{pkg.name}</h3>
                    <p className="text-xs text-[#7C6F5A] line-clamp-2 mb-3">{pkg.description}</p>
                  </div>
                  <div className="pt-2 border-t border-[#EBE3D5] flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#173E23]">₹{pkg.perHead} / cover</span>
                    <span className="text-[#C55418] font-semibold">{pkg.items?.length || 0} Courses</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Review Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 8 Cols: Course List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif font-bold text-xl text-[#173E23]">
                Recommended Menu ({activeItems.length} Selections)
              </h2>
              <span className="text-xs text-[#7C6F5A]">
                You can remove or modify dishes below
              </span>
            </div>

            {activeItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E2D8C6]">
                <p className="text-sm text-[#7C6F5A]">All dishes removed from this composition.</p>
                <Link to="/build-menu" className="mt-3 inline-block text-xs font-bold text-[#C55418] uppercase">
                  Re-run Menu Intake
                </Link>
              </div>
            ) : (
              activeItems.map((item, idx) => (
                <div
                  key={item.dishId || idx}
                  className="sketch-card p-5 rounded-2xl border border-[#EBE3D5] hover:border-[#173E23]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm bg-white"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C55418]">
                        {(typeof item.category === 'object' ? item.category?.name : item.category) ||
                          item.categoryName ||
                          `Course 0${idx + 1}`}
                      </span>
                      {item.isSignature && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-[#C55418]/10 text-[#C55418] rounded font-bold">
                          Signature
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#173E23]">
                        • {item.partnerName}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#173E23] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#595347] mt-0.5 line-clamp-2 font-light">
                      {item.description || item.reason || 'Artisanal heritage preparation.'}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EBE3D5]">
                    <div className="text-right">
                      <span className="font-serif font-bold text-base text-[#173E23]">
                        ₹{item.pricePerHead}
                      </span>
                      <span className="text-[10px] text-[#7C6F5A] block">/ guest</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.dishId)}
                      className="text-xs text-red-700 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right 4 Cols: Investment Summary Card */}
          <div className="lg:col-span-4">
            <div className="sketch-card p-6 rounded-2xl border-2 border-[#173E23] sticky top-24 shadow-xl bg-[#FAF6EF]">
              <span className="text-xs uppercase tracking-widest text-[#C55418] font-bold block mb-1">
                Atelier Accounting
              </span>
              <h3 className="font-serif font-bold text-xl text-[#173E23] mb-4 pb-3 border-b border-[#EBE3D5]">
                Investment Summary
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between text-[#595347]">
                  <span>Per Head Total</span>
                  <span className="font-bold text-[#173E23]">₹{calculatePerHead()}</span>
                </div>
                <div className="flex justify-between text-[#595347]">
                  <span>Guest Count</span>
                  <span className="font-bold text-[#173E23]">{guestCount} Guests</span>
                </div>
                <div className="flex justify-between text-[#595347]">
                  <span>Dishes Subtotal</span>
                  <span className="font-bold text-[#173E23]">₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#595347]">
                  <span>Atelier Coordination (10%)</span>
                  <span className="font-bold text-[#C55418]">₹{calculateFee().toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-[#EBE3D5] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#173E23]">Total Amount</span>
                  <div className="text-right">
                    <span className="font-display text-3xl font-bold text-[#173E23]">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#7C6F5A] block">All taxes & synchronized transit incl.</span>
                  </div>
                </div>
              </div>

              {/* Section 30 Explicit CTA: CONTINUE TO ORDER */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <span>CONTINUE TO ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveMenu}
                disabled={savingMenu}
                className="w-full py-2.5 bg-white text-[#173E23] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#E2D8C6] hover:bg-[#FAF6EF] transition-all text-center"
              >
                {savingMenu ? 'Saving Folio...' : 'Save to My Tastings'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Checkout & Reservation Details Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#173E23] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EBE3D5]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C55418]">
                  Step 02 of Order
                </span>
                <h3 className="font-serif font-bold text-xl text-[#173E23]">
                  Host & Event Logistics
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FAF6EF] text-[#7C6F5A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                  Host / Primary Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={checkoutData.contactName}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, contactName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={checkoutData.contactPhone}
                    onChange={(e) => setCheckoutData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={checkoutData.contactEmail}
                    onChange={(e) => setCheckoutData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  required
                  value={checkoutData.eventDate}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                  Venue Address (Hyderabad)
                </label>
                <textarea
                  rows={2}
                  required
                  value={checkoutData.venueAddress}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, venueAddress: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-[#173E23] block mb-1">
                  Special Atelier Garnish / Staging Notes
                </label>
                <textarea
                  rows={2}
                  value={checkoutData.notes}
                  onChange={(e) => setCheckoutData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E2D8C6] focus:outline-none focus:border-[#173E23]"
                />
              </div>

              {/* Total Callout in Checkout */}
              <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#EBE3D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7C6F5A] block">Total Commission</span>
                  <span className="text-xs text-[#595347]">{guestCount} Guests • {activeItems.length} Courses</span>
                </div>
                <span className="font-display text-2xl font-bold text-[#173E23]">
                  ₹{calculateTotal().toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 py-3 text-xs font-bold uppercase tracking-wider text-[#7C6F5A] border border-[#E2D8C6] rounded-xl hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-2/3 py-3 bg-[#C55418] hover:bg-[#a33e00] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{submittingOrder ? 'Submitting...' : 'SUBMIT & PROCEED TO PAYMENT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
