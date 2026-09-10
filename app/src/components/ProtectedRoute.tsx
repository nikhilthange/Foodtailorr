'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigate } from '../lib/navigation';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuth() as {
    user: { id?: string; email?: string; role?: string; [key: string]: any } | null;
    loading: boolean;
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN') navigate('/admin', { replace: true });
        else if (user.role === 'PARTNER') navigate('/partner', { replace: true });
        else navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#0D2418] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Verifying Session...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
