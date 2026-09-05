'use client';

import React from 'react';

/**
 * Badge — Standardized pill badge for status, diet, and category indicators.
 */
export default function Badge({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'terracotta', 'outline'
  size = 'md', // 'sm', 'md'
  icon: Icon,
  className = '',
}) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  const variantClasses = {
    default: 'bg-[#173E23]/10 text-[#173E23] border border-[#173E23]/20',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    terracotta: 'bg-[#C55418]/10 text-[#C55418] border border-[#C55418]/25',
    outline: 'bg-transparent text-[#1c1c18] border border-[#c1c8bf]',
  }[variant] || 'bg-[#173E23]/10 text-[#173E23] border border-[#173E23]/20';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider ${sizeClasses} ${variantClasses} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} strokeWidth={2.2} />}
      <span>{children}</span>
    </span>
  );
}
