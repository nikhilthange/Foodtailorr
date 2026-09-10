import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-24 text-center px-4">
      <div className="w-10 h-10 border-2 border-[#0D2418] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <span className="text-xs uppercase tracking-widest text-[#C85419] font-bold">
        Loading Menu...
      </span>
    </div>
  );
}
