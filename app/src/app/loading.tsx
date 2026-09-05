import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-24 text-center px-4">
      <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <span className="font-label-editorial text-xs uppercase tracking-widest text-secondary font-semibold">
        Curating Atelier Experience...
      </span>
    </div>
  );
}
