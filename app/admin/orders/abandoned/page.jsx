'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Eye, ShoppingCart, Clock, PhoneOff, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AbandonedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        // Filter for abandoned orders: either cancelled or payment failed
        const abandoned = data.data.filter(
          o => o.status?.toLowerCase() === 'cancelled' || o.payment_status?.toLowerCase() === 'failed'
        );
        setOrders(abandoned);
      }
    } catch (error) {
      console.error('Failed to fetch abandoned orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = {
    total: orders.length,
    highValue: orders.filter(o => o.total_amount > 5000).length,
    recentlyAbandoned: orders.filter(o => {
      const diffHrs = (new Date() - new Date(o.createdAt)) / (1000 * 60 * 60);
      return diffHrs <= 24;
    }).length,
  };

  const getPStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Abandoned Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and recover lost sales from cancelled or failed orders.</p>
        </div>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#fee2e2] p-6 rounded-2xl flex items-center gap-4 border border-red-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-red-900/60 uppercase tracking-wider mb-1">Total Abandoned</p>
            <p className="text-3xl font-black text-red-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-[#ffedd5] p-6 rounded-2xl flex items-center gap-4 border border-orange-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-orange-900/60 uppercase tracking-wider mb-1">Last 24 Hours</p>
            <p className="text-3xl font-black text-orange-900">{stats.recentlyAbandoned}</p>
          </div>
        </div>

        <div className="bg-[#f3e8ff] p-6 rounded-2xl flex items-center gap-4 border border-purple-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-purple-900/60 uppercase tracking-wider mb-1">High Value (&gt; 5k)</p>
            <p className="text-3xl font-black text-purple-900">{stats.highValue}</p>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search abandoned orders..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Items</th>
                  <th className="px-4 py-4">Lost Revenue</th>
                  <th className="px-4 py-4 text-center">Reason</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? (
                  orders.map((order, index) => {
                    const itemCount = order.items?.length || 0;
                    const reason = order.payment_status?.toLowerCase() === 'failed' ? 'Payment Failed' : 'Cancelled';

                    return (
                      <tr key={order._id || index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-500">
                          {order.order_number || `#${order._id?.slice(-5).toUpperCase()}`}
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-700">
                          {order.customer_name || 'Unknown'}
                          <span className="block text-[11px] font-normal text-gray-400">{order.email}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {order.contact_number || '-'}
                        </td>
                        <td className="px-4 py-4 text-gray-500">{itemCount} pcs</td>
                        <td className="px-4 py-4 font-bold text-gray-900">BDT {order.total_amount?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getPStatusStyle(order.payment_status || order.status)}`}>
                            {reason}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {order.createdAt ? format(new Date(order.createdAt), 'dd MMM, yyyy') : 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Link href={`/admin/orders/${order.order_number || order._id}`} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-[#0f8b80] hover:border-[#0f8b80] px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                            <Eye size={14} strokeWidth={2.5} />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ShoppingCart size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">No abandoned orders found.</p>
                      <p className="text-xs text-gray-400 mt-1">All your orders are successfully processed!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
