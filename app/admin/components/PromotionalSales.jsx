'use client';

import React from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Website', value: 65, color: '#3b82f6' },
  { name: 'Store', value: 25, color: '#f97316' },
  { name: 'Social Media', value: 10, color: '#8b5cf6' },
];

export default function PromotionalSales() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Promotional Sales</h2>
           <div className="flex items-center gap-2 mb-1">
             <span className="text-xs font-bold text-gray-400">Visitors</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-xl font-bold text-gray-900">7,802</span>
             <div className="flex items-center gap-1 text-xs font-bold text-green-500">
               <TrendingUp size={14} /> 0.56%
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
          Weekly
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 mx-auto mb-1"></div>
            <p className="text-sm font-bold text-gray-900">Website</p>
            <div className="flex items-center justify-center gap-1">
               <span className="text-xs font-bold text-gray-900">1,016</span>
               <div className="flex items-center text-[10px] font-bold text-blue-500">
                 <TrendingUp size={12} /> 2.1%
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
         {data.map((item) => (
           <div key={item.name} className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
             <span className="text-xs font-bold text-gray-500">{item.name}</span>
           </div>
         ))}
      </div>
    </div>
  );
}
