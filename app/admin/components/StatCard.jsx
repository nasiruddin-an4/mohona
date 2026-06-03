'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

export default function StatCard({ title, value, percentage, trend, timeRange, icon: Icon, color, trendData }) {
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[180px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}>
             {Icon && <Icon size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-sm font-medium text-gray-500">{title}</span>
               <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                 {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                 {percentage}%
               </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
          {timeRange}
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="h-16 w-full flex items-end">
         {/* Simple SVG Sparkline placeholder for now */}
         <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
           <path 
             d={trendData || "M0 40 Q 10 20, 20 30 T 40 20 T 60 30 T 80 10 T 100 20"} 
             fill="none" 
             stroke={isUp ? "#22c55e" : "#ef4444"} 
             strokeWidth="3" 
             strokeLinecap="round" 
             strokeLinejoin="round" 
           />
           {/* Add a subtle gradient fill below the line */}
           <path 
             d={(trendData || "M0 40 Q 10 20, 20 30 T 40 20 T 60 30 T 80 10 T 100 20") + " L100 40 L0 40 Z"} 
             fill={`url(#gradient-${isUp ? 'up' : 'down'})`} 
             opacity="0.2"
           />
           <defs>
             <linearGradient id="gradient-up" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
               <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
             </linearGradient>
             <linearGradient id="gradient-down" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
               <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
             </linearGradient>
           </defs>
         </svg>
      </div>
    </div>
  );
}
