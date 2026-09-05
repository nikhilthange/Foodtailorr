'use client';

import React from 'react';
import { AuthProvider } from '../features/auth/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-surface text-on-surface font-body-md w-full">
        <Navbar />
        <main className="flex-1 w-full pt-16 pb-24 relative">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
