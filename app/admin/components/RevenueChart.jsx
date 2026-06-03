'use client';

import React from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 15000, order: 8000 },
  { name: 'Feb', revenue: 10000, order: 9000 },
  { name: 'Mar', revenue: 20000, order: 12000 },
  { name: 'Apr', revenue: 18000, order: 10000 },
  { name: 'May', revenue: 12000, order: 8000 },
  { name: 'Jun', revenue: 32000, order: 18000 },
  { name: 'Jul', revenue: 22000, order: 15000 },
  { name: 'Aug', revenue: 18000, order: 10000 },
  { name: 'Sep', revenue: 20000, order: 12000 },
  { name: 'Oct', revenue: 28000, order: 14000 },
  { name: 'Nov', revenue: 30000, order: 22000 },
  { name: 'Dec', revenue: 36000, order: 18000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue</h2>
           <div className="flex gap-8">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                 <span className="text-sm font-bold text-gray-500">Revenue</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-2xl font-bold text-gray-900">$37,802</span>
                 <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                   <TrendingUp size={14} /> 0.56%
                 </div>
               </div>
             </div>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                 <span className="text-sm font-bold text-gray-500">Order</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-2xl font-bold text-gray-900">$28,305</span>
                 <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                   <TrendingUp size={14} /> 0.56%
                 </div>
               </div>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
          Yearly
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="flex-1 min-h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
               dataKey="name" 
               axisLine={false} 
               tickLine={false} 
               tick={{ fontSize: 12, fill: '#9ca3af' }} 
               dy={10}
            />
            <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{ fontSize: 12, fill: '#9ca3af' }}
               dx={-10}
               hide={true} // hidden in the screenshot but good to have if needed
            />
            <Tooltip 
               cursor={{ fill: 'rgba(249, 250, 251, 0.5)' }}
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="revenue" fill="#fb923c" radius={[4, 4, 4, 4]} barSize={12} />
            <Line type="monotone" dataKey="order" stroke="#818cf8" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
