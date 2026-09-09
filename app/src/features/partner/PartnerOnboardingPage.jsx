'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import { CheckCircle2, Clock, AlertCircle, Plus, Trash2, IndianRupee, Utensils } from 'lucide-react';

const RESTAURANT_TYPES = [
  'Restaurant',
  'Cloud Kitchen',
  'Bakery',
  'Caterer',
  'QSR',
  'Deserts',
  'Icecream',
  'Other',
];

const STEPS = [
  { id: 1, title: 'Restaurant Details', subtitle: 'Identity & Location' },
  { id: 2, title: 'Contact Person', subtitle: 'Owner & Representative' },
  { id: 3, title: 'Compliance & Legal', subtitle: 'FSSAI, PAN & GST' },
  { id: 4, title: 'Menu & Operations', subtitle: 'Dishes & Bulk Capacity' },
  { id: 5, title: 'Bank Settlement', subtitle: 'Payout Account' },
  { id: 6, title: 'Review & Submit', subtitle: 'Declaration & Verification' },
];

export default function PartnerOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Section 1: Restaurant Identity
    restaurantName: user?.partner?.businessName || '',
    restaurantType: 'Restaurant',
    restaurantTypeOther: '',
    city: 'Hyderabad',
    companyAddress: '',
    contactNumber: user?.phone || '',
    noOfOutlets: '1',
    outletAddressDetails: '',
    googleMapsLocation: '',

    // Section 2: Contact Person
    ownerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    designation: 'Managing Partner',
    mobileNumber: user?.phone || '',
    whatsappNumber: user?.phone || '',
    emailId: user?.email || '',

    // Section 3: Legal & Compliance
    fssaiNumber: '',
    fssaiDocUrl: '',
    panNumber: '',
    panDocUrl: '',
    gstRegistered: 'Yes',
    gstin: '',
    gstDocUrl: '',

    // Section 4: Menu & Production
    existingMenuDocUrl: '',
    signatureDishes: '',
    avgPricePerHead: '',
    minOrderAmount: '2500',
    bulkOrdersAvailable: 'Yes',
    minBulkOrderQuantity: '10',
    bulkOrderPrepTime: '2-4 hours',
    dishesList: [
      { name: '', category: 'Biryani', dietary: 'NON_VEG', pricePerHead: '', notes: '' },
      { name: '', category: 'Starter', dietary: 'VEG', pricePerHead: '', notes: '' },
    ],

    // Section 5: Bank Details
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    cancelledChequeDocUrl: '',

    // Section 6: Declaration
    agreedToTerms: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadStatus = useCallback(async () => {
    try {
      const res = await api.getOnboardingStatus();
      setStatusData(res);
      if (res.application?.formData) {
        setFormData(prev => ({
          ...prev,
          ...res.application.formData,
          dishesList:
            res.application.formData.dishesList?.length > 0
              ? res.application.formData.dishesList
              : prev.dishesList,
        }));
      }
      if (res.application?.draftStep && res.status === 'DRAFT') {
        setCurrentStep(res.application.draftStep);
      }
    } catch (err) {
      console.error('Failed to load onboarding status', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDishChange = (index, field, value) => {
    const updated = [...(formData.dishesList || [])];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-generate signature dishes summary string
    const summary = updated
      .filter(d => d.name?.trim())
      .map(d => `${d.name} (₹${d.pricePerHead || '—'}/head • ${d.category || 'General'})`)
      .join(', ');

    setFormData(prev => ({
      ...prev,
      dishesList: updated,
      signatureDishes: summary || prev.signatureDishes,
    }));

    if (errors[`dish_${index}_${field}`] || errors.signatureDishes) {
      setErrors(prev => ({
        ...prev,
        [`dish_${index}_${field}`]: null,
        signatureDishes: null,
      }));
    }
  };

  const handleAddDish = () => {
    setFormData(prev => ({
      ...prev,
      dishesList: [
        ...(prev.dishesList || []),
        { name: '', category: 'Main Course', dietary: 'NON_VEG', pricePerHead: '', notes: '' },
      ],
    }));
  };

  const handleRemoveDish = (index) => {
    const current = formData.dishesList || [];
    const updated = current.filter((_, i) => i !== index);
    const finalDishes = updated.length > 0 ? updated : [{ name: '', category: 'Main Course', dietary: 'NON_VEG', pricePerHead: '', notes: '' }];

    const summary = finalDishes
      .filter(d => d.name?.trim())
      .map(d => `${d.name} (₹${d.pricePerHead || '—'}/head • ${d.category || 'General'})`)
      .join(', ');

    setFormData(prev => ({
      ...prev,
      dishesList: finalDishes,
      signatureDishes: summary || prev.signatureDishes,
    }));
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await api.saveOnboardingDraft({
        draftStep: currentStep,
        formData,
      });
      showToast('Draft progress saved securely to DynamoDB');
    } catch (err) {
      console.error('Failed to save draft', err);
      showToast('Could not save draft. Please check connection.');
    } finally {
      setSavingDraft(false);
    }
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.restaurantName.trim()) errs.restaurantName = 'Restaurant / Brand Name is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.companyAddress.trim()) errs.companyAddress = 'Company Address is required';
      if (!formData.contactNumber.trim()) errs.contactNumber = 'Contact Number is required';
      if (!formData.googleMapsLocation.trim()) errs.googleMapsLocation = 'Google Maps Location link is required';
    } else if (step === 2) {
      if (!formData.ownerName.trim()) errs.ownerName = 'Owner / Authorized Representative Name is required';
      if (!formData.designation.trim()) errs.designation = 'Designation is required';
      if (!formData.mobileNumber.trim()) errs.mobileNumber = 'Mobile Number is required';
      if (!formData.emailId.trim()) errs.emailId = 'Email ID is required';
    } else if (step === 3) {
      if (!formData.fssaiNumber.trim()) errs.fssaiNumber = '14-digit FSSAI License Number is required';
      if (!formData.panNumber.trim()) errs.panNumber = 'PAN Number is required';
      if (formData.gstRegistered === 'Yes' && !formData.gstin.trim()) {
        errs.gstin = 'GSTIN is required when registered for GST';
      }
    } else if (step === 4) {
      const validDishes = (formData.dishesList || []).filter(d => d.name?.trim());
      if (validDishes.length === 0 && !formData.signatureDishes.trim()) {
        errs.signatureDishes = 'Please provide at least one signature dish with pricing';
      }
      (formData.dishesList || []).forEach((d, idx) => {
        if (d.name?.trim() && (!d.pricePerHead || isNaN(Number(d.pricePerHead)) || Number(d.pricePerHead) <= 0)) {
          errs[`dish_${idx}_pricePerHead`] = 'Enter price per head';
        }
      });
      if (validDishes.length > 0 && !formData.signatureDishes?.trim()) {
        formData.signatureDishes = validDishes
          .map(d => `${d.name} (₹${d.pricePerHead}/head)`)
          .join(', ');
      }
    } else if (step === 5) {
      if (!formData.accountHolderName.trim()) errs.accountHolderName = 'Account Holder Name is required';
      if (!formData.bankName.trim()) errs.bankName = 'Bank Name is required';
      if (!formData.accountNumber.trim()) errs.accountNumber = 'Account Number is required';
      if (!formData.ifscCode.trim()) errs.ifscCode = 'IFSC Code is required';
    } else if (step === 6) {
      if (!formData.agreedToTerms) errs.agreedToTerms = 'You must agree to the partnership declaration';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      showToast('Please fill all required fields before proceeding');
      return;
    }
    // Auto-save draft on step transition
    try {
      await api.saveOnboardingDraft({ draftStep: currentStep + 1, formData });
    } catch {
      // non-fatal
    }
    setCurrentStep(prev => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(6)) {
      showToast('Please accept the declaration terms to submit');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitOnboarding(formData);
      showToast('Application successfully submitted for Food Tailor Guild review!');
      setStatusData(prev => ({
        ...prev,
        status: 'PENDING_REVIEW',
        application: res.application,
      }));
    } catch (err) {
      console.error('Submission failed', err);
      showToast(err.response?.data?.error?.message || 'Submission failed. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase font-semibold text-secondary">Loading Onboarding Portal...</p>
      </div>
    );
  }

  const isApproved = statusData?.isApproved;
  const isPending = statusData?.status === 'PENDING_REVIEW';
  const isRejected = statusData?.status === 'REJECTED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#173E23] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-white/20 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
          <span className="font-label-editorial text-xs uppercase tracking-widest text-secondary font-bold">
            Food Tailor • Partner Curation Guild
          </span>
        </div>
        <h1 className="font-headline-xl text-2xl md:text-4xl font-bold text-primary-container">
          Restaurant Partner Onboarding
        </h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Welcome to Food Tailor. Please provide the following details to onboard your restaurant/brand as a Food Tailor Partner.
          Keep your FSSAI, PAN, bank details and existing menu ready.
        </p>

        {/* Status Callouts */}
        {isApproved && (
          <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-700" />
              <div>
                <h4 className="text-xs font-bold uppercase text-green-800 tracking-wider">Guild Partner Approved</h4>
                <p className="text-xs text-green-700 mt-0.5">Your kitchen atelier is fully verified and live in the Food Tailor catalog.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/partner')}
              className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold uppercase rounded-lg hover:bg-primary-container/90 transition-all"
            >
              Open Workspace
            </button>
          </div>
        )}

        {isPending && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-700" />
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider">Application Under Curation Review</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Submitted on {statusData.application?.submittedAt ? new Date(statusData.application.submittedAt).toLocaleDateString() : 'recently'}. Our executive culinary team is auditing your credentials.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-700" />
            <div>
              <h4 className="text-xs font-bold uppercase text-red-800 tracking-wider">Action Required on Application</h4>
              <p className="text-xs text-red-700 mt-0.5">
                {statusData.application?.reviewerNotes || 'Please review and update your compliance details.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps Header */}
      <div className="mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STEPS.map((s) => {
            const isDone = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id < currentStep || isApproved) setCurrentStep(s.id);
                }}
                disabled={s.id > currentStep && !isApproved}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-secondary bg-secondary/10 shadow-sm'
                    : isDone
                    ? 'border-primary-container/30 bg-surface-container-low hover:border-primary-container/60'
                    : 'border-outline-variant/30 bg-surface-container-lowest opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-secondary' : isDone ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                    Step 0{s.id}
                  </span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-primary-container" />}
                </div>
                <div className="text-xs font-bold text-primary-container truncate">{s.title}</div>
                <div className="text-[10px] text-on-surface-variant truncate hidden sm:block">{s.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 md:p-8 shadow-sm">
        {/* Step 1: Restaurant Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                1. Restaurant Identity & Location
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Provide your establishment brand name, kitchen category, and physical outlet location.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                1. Restaurant / Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={e => handleChange('restaurantName', e.target.value)}
                placeholder="e.g. Hotel Shadab / Cafe Niloufer"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.restaurantName ? 'border-red-500 ring-red-200' : 'border-outline-variant/60 focus:ring-secondary/20'
                }`}
              />
              {errors.restaurantName && <p className="text-red-500 text-xs mt-1">{errors.restaurantName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                2. Restaurant Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {RESTAURANT_TYPES.map(type => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      formData.restaurantType === type
                        ? 'border-primary-container bg-primary-container/10 text-primary-container font-bold'
                        : 'border-outline-variant/50 text-on-surface-variant hover:border-outline-variant'
                    }`}
                  >
                    <input
                      type="radio"
                      name="restaurantType"
                      value={type}
                      checked={formData.restaurantType === type}
                      onChange={e => handleChange('restaurantType', e.target.value)}
                      className="accent-secondary"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              {formData.restaurantType === 'Other' && (
                <input
                  type="text"
                  value={formData.restaurantTypeOther}
                  onChange={e => handleChange('restaurantTypeOther', e.target.value)}
                  placeholder="Please specify restaurant type"
                  className="w-full mt-2.5 px-4 py-2.5 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={e => handleChange('contactNumber', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.contactNumber ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Company / Registered Kitchen Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.companyAddress}
                onChange={e => handleChange('companyAddress', e.target.value)}
                placeholder="Complete street address, premise number, landmark, pincode"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.companyAddress ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                }`}
              />
              {errors.companyAddress && <p className="text-red-500 text-xs mt-1">{errors.companyAddress}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  No of Outlets <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.noOfOutlets}
                  onChange={e => handleChange('noOfOutlets', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Google Maps Location Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.googleMapsLocation}
                  onChange={e => handleChange('googleMapsLocation', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.googleMapsLocation ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.googleMapsLocation && <p className="text-red-500 text-xs mt-1">{errors.googleMapsLocation}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Outlet Address Details & Landmark Notes
              </label>
              <textarea
                rows={2}
                value={formData.outletAddressDetails}
                onChange={e => handleChange('outletAddressDetails', e.target.value)}
                placeholder="Any special landmark instructions for dispatch drivers and event logistics"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact Person */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                2. Owner / Authorized Representative
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Primary point of contact for partnership contracts, order escalations, and event authorizations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Owner / Authorized Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={e => handleChange('ownerName', e.target.value)}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.ownerName ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => handleChange('designation', e.target.value)}
                  placeholder="e.g. Owner, Managing Director, Executive Chef"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.designation ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={e => handleChange('mobileNumber', e.target.value)}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={e => handleChange('whatsappNumber', e.target.value)}
                  placeholder="For urgent order notifications"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Official Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.emailId}
                onChange={e => handleChange('emailId', e.target.value)}
                placeholder="partner@restaurant.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.emailId ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                }`}
              />
              {errors.emailId && <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Legal & Compliance */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                3. Business & Legal Details
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                FSSAI food safety license, PAN tax registration, and GST compliance information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  FSSAI License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={formData.fssaiNumber}
                  onChange={e => handleChange('fssaiNumber', e.target.value)}
                  placeholder="14-digit FSSAI number"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.fssaiNumber ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.fssaiNumber && <p className="text-red-500 text-xs mt-1">{errors.fssaiNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Upload / Link to FSSAI License Doc
                </label>
                <input
                  type="text"
                  value={formData.fssaiDocUrl}
                  onChange={e => handleChange('fssaiDocUrl', e.target.value)}
                  placeholder="Document URL or Google Drive link"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={e => handleChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  className={`w-full px-4 py-3 rounded-xl border text-sm uppercase focus:outline-none focus:ring-2 ${
                    errors.panNumber ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Upload / Link to PAN Card
                </label>
                <input
                  type="text"
                  value={formData.panDocUrl}
                  onChange={e => handleChange('panDocUrl', e.target.value)}
                  placeholder="Document URL or Google Drive link"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Do you have GST Registration? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(val => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="gstRegistered"
                      value={val}
                      checked={formData.gstRegistered === val}
                      onChange={e => handleChange('gstRegistered', e.target.value)}
                      className="accent-secondary"
                    />
                    <span>{val}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.gstRegistered === 'Yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                    GSTIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={e => handleChange('gstin', e.target.value.toUpperCase())}
                    placeholder="15-digit GSTIN"
                    className={`w-full px-4 py-3 rounded-xl border text-sm uppercase focus:outline-none focus:ring-2 ${
                      errors.gstin ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                    }`}
                  />
                  {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                    Upload / Link to GST Certificate
                  </label>
                  <input
                    type="text"
                    value={formData.gstDocUrl}
                    onChange={e => handleChange('gstDocUrl', e.target.value)}
                    placeholder="Document URL or Google Drive link"
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Menu & Operations */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                4. Menu & Production Capabilities
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Provide your signature culinary creations, dish pricing, and banquet delivery specifications.
              </p>
            </div>

            {/* Price Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Estimated Average Price / Head (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={formData.avgPricePerHead}
                    onChange={e => handleChange('avgPricePerHead', e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">Average tasting menu cost per guest</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Min Bulk Order Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={formData.minOrderAmount}
                    onChange={e => handleChange('minOrderAmount', e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">Minimum banquet ticket size</p>
              </div>
            </div>

            {/* Signature Dishes & Pricing Builder Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container">
                    Signature Dishes & Price Per Head <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-on-surface-variant">
                    Add signature creations with their price per head so clients can curate your dishes into banquet menus.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddDish}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dish</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.dishesList || []).map((dish, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-outline-variant/50 shadow-xs space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                      {/* Dish Name */}
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Dish Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={e => handleDishChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Royal Mutton Dum Biryani"
                          className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 font-medium"
                        />
                      </div>

                      {/* Category */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Category
                        </label>
                        <select
                          value={dish.category}
                          onChange={e => handleDishChange(idx, 'category', e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
                        >
                          <option value="Biryani">Biryani</option>
                          <option value="Starter">Starter / Appetizer</option>
                          <option value="Main Course">Main Course</option>
                          <option value="Dessert">Dessert / Mithai</option>
                          <option value="Beverage">Beverage / Chai</option>
                          <option value="Street Food & Chaat">Street Chaat</option>
                          <option value="Bakery & Bakes">Bakery & Bakes</option>
                          <option value="Paan & Refreshers">Paan</option>
                        </select>
                      </div>

                      {/* Dietary */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Dietary
                        </label>
                        <select
                          value={dish.dietary}
                          onChange={e => handleDishChange(idx, 'dietary', e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-white"
                        >
                          <option value="NON_VEG">Non-Veg</option>
                          <option value="VEG">Pure Veg</option>
                          <option value="JAIN">Jain</option>
                          <option value="VEGAN">Vegan</option>
                        </select>
                      </div>

                      {/* Price Per Head */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Price / Head (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 text-xs font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            value={dish.pricePerHead}
                            onChange={e => handleDishChange(idx, 'pricePerHead', e.target.value)}
                            placeholder="380"
                            className={`w-full pl-6 pr-2 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 ${
                              errors[`dish_${idx}_pricePerHead`]
                                ? 'border-red-500'
                                : 'border-outline-variant/60 focus:ring-secondary/20'
                            }`}
                          />
                        </div>
                        {errors[`dish_${idx}_pricePerHead`] && (
                          <p className="text-red-500 text-[9px] mt-0.5">{errors[`dish_${idx}_pricePerHead`]}</p>
                        )}
                      </div>
                    </div>

                    {/* Description Row & Delete */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={dish.notes || ''}
                        onChange={e => handleDishChange(idx, 'notes', e.target.value)}
                        placeholder="Portion size / tasting notes (e.g. Serves in authentic sealed handi with mirchi ka salan)"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-secondary/20 bg-slate-50/60"
                      />

                      {(formData.dishesList || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDish(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {errors.signatureDishes && (
                <p className="text-red-500 text-xs mt-2">{errors.signatureDishes}</p>
              )}
            </div>

            {/* Upload Menu URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Upload Your Complete Menu / Link (Optional)
              </label>
              <input
                type="text"
                value={formData.existingMenuDocUrl}
                onChange={e => handleChange('existingMenuDocUrl', e.target.value)}
                placeholder="Google Drive, Dropbox, or public PDF menu URL"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            {/* Bulk Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Do you offer bulk orders?
                </label>
                <div className="flex gap-4 pt-2">
                  {['Yes', 'No'].map(val => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="bulkOrdersAvailable"
                        value={val}
                        checked={formData.bulkOrdersAvailable === val}
                        onChange={e => handleChange('bulkOrdersAvailable', e.target.value)}
                        className="accent-secondary"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Min Bulk Order (Guests)
                </label>
                <input
                  type="number"
                  min="5"
                  value={formData.minBulkOrderQuantity}
                  onChange={e => handleChange('minBulkOrderQuantity', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Bulk Preparation Time
                </label>
                <input
                  type="text"
                  value={formData.bulkOrderPrepTime}
                  onChange={e => handleChange('bulkOrderPrepTime', e.target.value)}
                  placeholder="e.g. 2 hours / 24 hours"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Bank Details */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                5. Bank & Payout Details
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Settlement bank account for receiving commercial payouts on completed orders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={e => handleChange('accountHolderName', e.target.value)}
                  placeholder="Official registered entity name"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.accountHolderName ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={e => handleChange('bankName', e.target.value)}
                  placeholder="e.g. HDFC Bank, ICICI Bank"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.bankName ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.accountNumber}
                  onChange={e => handleChange('accountNumber', e.target.value)}
                  placeholder="Current or Business Account Number"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.accountNumber ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={e => handleChange('ifscCode', e.target.value.toUpperCase())}
                  placeholder="11-character IFSC"
                  className={`w-full px-4 py-3 rounded-xl border text-sm uppercase focus:outline-none focus:ring-2 ${
                    errors.ifscCode ? 'border-red-500' : 'border-outline-variant/60 focus:ring-secondary/20'
                  }`}
                />
                {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Cancelled Cheque / Passbook Image URL
              </label>
              <input
                type="text"
                value={formData.cancelledChequeDocUrl}
                onChange={e => handleChange('cancelledChequeDocUrl', e.target.value)}
                placeholder="URL of cancelled cheque or passbook copy"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
        )}

        {/* Step 6: Review & Final Submission */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-lg font-bold text-primary-container">
                6. Review & Final Submission
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Please verify your details before submitting to the Food Tailor Curation Guild.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
                <span className="font-bold text-secondary uppercase text-[10px]">Establishment Profile</span>
                <p><strong>Brand:</strong> {formData.restaurantName}</p>
                <p><strong>Type:</strong> {formData.restaurantType}</p>
                <p><strong>City:</strong> {formData.city}</p>
                <p><strong>Address:</strong> {formData.companyAddress}</p>
                <p><strong>Outlets:</strong> {formData.noOfOutlets}</p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
                <span className="font-bold text-secondary uppercase text-[10px]">Owner / Representative</span>
                <p><strong>Name:</strong> {formData.ownerName}</p>
                <p><strong>Designation:</strong> {formData.designation}</p>
                <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
                <p><strong>Email:</strong> {formData.emailId}</p>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
                <span className="font-bold text-secondary uppercase text-[10px]">Compliance Details</span>
                <p><strong>FSSAI:</strong> {formData.fssaiNumber}</p>
                <p><strong>PAN:</strong> {formData.panNumber}</p>
                <p><strong>GST Registered:</strong> {formData.gstRegistered}</p>
                {formData.gstRegistered === 'Yes' && <p><strong>GSTIN:</strong> {formData.gstin}</p>}
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
                <span className="font-bold text-secondary uppercase text-[10px]">Commercial & Payouts</span>
                <p><strong>Avg / Head:</strong> ₹{formData.avgPricePerHead || '350'}</p>
                <p><strong>Min Order:</strong> ₹{formData.minOrderAmount || '2500'}</p>
                <p><strong>Bank:</strong> {formData.bankName}</p>
                <p><strong>A/C Holder:</strong> {formData.accountHolderName}</p>
                <p><strong>IFSC:</strong> {formData.ifscCode}</p>
              </div>
            </div>

            {/* Declared Dishes Summary in Review */}
            {(formData.dishesList || []).filter(d => d.name?.trim()).length > 0 && (
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="font-bold text-secondary uppercase text-[10px] block mb-2.5">
                  Declared Signature Dishes & Pricing ({formData.dishesList.filter(d => d.name?.trim()).length} Items)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {formData.dishesList.filter(d => d.name?.trim()).map((dish, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-outline-variant/40 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{dish.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {dish.category} • <span className={dish.dietary === 'VEG' ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>{dish.dietary}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#0D381E] bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-100">
                        ₹{dish.pricePerHead}/head
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={e => handleChange('agreedToTerms', e.target.checked)}
                  className="mt-1 accent-secondary"
                />
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  I hereby declare that all information submitted is authentic, and our kitchen complies with Food Tailor culinary standards, FSSAI hygiene guidelines, and commercial partnership terms.
                </span>
              </label>
              {errors.agreedToTerms && <p className="text-red-500 text-xs mt-2">{errors.agreedToTerms}</p>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-outline-variant/30">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold uppercase tracking-wider text-primary-container hover:bg-surface-container-low transition-all"
              >
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isApproved && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all"
              >
                {savingDraft ? 'Saving...' : 'Save Draft'}
              </button>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container/90 transition-all shadow-sm"
              >
                Continue to Step 0{currentStep + 1}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || isApproved}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                  isApproved
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-secondary text-white hover:bg-secondary/90'
                }`}
              >
                {submitting ? 'Submitting Application...' : isApproved ? 'Application Approved' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
