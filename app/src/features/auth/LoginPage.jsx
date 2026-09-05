'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from '../../lib/navigation';
import { useAuth } from './AuthContext';

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
    if (e) e.preventDefault();
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
    <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 py-14 sm:py-20 bg-[#FAFAF8]">
      <div className="w-full max-w-md bg-[#FAFAF8] p-8 sm:p-10 rounded-2xl border border-[#E5E5E0] shadow-sm">
        
        {/* Fine-Dining Header & Logo Lockup */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#173E23]">food</span>
            <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#C65518]">tailor</span>
          </div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C65518] block mb-1">
            Private Culinary Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#173E23] font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans">
            Sign in to orchestrate bespoke catering or oversee your atelier guild.
          </p>
        </div>

        {/* Demo Persona Quick Fill */}
        <div className="mb-6 p-3.5 bg-[#F2EFE6] rounded-xl border border-[#E5E5E0]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#173E23] mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <i className="bi bi-lightning-charge text-[#C65518] text-sm" />
              <span>Demo Quick-Fill</span>
            </span>
            <span className="text-[10px] text-[#C65518] lowercase tracking-normal font-semibold">
              one-click sign in
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleQuickFill('test@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#173E23] hover:text-white text-[#173E23] text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-center border border-[#E5E5E0] shadow-2xs"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickFill('partner1@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#173E23] hover:text-white text-[#173E23] text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-center border border-[#E5E5E0] shadow-2xs"
            >
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickFill('admin@foodtailor.in', 'password123')}
              className="py-2 px-2 bg-white hover:bg-[#173E23] hover:text-white text-[#173E23] text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 text-center border border-[#E5E5E0] shadow-2xs"
            >
              Admin
            </button>
          </div>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] p-3.5 rounded-xl mb-5 text-xs font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-circle text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#173E23] font-bold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#1A1A1A]/40 flex items-center pointer-events-none">
                <i className="bi bi-envelope text-sm" />
              </span>
              <input 
                type="email" 
                required 
                value={email}
                placeholder="e.g. test@foodtailor.in"
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5E5E0] focus:outline-none focus:border-[#173E23] focus:ring-1 focus:ring-[#173E23] text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/35 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-[#173E23] font-bold">
                Password
              </label>
              <span className="text-[10px] text-[#1A1A1A]/50 font-mono">Default: password123</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#1A1A1A]/40 flex items-center pointer-events-none">
                <i className="bi bi-lock text-sm" />
              </span>
              <input 
                type="password" 
                required 
                value={password}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5E5E0] focus:outline-none focus:border-[#173E23] focus:ring-1 focus:ring-[#173E23] text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/35 transition-all"
              />
            </div>
          </div>

          {/* Solid Primary Button */}
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
        
        <div className="mt-7 text-center border-t border-[#E5E5E0] pt-5">
          <span className="text-xs text-[#1A1A1A]/70">New to Food Tailor? </span>
          <Link to="/register" className="text-xs font-bold text-[#C65518] uppercase tracking-wider hover:underline transition-colors ml-1">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
