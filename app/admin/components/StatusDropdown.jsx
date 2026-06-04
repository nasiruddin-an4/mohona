'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function StatusDropdown({ value, options, onChange, getStyle, roundedStyle = "rounded-md" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStyle = getStyle(value) || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className={`relative inline-flex ${isOpen ? 'z-50' : 'z-0'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-1.5 px-3 py-1 text-[11px] font-bold ${roundedStyle} border shadow-sm transition-all hover:opacity-80 outline-none uppercase tracking-wider ${currentStyle}`}
      >
        <span>{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} opacity-70`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 top-full left-1/2 -translate-x-1/2 w-36 rounded-xl bg-white shadow-xl border border-gray-100 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between transition-colors
                  ${value === option ? 'bg-gray-50 text-[#0f8b80]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                {option}
                {value === option && <Check size={14} strokeWidth={3} className="text-[#0f8b80]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
