'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Download, Calendar, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState('This Month');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders', { cache: 'no-store' }),
          fetch('/api/products', { cache: 'no-store' })
        ]);
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        
        if (ordersData.success) setOrders(ordersData.data);
        if (productsData.success) setProducts(productsData.data);
      } catch (error) {
        console.error("Failed to fetch reports data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute Real Data
  const validOrders = orders.filter(o => !['Cancelled', 'Returned', 'Refunded'].includes(o.status));
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = validOrders.length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  const summaryCards = [
    { title: 'Total Revenue', value: `BDT ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, trend: '+0.0%', isPositive: true, icon: DollarSign, cardBg: 'bg-[#cbf4f0]', textColor: 'text-teal-900', iconColor: 'text-teal-600' },
    { title: 'Total Orders', value: totalOrders.toLocaleString(), trend: '+0.0%', isPositive: true, icon: ShoppingCart, cardBg: 'bg-[#caf4a2]', textColor: 'text-lime-900', iconColor: 'text-lime-700' },
    { title: 'Average Order Value', value: `BDT ${averageOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, trend: '+0.0%', isPositive: true, icon: TrendingUp, cardBg: 'bg-[#ffec99]', textColor: 'text-yellow-900', iconColor: 'text-yellow-700' },
    { title: 'Conversion Rate', value: 'N/A', trend: '0.0%', isPositive: true, icon: BarChart3, cardBg: 'bg-[#fce1f4]', textColor: 'text-pink-900', iconColor: 'text-pink-600' },
  ];

  // Group by Date for Chart (Last 15 days)
  const last15Days = [];
  for(let i=14; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString();
    
    const dayOrders = validOrders.filter(o => new Date(o.createdAt).toLocaleDateString() === dateStr);
    const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    last15Days.push({ label: d.getDate().toString(), rawValue: dayRevenue });
  }
  const maxDayRevenue = Math.max(...last15Days.map(d => d.rawValue), 1);
  const barChartData = last15Days.map(d => ({
    label: d.label,
    rawValue: d.rawValue,
    value: (d.rawValue / maxDayRevenue) * 100
  }));

  // Product & Category Stats
  const productStats = {};
  const categoryStats = {};
  
  validOrders.forEach(order => {
    if(order.cart_items) {
      order.cart_items.forEach(item => {
        const product = products.find(p => p._id === item.product);
        const catName = product?.category?.name || 'Uncategorized';
        
        if(!productStats[item.product_name]) {
          productStats[item.product_name] = { name: item.product_name, category: catName, sales: 0, revenue: 0 };
        }
        productStats[item.product_name].sales += item.quantity || 1;
        productStats[item.product_name].revenue += (item.price * (item.quantity || 1)) || 0;

        if(!categoryStats[catName]) categoryStats[catName] = 0;
        categoryStats[catName] += (item.price * (item.quantity || 1)) || 0;
      });
    }
  });

  const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  const totalCatRevenue = Object.values(categoryStats).reduce((sum, v) => sum + v, 0);
  const catEntries = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const colors = ['#0f8b80', '#f59e0b', '#3b82f6', '#8b5cf6', '#e5e7eb'];
  
  let currentPct = 0;
  const gradientStops = catEntries.map((cat, idx) => {
    const pct = totalCatRevenue > 0 ? (cat[1] / totalCatRevenue) * 100 : 0;
    const start = currentPct;
    currentPct += pct;
    return `${colors[idx % colors.length]} ${start}% ${currentPct}%`;
  }).join(', ');
  const conicGradient = gradientStops ? `conic-gradient(${gradientStops})` : 'conic-gradient(#e5e7eb 0% 100%)';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
      </div>
    );
  }

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
                <h3 className={`text-2xl lg:text-3xl font-bold ${card.textColor}`}>{card.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview (Last 15 Days)</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-[#0f8b80]"></span> Current Period
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] flex items-end gap-2 pb-6 relative">
            {/* Y Axis Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6">
              {[4, 3, 2, 1, 0].map(i => (
                <div key={i} className="w-full border-b border-gray-100 border-dashed flex items-end relative">
                  <span className="absolute -top-3 -left-2 text-[10px] font-bold text-gray-400 bg-white pr-2">{(maxDayRevenue * (i/4)).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex items-end gap-2 sm:gap-4 w-full h-full pt-4 pl-8">
              {barChartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none transition-opacity z-20 whitespace-nowrap">
                    BDT {data.rawValue.toLocaleString()}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-[#0f8b80]/20 group-hover:bg-[#0f8b80] rounded-t-md transition-all duration-300 relative overflow-hidden" 
                    style={{ height: `${data.value}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10"></div>
                  </div>
                  
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
                 style={{ background: conicGradient }}>
              {/* Inner Circle */}
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-gray-400 text-xs font-bold uppercase">Total</span>
                <span className="text-xl font-bold text-gray-900">100%</span>
              </div>
            </div>
            
            <div className="w-full mt-8 space-y-3">
              {catEntries.length > 0 ? catEntries.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div> {cat[0]}
                  </div>
                  <span className="font-bold text-gray-900">{((cat[1] / totalCatRevenue) * 100).toFixed(1)}%</span>
                </div>
              )) : (
                <div className="text-center text-gray-500 text-sm">No sales data yet</div>
              )}
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
              {topProducts.length > 0 ? topProducts.map((product, idx) => (
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
                  <td className="px-6 py-4 text-right font-bold text-[#0f8b80]">BDT {product.revenue.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">No products sold yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
