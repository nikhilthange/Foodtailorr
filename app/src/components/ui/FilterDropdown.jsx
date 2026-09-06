'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function FilterDropdown({
  label,
  value,
  options = [],
  onChange,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-700/60 rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs active:scale-95"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-slate-400 font-normal mr-0.5">{label}:</span>
        <span className="font-semibold text-[#0D381E]">{selectedOption?.label || selectedOption?.name || 'All'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-[#0D381E] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label || opt.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0D381E]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
