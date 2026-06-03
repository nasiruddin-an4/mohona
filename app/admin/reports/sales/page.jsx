'use client';

import React, { useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Download, Calendar, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState('This Month');

  const summaryCards = [
    { title: 'Total Revenue', value: '$84,592.00', trend: '+8.2%', isPositive: true, icon: DollarSign, cardBg: 'bg-[#cbf4f0]', textColor: 'text-teal-900', iconColor: 'text-teal-600' },
    { title: 'Total Orders', value: '1,249', trend: '-2.4%', isPositive: false, icon: ShoppingCart, cardBg: 'bg-[#caf4a2]', textColor: 'text-lime-900', iconColor: 'text-lime-700' },
    { title: 'Average Order Value', value: '$67.72', trend: '+1.1%', isPositive: true, icon: TrendingUp, cardBg: 'bg-[#ffec99]', textColor: 'text-yellow-900', iconColor: 'text-yellow-700' },
    { title: 'Conversion Rate', value: '3.8%', trend: '+3.2%', isPositive: true, icon: BarChart3, cardBg: 'bg-[#fce1f4]', textColor: 'text-pink-900', iconColor: 'text-pink-600' },
  ];

  // Mock bar chart data
  const barChartData = [
    { label: '1', value: 30 }, { label: '2', value: 45 }, { label: '3', value: 25 },
    { label: '4', value: 60 }, { label: '5', value: 75 }, { label: '6', value: 40 },
    { label: '7', value: 85 }, { label: '8', value: 65 }, { label: '9', value: 95 },
    { label: '10', value: 50 }, { label: '11', value: 55 }, { label: '12', value: 80 },
    { label: '13', value: 40 }, { label: '14', value: 70 }, { label: '15', value: 60 },
  ];

  const topProducts = [
    { name: 'Matte Liquid Lipstick', category: 'Beauty', sales: 342, revenue: '$4,104.00' },
    { name: 'Premium Leather Wallet', category: 'Accessories', sales: 215, revenue: '$8,600.00' },
    { name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', sales: 156, revenue: '$23,400.00' },
    { name: 'Organic Cotton T-Shirt', category: 'Apparel', sales: 498, revenue: '$9,960.00' },
    { name: 'Smart Fitness Watch', category: 'Electronics', sales: 124, revenue: '$18,600.00' },
  ];

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Analyze your store's performance and revenue</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative shrink-0 flex-1 sm:flex-none">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 cursor-pointer shadow-sm"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
          
          <button className="bg-[#0f8b80] hover:bg-[#0c766d] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className={`${card.cardBg} p-5 rounded-2xl flex flex-col gap-4 transition-transform hover:-translate-y-1 shadow-sm`}>
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 ${card.iconColor}`}>
                  <card.icon size={24} strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {card.trend}
                  {card.isPositive && <ArrowUpRight size={14} />}
                </div>
              </div>
              <div>
                <p className={`font-bold text-sm mb-1 uppercase tracking-wide opacity-80 ${card.textColor}`}>{card.title}</p>
                <h3 className={`text-3xl font-bold ${card.textColor}`}>{card.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-[#0f8b80]"></span> Current Period
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] flex items-end gap-2 pb-6 relative">
            {/* Y Axis Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6">
              {[4, 3, 2, 1, 0].map(i => (
                <div key={i} className="w-full border-b border-gray-100 border-dashed flex items-end relative">
                  <span className="absolute -top-3 -left-2 text-[10px] font-bold text-gray-400 bg-white pr-2">${i * 25}k</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex items-end gap-2 sm:gap-4 w-full h-full pt-4 pl-8">
              {barChartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover (simulated via CSS group) */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none transition-opacity z-20 whitespace-nowrap">
                    ${(data.value * 1000).toLocaleString()}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-[#0f8b80]/20 group-hover:bg-[#0f8b80] rounded-t-md transition-all duration-300 relative overflow-hidden" 
                    style={{ height: `${data.value}%` }}
                  >
                    {/* Subtle gradient effect on bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10"></div>
                  </div>
                  
                  {/* X Axis Label */}
                  <span className="text-[10px] font-bold text-gray-400 absolute -bottom-5">{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources / Circular chart mockup */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* CSS-based Donut Chart Mock */}
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center" 
                 style={{ 
                   background: 'conic-gradient(#0f8b80 0% 45%, #f59e0b 45% 75%, #3b82f6 75% 90%, #e5e7eb 90% 100%)' 
                 }}>
              {/* Inner Circle */}
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-gray-400 text-xs font-bold uppercase">Total</span>
                <span className="text-xl font-bold text-gray-900">100%</span>
              </div>
            </div>
            
            <div className="w-full mt-8 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-[#0f8b80]"></div> Electronics
                </div>
                <span className="font-bold text-gray-900">45%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> Fashion
                </div>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div> Beauty
                </div>
                <span className="font-bold text-gray-900">15%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div> Other
                </div>
                <span className="font-bold text-gray-900">10%</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Top Selling Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-2">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
          <button className="text-sm font-bold text-[#0f8b80] hover:text-[#0c766d] transition-colors">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider">Product Name</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider text-right">Sales Count</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{product.sales}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#0f8b80]">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
