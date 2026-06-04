'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, RefreshCcw, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          // Filter only Returned or Refunded orders
          const returns = data.data.filter(o => ['Returned', 'Refunded'].includes(o.status));
          setOrders(returns);
        }
      } catch (error) {
        console.error("Failed to fetch returns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const pendingReturns = orders.filter(o => o.status === 'Returned').length;
  const approvedReturns = orders.filter(o => o.status === 'Refunded').length;

  // Real Summary Data
  const summaryCards = [
    { title: 'Total Returns', count: orders.length, icon: RefreshCcw, bg: 'bg-[#bfdbfe]', text: 'text-blue-900', iconColor: 'text-blue-600' },
    { title: 'Pending Approval', count: pendingReturns, icon: Clock, bg: 'bg-[#fef08a]', text: 'text-yellow-900', iconColor: 'text-yellow-600' },
    { title: 'Approved', count: approvedReturns, icon: CheckCircle, bg: 'bg-[#dcfce7]', text: 'text-emerald-900', iconColor: 'text-emerald-600' },
    { title: 'Rejected', count: 0, icon: XCircle, bg: 'bg-[#fee2e2]', text: 'text-red-900', iconColor: 'text-red-600' },
  ];


  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'refunded': return 'bg-[#dcfce7] text-emerald-700';
      case 'returned': return 'bg-[#fef3c7] text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage customer return requests and refunds</p>
          </div>
          <button className="bg-[#0f8b80] hover:bg-[#0c766d] text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
            Export Report
          </button>
        </div>
        
        {/* Summary Cards */}
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

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Filters */}
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Return ID or Order ID..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Reason</option>
                <option value="Damaged">Damaged Product</option>
                <option value="Wrong Size">Wrong Size</option>
                <option value="Not Expected">Not as Expected</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative shrink-0">
              <select className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[12px] font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="">Date Range</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="All">All Time</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/30">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                </th>
                <th className="px-4 py-4">Order ID</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Reason</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500 font-medium">Loading returns...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500 font-medium">No returned orders found.</td>
                </tr>
              ) : orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </td>
                  <td className="px-4 py-4 text-[#0f8b80] font-bold hover:underline cursor-pointer">
                    <Link href={`/admin/orders/${order.order_number || order._id}`}>{order.order_number || order._id?.slice(-6).toUpperCase()}</Link>
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">{order.customer_name}</td>
                  <td className="px-4 py-4 font-bold text-gray-900">BDT {order.total_amount?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-gray-500">N/A</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-[11px] font-bold rounded-md ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link href={`/admin/orders/${order.order_number || order._id}`} className="text-gray-400 hover:text-[#0f8b80] transition-colors">
                      <Eye size={16} strokeWidth={2.5} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
