'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, percentage, trend, bg, textPrefix = '' }) {
  const isUp = trend === 'up';

  return (
    <div className={`${bg} rounded-[20px] p-5 flex flex-col justify-between h-[130px] shadow-sm relative overflow-hidden transition-transform hover:-translate-y-1 duration-300 border border-black/5`}>
      <span className="text-[13px] font-bold text-gray-800/70">{title}</span>
      
      <div className="flex justify-between items-end mt-auto">
        <span className="text-[32px] font-black text-gray-900 tracking-tight leading-none">
          {textPrefix}{value}
        </span>
        
        <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-black shadow-sm">
          <span className={isUp ? 'text-emerald-600' : 'text-red-500'}>
            {isUp ? '+' : '-'}{percentage}%
          </span>
          {isUp ? <TrendingUp size={14} className="text-emerald-600" /> : <TrendingDown size={14} className="text-red-500" />}
        </div>
      </div>
    </div>
  );
}
