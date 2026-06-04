'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Eye, Package, CreditCard, Box, Truck, CheckCircle, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import StatusDropdown from '../components/StatusDropdown';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, field, value) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      const data = await res.json();

      if (data.success) {
        setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? { ...o, [field]: value } : o));
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: `Order ${field.replace('_', ' ')} changed to ${value}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire('Error', data.error || 'Failed to update', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to communicate with server', 'error');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 3000); // 3 seconds real-time polling
    return () => clearInterval(interval);
  }, []);

  // Derive counts from actual API data
  const stats = {
    total: orders.length,
    pendingPayment: orders.filter(o => !o.payment_status || o.payment_status.toLowerCase() !== 'paid').length,
    processing: orders.filter(o => !o.status || ['pending', 'processing'].includes(o.status.toLowerCase())).length,
    shipped: orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
    cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
    returned: orders.filter(o => o.status?.toLowerCase() === 'returned').length,
    failed: orders.filter(o => ['failed', 'declined'].includes(o.payment_status?.toLowerCase())).length,
  };

  const summaryCards = [
    { title: 'Total Order', count: stats.total, icon: Package, bg: 'bg-[#bfdbfe]', text: 'text-blue-900', iconColor: 'text-blue-600' },
    { title: 'Pending Payment', count: stats.pendingPayment, icon: CreditCard, bg: 'bg-[#fef08a]', text: 'text-yellow-900', iconColor: 'text-yellow-600' },
    { title: 'Processing', count: stats.processing, icon: Box, bg: 'bg-[#ccfbf1]', text: 'text-teal-900', iconColor: 'text-teal-600' },
    { title: 'Shipped', count: stats.shipped, icon: Truck, bg: 'bg-[#fed7aa]', text: 'text-orange-900', iconColor: 'text-orange-600' },
    { title: 'Delivered', count: stats.delivered, icon: CheckCircle, bg: 'bg-[#fbcfe8]', text: 'text-pink-900', iconColor: 'text-pink-600' },
    { title: 'Cancel', count: stats.cancelled, icon: XCircle, bg: 'bg-[#fed7aa]', text: 'text-orange-900', iconColor: 'text-orange-600' },
    { title: 'Returned', count: stats.returned, icon: RotateCcw, bg: 'bg-[#d9f99d]', text: 'text-lime-900', iconColor: 'text-lime-600' },
    { title: 'Failed', count: stats.failed, icon: AlertCircle, bg: 'bg-[#bae6fd]', text: 'text-sky-900', iconColor: 'text-sky-600' },
  ];

  const getPStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'border-emerald-500 text-emerald-600 bg-emerald-50';
      case 'pending': return 'border-amber-500 text-amber-600 bg-amber-50';
      case 'unpaid': return 'border-red-500 text-red-600 bg-red-50';
      default: return 'border-amber-500 text-amber-600 bg-amber-50'; // Default pending
    }
  };

  const getRStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-[#dcfce7] text-emerald-700';
      case 'confirmed': return 'bg-[#fef3c7] text-amber-700';
      case 'shipped': return 'bg-[#e0f2fe] text-sky-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'returned': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const [timeFilter, setTimeFilter] = useState('12 months');

  const chartData = {
    '12 months': {
      earnings: '0,150 100,50 200,100 300,0 400,180 500,40 600,20 700,90 800,80 900,110 1000,105 1100,140',
      profits: '0,190 100,140 200,170 300,70 400,210 500,150 600,140 700,160 800,140 900,100 1000,90 1100,80',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    '30 days': {
      earnings: '0,180 100,100 200,80 300,40 400,120 500,60 600,50 700,110 800,90 900,140 1000,130 1100,160',
      profits: '0,210 100,160 200,140 300,100 400,170 500,120 600,110 700,160 800,140 900,190 1000,180 1100,210',
      labels: ['1st', '4th', '7th', '10th', '13th', '16th', '19th', '22nd', '25th', '28th', '30th', 'Now']
    },
    '7 days': {
      earnings: '0,110 100,80 200,60 300,90 400,50 500,30 600,70 700,100 800,60 900,40 1000,20 1100,10',
      profits: '0,150 100,120 200,100 300,140 400,90 500,70 600,120 700,150 800,110 900,80 1000,60 1100,50',
      labels: ['Mon', '', 'Tue', '', 'Wed', '', 'Thu', '', 'Fri', '', 'Sat', 'Sun']
    },
    '24 hours': {
      earnings: '0,200 100,180 200,150 300,160 400,130 500,140 600,110 700,120 800,90 900,70 1000,60 1100,40',
      profits: '0,230 100,210 200,190 300,200 400,170 500,180 600,160 700,170 800,140 900,110 1000,100 1100,80',
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
    }
  };

  const currentChart = chartData[timeFilter] || chartData['12 months'];

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">

      {/* Top Cards Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Total Orders</h2>
          <button className="bg-[#0f8b80] hover:bg-[#0c766d] text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className={`${card.bg} p-5 rounded-2xl flex flex-col gap-3 transition-transform hover:-translate-y-1`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-white/60 flex items-center justify-center ${card.iconColor}`}>
                  <card.icon size={20} strokeWidth={2.5} />
                </div>
                <span className={`text-xs font-bold ${card.text} opacity-80 uppercase tracking-wide`}>{card.title}</span>
              </div>
              <div className={`text-3xl font-bold ${card.text}`}>{card.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col">
        {/* Filters */}
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Payment status</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Received status</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Date</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px] pb-32">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
            </div>
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/30">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Items</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4 text-center">Payment status</th>
                  <th className="px-4 py-4 text-center">Received status</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? (
                  orders.map((order, index) => {
                    const itemCount = order.items?.length || 0;
                    const isPaid = order.payment_status === 'Paid' ? 'paid' : 'pending';
                    const recStatus = order.status || 'Processing';

                    return (
                      <tr key={order._id || index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-500">
                          {order.order_number || `#${order._id?.slice(-5).toUpperCase()}`}
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-700">{order.customer_name || order.email || 'Customer'}</td>
                        <td className="px-4 py-4 text-gray-500">{itemCount} pcs</td>
                        <td className="px-4 py-4 font-bold text-gray-900">BDT {order.total_amount?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-4 text-center">
                          <StatusDropdown 
                            value={order.payment_status || 'Pending'}
                            options={['Unpaid', 'Pending', 'Paid', 'Failed']}
                            onChange={(val) => updateOrderStatus(order._id, 'payment_status', val)}
                            getStyle={getPStatusStyle}
                            roundedStyle="rounded-full"
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusDropdown 
                            value={order.status || 'Pending'}
                            options={['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded']}
                            onChange={(val) => updateOrderStatus(order._id, 'status', val)}
                            getStyle={getRStatusStyle}
                            roundedStyle="rounded-md"
                          />
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {order.createdAt ? format(new Date(order.createdAt), 'dd MMM, yyyy') : 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link href={`/admin/orders/${order.order_number || order._id}`} className="inline-block text-gray-400 hover:text-[#0f8b80] transition-colors">
                            <Eye size={16} strokeWidth={2.5} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-16 text-gray-500 font-medium">
                      No orders found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profit Margin Chart Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profit margin</h2>

        <div className="flex justify-between items-center mb-8">
          <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
            {['12 months', '30 days', '7 days', '24 hours'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${timeFilter === tf ? 'bg-white shadow-sm text-gray-900 border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0f8b80]"></div> Earnings
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#f59e0b]"></div> Total Profits
            </div>
          </div>
        </div>

        <div className="h-[250px] w-full relative">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] font-bold text-gray-400">
            <span>50k</span>
            <span>40k</span>
            <span>30k</span>
            <span>20k</span>
            <span>10k</span>
            <span>0</span>
          </div>

          {/* Chart Area */}
          <div className="absolute left-10 right-0 top-2 bottom-8">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full border-b border-gray-100 border-dashed"></div>)}
            </div>

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Earnings (Teal) */}
              <polyline
                points={currentChart.earnings}
                fill="none"
                stroke="#0f8b80"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 0.5s ease-in-out' }}
              />
              {/* Profits (Yellow) */}
              <polyline
                points={currentChart.profits}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'all 0.5s ease-in-out' }}
              />
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between text-[10px] font-bold text-gray-400 items-end">
            {currentChart.labels.map((label, i) => (
              <span key={i} className="flex-1 text-center truncate">{label}</span>
            ))}
          </div>
        </div>
      </div>



    </div>
  );
}
