'use client';

import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <span className="text-xs uppercase tracking-widest text-[#C85419] font-bold mb-2">
        Something Went Wrong
      </span>
      <h1 className="font-serif text-xl md:text-2xl text-slate-900 font-bold mb-3">
        An Error Occurred
      </h1>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        {error?.message || 'We encountered an unexpected error. Please try again.'}
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
