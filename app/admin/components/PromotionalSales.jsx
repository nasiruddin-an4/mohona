'use client';

import React, { useMemo } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function PromotionalSales({ orders = [] }) {
  const pieData = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    let cod = 0, bkash = 0, other = 0;
    
    orders.forEach(order => {
      const pm = (order.payment_method || '').toLowerCase();
      if (pm.includes('bkash')) bkash++;
      else if (pm.includes('cash') || pm.includes('cod')) cod++;
      else other++;
    });
    
    return [
      { name: 'bKash', value: bkash, color: '#E2136E' },
      { name: 'Cash on Delivery', value: cod, color: '#f59e0b' },
      { name: 'Other', value: other, color: '#3b82f6' },
    ].filter(item => item.value > 0);
  }, [orders]);
  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Methods</h2>
           <div className="flex items-center gap-2 mb-1">
             <span className="text-xs font-bold text-gray-400">Total Orders</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-xl font-bold text-gray-900">{orders.length}</span>
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
            {pieData.length === 0 ? null : (
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            )}
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            {pieData.length > 0 ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full border-2 mx-auto mb-1" style={{ borderColor: pieData[0].color }}></div>
                <p className="text-sm font-bold text-gray-900">{pieData[0].name}</p>
                <div className="flex items-center justify-center gap-1">
                   <span className="text-xs font-bold text-gray-900">{pieData[0].value}</span>
                </div>
              </>
            ) : (
              <span className="text-xs font-bold text-gray-400">No Data</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
         {pieData.map((item) => (
           <div key={item.name} className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
             <span className="text-xs font-bold text-gray-500">{item.name}</span>
           </div>
         ))}
      </div>
    </div>
  );
}
