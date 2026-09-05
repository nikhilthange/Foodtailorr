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
    console.error('Atelier Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <span className="font-label-editorial text-xs uppercase tracking-widest text-secondary font-semibold mb-2">
        Notice of Service Interruption
      </span>
      <h1 className="font-headline-xl text-xl md:text-2xl text-primary-container font-bold mb-3">
        An Unanticipated Exception Occurred
      </h1>
      <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
        {error?.message || 'Our atelier concierges have been alerted and are resolving the matter.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
      >
        Re-attempt Commission
      </button>
    </div>
  );
}
