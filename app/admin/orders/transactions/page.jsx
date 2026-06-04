'use client';

import React, { useEffect, useState } from 'react';
import { Search, Download, CreditCard, HandCoins, CheckCircle2, AlertCircle, Eye, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TransactionsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    doc.text("Transaction History Report", 14, 15);

    const tableColumn = ["Date", "Order ID", "Customer", "Method", "TrxID", "Amount", "Status"];
    const tableRows = [];

    filteredOrders.forEach(order => {
      const rowData = [
        order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy') : '-',
        order.order_number || `#${order._id.slice(-5).toUpperCase()}`,
        order.customer_name || '-',
        order.payment_method || 'System',
        order.transaction_id || '-',
        `BDT ${order.total_amount?.toFixed(2)}`,
        order.payment_status || 'Pending'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 139, 128] }
    });

    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`Transactions_Report_${date}.pdf`);
  };

  // Derived stats
  const totalReceived = orders
    .filter(o => o.payment_status?.toLowerCase() === 'paid')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const bkashPayments = orders.filter(o => o.payment_method?.toLowerCase() === 'bkash').length;
  const codPayments = orders.filter(o => o.payment_method?.toLowerCase() === 'cash on delivery').length;
  const failedPayments = orders.filter(o => o.payment_status?.toLowerCase() === 'failed').length;

  // Filters
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.order_number || '').toLowerCase().includes(search.toLowerCase()) || 
      (o.transaction_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesMethod = filterMethod ? o.payment_method?.toLowerCase() === filterMethod.toLowerCase() : true;
    const matchesStatus = filterStatus ? o.payment_status?.toLowerCase() === filterStatus.toLowerCase() : true;

    return matchesSearch && matchesMethod && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getPStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'unpaid': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor all incoming payments, refunds, and cash collections.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="px-5 py-2 text-sm font-bold bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download size={16} /> Export CSV/PDF
        </button>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ccfbf1] p-5 rounded-2xl flex items-center gap-4 border border-teal-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-teal-900/60 uppercase tracking-wider mb-0.5">Total Collected</p>
            <p className="text-2xl font-black text-teal-950">৳{totalReceived.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#fce7f3] p-5 rounded-2xl flex items-center gap-4 border border-pink-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-pink-900/60 uppercase tracking-wider mb-0.5">bKash Payments</p>
            <p className="text-2xl font-black text-pink-950">{bkashPayments}</p>
          </div>
        </div>

        <div className="bg-[#fef3c7] p-5 rounded-2xl flex items-center gap-4 border border-amber-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <HandCoins size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-amber-900/60 uppercase tracking-wider mb-0.5">Cash on Delivery</p>
            <p className="text-2xl font-black text-amber-950">{codPayments}</p>
          </div>
        </div>

        <div className="bg-[#fee2e2] p-5 rounded-2xl flex items-center gap-4 border border-red-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-red-900/60 uppercase tracking-wider mb-0.5">Failed / Declined</p>
            <p className="text-2xl font-black text-red-950">{failedPayments}</p>
          </div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Order ID, TrxID, Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-600 focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="">All Methods</option>
              <option value="bkash">bKash</option>
              <option value="cash on delivery">Cash on Delivery</option>
            </select>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-600 focus:outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
            </div>
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-4 py-4">Order ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4 text-center">Payment Method</th>
                  <th className="px-4 py-4">Transaction ID</th>
                  <th className="px-4 py-4 text-right">Amount</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={order._id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a') : 'Unknown'}
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900">
                        {order.order_number || `#${order._id?.slice(-5).toUpperCase()}`}
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-700">
                        {order.customer_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[11px] font-bold ${
                          order.payment_method?.toLowerCase() === 'bkash' 
                            ? 'bg-pink-50 text-[#E2136E]' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {order.payment_method || 'System'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-600">
                        {order.transaction_id || '-'}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        BDT {order.total_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getPStatusStyle(order.payment_status)} uppercase tracking-wider`}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link href={`/admin/orders/${order.order_number || order._id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-[#0f8b80] hover:border-[#0f8b80] transition-colors">
                          <Eye size={16} strokeWidth={2.5} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ArrowUpDown size={24} />
                      </div>
                      <p className="text-gray-500 font-medium">No transactions found.</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query.</p>
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
