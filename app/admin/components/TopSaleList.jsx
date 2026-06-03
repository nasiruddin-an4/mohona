'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const topProducts = [
  { id: 1, name: 'Neptune Longsleeve', price: 138, sales: 952, image: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Ribbed Tank Top', price: 108, sales: 952, image: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Ribbed modal T-shirt', price: 125, sales: 902, image: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Oversized Motif T-shirt', price: 98, sales: 882, image: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'V-neck linen T-shirt', price: 158, sales: 869, image: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Jersey thong body', price: 78, sales: 833, image: 'https://i.pravatar.cc/150?img=6' },
];

export default function TopSaleList() {
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
        {topProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                <p className="text-xs font-bold text-gray-500">${product.price}</p>
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
