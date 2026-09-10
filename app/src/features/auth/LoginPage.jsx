'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from '../../lib/navigation';
import { useAuth } from './AuthContext';
import FoodTailorLogo from '../../components/ui/svg/FoodTailorLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickFill = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError(null);
  };

  const handleLoginSuccess = (user) => {
    if (user.role === 'ADMIN') {
      navigate('/admin');
    } else if (user.role === 'PARTNER') {
      navigate('/partner');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const loggedUser = await login({ email, password });
      handleLoginSuccess(loggedUser);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.error || err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-16 sm:py-24 bg-slate-50/60">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
        
        {/* Header & Logo Lockup */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <FoodTailorLogo className="h-9 sm:h-10 w-auto mx-auto" />
          </Link>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-1">
            Food Tailor Account
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-slate-900 font-extrabold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Sign in to manage your catering bookings and custom menus.
          </p>
        </div>

        {/* Demo Persona Quick Fill */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0D381E] mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="bi bi-lightning-charge text-[#C85419] text-sm" />
              <span>Demo Quick-Fill</span>
            </span>
            <span className="text-[10px] text-[#C85419] lowercase tracking-normal font-semibold">
              one-click sign in
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleQuickFill('test@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#0D381E] hover:text-white text-[#0D381E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 text-center border border-slate-200 shadow-xs"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickFill('partner1@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#0D381E] hover:text-white text-[#0D381E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 text-center border border-slate-200 shadow-xs"
            >
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickFill('admin@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#0D381E] hover:text-white text-[#0D381E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 text-center border border-slate-200 shadow-xs"
            >
              Admin
            </button>
          </div>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-xl mb-5 text-xs font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-circle text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                <i className="bi bi-envelope text-sm" />
              </span>
              <input 
                type="email" 
                required 
                value={email}
                placeholder="e.g. test@foodtailor.in"
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D381E] focus:bg-white focus:ring-2 focus:ring-[#0D381E]/10 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-slate-700 font-bold">
                Password
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Default: password123</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                <i className="bi bi-lock text-sm" />
              </span>
              <input 
                type="password" 
                required 
                value={password}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D381E] focus:bg-white focus:ring-2 focus:ring-[#0D381E]/10 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin text-sm" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right text-sm" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-7 text-center border-t border-slate-100 pt-5">
          <span className="text-xs text-slate-500">New to Food Tailor? </span>
          <Link to="/register" className="text-xs font-bold text-[#C85419] uppercase tracking-wider hover:underline transition-colors ml-1">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
