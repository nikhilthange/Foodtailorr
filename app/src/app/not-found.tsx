import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center max-w-md mx-auto">
      <span className="w-2.5 h-2.5 rounded-full bg-secondary mb-3"></span>
      <span className="font-label-editorial text-xs uppercase tracking-widest text-secondary font-semibold mb-2">
        404 — Atelier Folio Not Found
      </span>
      <h1 className="font-headline-xl text-2xl md:text-3xl text-primary-container font-bold mb-3">
        This Course Does Not Exist
      </h1>
      <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
        The table or tasting archive you are seeking is unavailable or has been relocated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
      >
        Return to Grand Salon
      </Link>
    </div>
  );
}
