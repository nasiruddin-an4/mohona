'use client';

import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

export default function TopSaleList({ orders = [] }) {
  const topProducts = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    const productMap = {};
    
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const pId = item.product_id;
        if (!productMap[pId]) {
          productMap[pId] = {
            id: pId,
            name: item.name,
            price: item.price,
            image: item.image || 'https://via.placeholder.com/150',
            sales: 0
          };
        }
        productMap[pId].sales += item.quantity || 1;
      });
    });
    
    return Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6);
  }, [orders]);

  return (
    <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Top sale</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
          Weekly
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {topProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">No sales data yet</div>
        ) : topProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                <p className="text-xs font-bold text-gray-500">BDT {product.price}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md shrink-0">
              {product.sales} Sales
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
