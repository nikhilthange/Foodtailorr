'use client';
import React, { useState } from 'react';
import { Link, useNavigate } from '../../lib/navigation';
import { useAuth } from './AuthContext';
import FoodTailorLogo from '../../components/ui/svg/FoodTailorLogo';

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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-16 sm:py-24 bg-slate-50/60">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
        
        {/* Header & Logo Lockup */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-3">
            <FoodTailorLogo className="h-9 sm:h-10 w-auto mx-auto" />
          </Link>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C85419] block mb-1">
            Get Started
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-slate-900 font-extrabold tracking-tight mb-2">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Create your account to start crafting custom menus for your events.
          </p>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-xl mb-5 text-xs font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-circle text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-700 font-bold">
                First Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
                  <i className="bi bi-person text-sm" />
                </span>
                <input 
                  type="text" 
                  required 
                  value={firstName}
                  placeholder="Rohit"
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D381E] focus:bg-white focus:ring-2 focus:ring-[#0D381E]/10 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-700 font-bold">
                Last Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
                  <i className="bi bi-person text-sm" />
                </span>
                <input 
                  type="text" 
                  required 
                  value={lastName}
                  placeholder="Sharma"
                  onChange={e => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D381E] focus:bg-white focus:ring-2 focus:ring-[#0D381E]/10 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>
          </div>

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
                placeholder="rohit@example.com"
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D381E] focus:bg-white focus:ring-2 focus:ring-[#0D381E]/10 text-slate-900 text-sm placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Password
            </label>
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <i className="bi bi-person-plus text-sm" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-7 text-center border-t border-slate-100 pt-5">
          <span className="text-xs text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-xs font-bold text-[#C85419] uppercase tracking-wider hover:underline transition-colors ml-1">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
