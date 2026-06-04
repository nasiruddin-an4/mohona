'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Download, Calendar, ArrowUpRight, Package, Search, Eye } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';

export default function SalesReportsPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter Logic
  const filteredSales = orders.filter(order => {
    // Search
    const matchesSearch = 
      (order.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Status (Exclude cancelled/returned unless explicitly searched, or if statusFilter is empty, default to successful sales)
    let matchesStatus = true;
    if (statusFilter) {
      matchesStatus = order.status?.toLowerCase() === statusFilter.toLowerCase();
    } else {
      matchesStatus = !['Cancelled', 'Returned', 'Refunded', 'Failed'].includes(order.status) && !['failed'].includes(order.payment_status?.toLowerCase());
    }

    // Date
    let matchesDate = true;
    if (startDate && endDate && order.createdAt) {
      matchesDate = isWithinInterval(new Date(order.createdAt), {
        start: startOfDay(new Date(startDate)),
        end: endOfDay(new Date(endDate))
      });
    } else if (startDate && order.createdAt) {
      matchesDate = new Date(order.createdAt) >= startOfDay(new Date(startDate));
    } else if (endDate && order.createdAt) {
      matchesDate = new Date(order.createdAt) <= endOfDay(new Date(endDate));
    }

    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Compute Real Data
  const totalRevenue = filteredSales.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = filteredSales.length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const totalItemsSold = filteredSales.reduce((sum, o) => {
    // some orders might have .cart_items from older versions, new ones use .items
    const items = o.items || o.cart_items || [];
    const itemsInOrder = items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
    return sum + itemsInOrder;
  }, 0);

  const summaryCards = [
    { title: 'Total Revenue', value: `BDT ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: '+0.0%', isPositive: true, icon: DollarSign, cardBg: 'bg-[#cbf4f0]', textColor: 'text-teal-900', iconColor: 'text-teal-600' },
    { title: 'Total Orders', value: totalOrders.toLocaleString(), trend: '+0.0%', isPositive: true, icon: ShoppingCart, cardBg: 'bg-[#caf4a2]', textColor: 'text-lime-900', iconColor: 'text-lime-700' },
    { title: 'Average Order Value', value: `BDT ${averageOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, trend: '+0.0%', isPositive: true, icon: TrendingUp, cardBg: 'bg-[#ffec99]', textColor: 'text-yellow-900', iconColor: 'text-yellow-700' },
    { title: 'Items Sold', value: `${totalItemsSold} pcs`, trend: '+0.0%', isPositive: true, icon: Package, cardBg: 'bg-[#fce1f4]', textColor: 'text-pink-900', iconColor: 'text-pink-600' },
  ];

  // Export to PDF
  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateText = (startDate && endDate) 
      ? `From: ${format(new Date(startDate), 'dd MMM yyyy')} To: ${format(new Date(endDate), 'dd MMM yyyy')}`
      : 'All Time';
    doc.text(dateText, 14, 22);

    const tableColumn = ["Date", "Order ID", "Customer", "Items", "Status", "Revenue"];
    const tableRows = [];

    filteredSales.forEach(order => {
      const items = order.items || order.cart_items || [];
      const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      tableRows.push([
        order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-',
        order.order_number || `#${order._id.slice(-5).toUpperCase()}`,
        order.customer_name || '-',
        itemCount.toString(),
        order.status || 'Pending',
        `BDT ${order.total_amount?.toFixed(2)}`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 139, 128] },
      foot: [["", "", "", "", "Total Revenue", `BDT ${totalRevenue.toFixed(2)}`]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    const stamp = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`Sales_Report_${stamp}.pdf`);
  };

  // Group by Date for Chart (Last 15 days from EndDate or Today)
  const last15Days = [];
  const referenceDate = endDate ? new Date(endDate) : new Date();
  for(let i=14; i>=0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString();
    
    // Use filteredSales so the chart updates based on status filter
    const dayOrders = filteredSales.filter(o => new Date(o.createdAt).toLocaleDateString() === dateStr);
    const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    last15Days.push({ label: d.getDate().toString(), rawValue: dayRevenue });
  }
  const maxDayRevenue = Math.max(...last15Days.map(d => d.rawValue), 1);
  const barChartData = last15Days.map(d => ({
    label: d.label,
    rawValue: d.rawValue,
    value: (d.rawValue / maxDayRevenue) * 100
  }));

  // Product & Category Stats from filteredSales
  const productStats = {};
  const categoryStats = {};
  
  filteredSales.forEach(order => {
    const items = order.items || order.cart_items || [];
    items.forEach(item => {
      // Find category from products if available
      const product = products.find(p => p._id === (item.product_id || item.product));
      const catName = product?.category || 'Uncategorized';
      const itemName = item.name || item.product_name || 'Unknown Item';
      
      if(!productStats[itemName]) {
        productStats[itemName] = { name: itemName, category: catName, sales: 0, revenue: 0 };
      }
      productStats[itemName].sales += item.quantity || 1;
      productStats[itemName].revenue += (item.price * (item.quantity || 1)) || 0;

      if(!categoryStats[catName]) categoryStats[catName] = 0;
      categoryStats[catName] += (item.price * (item.quantity || 1)) || 0;
    });
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

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setSearchQuery('');
  };

  const getRStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-[#dcfce7] text-emerald-700 border-emerald-200';
      case 'shipped': return 'bg-[#e0f2fe] text-sky-700 border-sky-200';
      case 'pending': return 'bg-[#fef3c7] text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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
        
        <button 
          onClick={handleDownloadPDF}
          className="bg-[#0f8b80] hover:bg-[#0c766d] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download size={16} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col xl:flex-row justify-between gap-4">
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">From:</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[13px] font-bold text-gray-600 focus:outline-none w-full md:w-auto"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">To:</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[13px] font-bold text-gray-600 focus:outline-none w-full md:w-auto"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[13px] font-bold text-gray-600 focus:outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="">All Successful</option>
            <option value="Delivered">Delivered</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
          </select>

          <button 
            onClick={clearFilters}
            className="text-[12px] font-bold text-gray-400 hover:text-gray-700 underline decoration-gray-300 underline-offset-4 w-full md:w-auto text-center mt-2 md:mt-0"
          >
            Clear Filters
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

        {/* Traffic Sources / Circular chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* CSS-based Donut Chart */}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Top Selling Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
          </div>
          
          <div className="overflow-x-auto h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 sticky top-0 shadow-sm z-10">
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
                      <span className="font-bold text-gray-800 line-clamp-1 max-w-[200px]">{product.name}</span>
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

        {/* Recent Sales Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Filtered Sales Logs</h2>
            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{filteredSales.length} orders</span>
          </div>
          
          <div className="overflow-x-auto h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[11px] tracking-wider text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSales.length > 0 ? filteredSales.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                      {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.order_number || order._id}`} className="font-bold text-[#0f8b80] hover:underline">
                        {order.order_number || `#${order._id.slice(-5).toUpperCase()}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRStatusStyle(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">BDT {order.total_amount?.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No matching orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
}
