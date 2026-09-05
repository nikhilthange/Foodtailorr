'use client';

import React from 'react';

/**
 * LoadingState — Standardized animated loading state with editorial styling.
 */
export default function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`py-16 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-9 h-9 border-3 border-[#173E23] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs uppercase tracking-widest text-[#173E23] font-bold">
        {message}
      </p>
    </div>
  );
}
