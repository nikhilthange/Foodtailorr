'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState — Standardized error display honoring the Food Tailor error envelope.
 */
export default function ErrorState({
  title = 'An unexpected error occurred',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`py-12 px-6 text-center bg-red-50/70 border border-red-200 rounded-3xl max-w-md mx-auto my-6 flex flex-col items-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2} />
      </div>
      <h3 className="font-serif text-lg font-bold text-red-950 mb-1">
        {title}
      </h3>
      {message && (
        <p className="text-xs text-red-800/80 mb-4 font-sans leading-relaxed">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
