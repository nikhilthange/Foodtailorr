import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] py-20 px-4 text-center max-w-md mx-auto">
      <span className="w-2.5 h-2.5 rounded-full bg-[#C85419] mb-3"></span>
      <span className="text-xs uppercase tracking-widest text-[#C85419] font-bold mb-2">
        404 — Page Not Found
      </span>
      <h1 className="font-serif text-2xl md:text-3xl text-slate-900 font-bold mb-3">
        Page Not Found
      </h1>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        The page or menu you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
      >
        Return to Home
      </Link>
    </div>
  );
}
