'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from '../../lib/navigation';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await register({ email, password, firstName, lastName });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check details.');
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
            Private Host Membership
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#173E23] font-bold tracking-tight mb-2">
            Join the Atelier
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed font-sans">
            Create your host account for bespoke culinary degustations.
          </p>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] p-3.5 rounded-xl mb-5 text-xs font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-circle text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#173E23] font-bold">
                First Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#1A1A1A]/40 flex items-center pointer-events-none">
                  <i className="bi bi-person text-sm" />
                </span>
                <input 
                  type="text" 
                  required 
                  value={firstName}
                  placeholder="Rohit"
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-white rounded-xl border border-[#E5E5E0] focus:outline-none focus:border-[#173E23] focus:ring-1 focus:ring-[#173E23] text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/35 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#173E23] font-bold">
                Last Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#1A1A1A]/40 flex items-center pointer-events-none">
                  <i className="bi bi-person text-sm" />
                </span>
                <input 
                  type="text" 
                  required 
                  value={lastName}
                  placeholder="Sharma"
                  onChange={e => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-white rounded-xl border border-[#E5E5E0] focus:outline-none focus:border-[#173E23] focus:ring-1 focus:ring-[#173E23] text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/35 transition-all"
                />
              </div>
            </div>
          </div>

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
                placeholder="rohit@example.com"
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E5E5E0] focus:outline-none focus:border-[#173E23] focus:ring-1 focus:ring-[#173E23] text-[#1A1A1A] text-sm placeholder:text-[#1A1A1A]/35 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#173E23] font-bold">
              Password
            </label>
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
                <span>Registering...</span>
              </>
            ) : (
              <>
                <i className="bi bi-person-plus text-sm" />
                <span>Request Access</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-7 text-center border-t border-[#E5E5E0] pt-5">
          <span className="text-xs text-[#1A1A1A]/70">Already an atelier member? </span>
          <Link to="/login" className="text-xs font-bold text-[#C65518] uppercase tracking-wider hover:underline transition-colors ml-1">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
