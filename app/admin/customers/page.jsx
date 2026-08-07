'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Crown, Wallet, Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CustomersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders for customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Aggregate customers from orders
  const customersMap = {};
  
  orders.forEach(order => {
    // Treat either email or phone as unique identifier
    const identifier = order.email || order.contact_number || order.customer_name;
    if (!identifier) return;

    if (!customersMap[identifier]) {
      customersMap[identifier] = {
        id: identifier,
        name: order.customer_name || 'Unknown',
        email: order.email || '-',
        phone: order.contact_number || '-',
        address: order.address || '-',
        totalOrders: 0,
        totalSpend: 0,
        lastOrderDate: order.createdAt,
        status: 'Active'
      };
    }

    customersMap[identifier].totalOrders += 1;
    customersMap[identifier].totalSpend += (order.total_amount || 0);
    
    // Update last order date if this order is more recent
    if (new Date(order.createdAt) > new Date(customersMap[identifier].lastOrderDate)) {
      customersMap[identifier].lastOrderDate = order.createdAt;
      customersMap[identifier].address = order.address || customersMap[identifier].address; // keep most recent address
    }
  });

  const allCustomers = Object.values(customersMap).sort((a, b) => b.totalSpend - a.totalSpend); // Sort by highest spend by default

  const filteredCustomers = allCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derived Metrics
  const totalCustomers = allCustomers.length;
  const activeCustomers = allCustomers.filter(c => {
    // Active if ordered within last 30 days
    const diffTime = Math.abs(new Date() - new Date(c.lastOrderDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 30;
  }).length;
  const topSpender = allCustomers.length > 0 ? allCustomers[0] : null;
  const totalLTV = allCustomers.reduce((sum, c) => sum + c.totalSpend, 0);
  const averageLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0;

  // Export to PDF
  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    doc.text("Customer Directory Report", 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Customers: ${totalCustomers}`, 14, 22);

    const tableColumn = ["Customer Name", "Contact", "Address", "Orders", "Total Spend", "Last Order"];
    const tableRows = [];

    filteredCustomers.forEach(c => {
      tableRows.push([
        c.name,
        `${c.phone}\n${c.email}`,
        c.address,
        c.totalOrders.toString(),
        `BDT ${c.totalSpend.toFixed(2)}`,
        c.lastOrderDate ? format(new Date(c.lastOrderDate), 'dd MMM yyyy') : '-'
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 139, 128] },
    });

    const stamp = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`Customers_Report_${stamp}.pdf`);
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view your entire customer base built from orders.</p>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-colors"
        >
          <Download size={16} strokeWidth={2.5} /> Export Directory
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#eff6ff] p-5 rounded-2xl flex items-center gap-4 border border-blue-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-blue-900/60 uppercase tracking-wider mb-0.5">Total Customers</p>
            <p className="text-2xl font-black text-blue-950">{totalCustomers}</p>
          </div>
        </div>

        <div className="bg-[#f0fdf4] p-5 rounded-2xl flex items-center gap-4 border border-green-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-green-900/60 uppercase tracking-wider mb-0.5">Active (30d)</p>
            <p className="text-2xl font-black text-green-950">{activeCustomers}</p>
          </div>
        </div>

        <div className="bg-[#fefce8] p-5 rounded-2xl flex items-center gap-4 border border-yellow-100 overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-yellow-600 shadow-sm shrink-0">
            <Crown size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-yellow-900/60 uppercase tracking-wider mb-0.5">Top Spender</p>
            <p className="text-xl font-black text-yellow-950 truncate" title={topSpender?.name}>{topSpender?.name || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-[#f5f3ff] p-5 rounded-2xl flex items-center gap-4 border border-purple-100">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-purple-900/60 uppercase tracking-wider mb-0.5">Average Lifetime</p>
            <p className="text-2xl font-black text-purple-950">৳{averageLTV.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr className="text-gray-900 font-bold border-b border-gray-100 bg-white">
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Customer Info</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Location</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-center">Total Orders</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-right">Lifetime Spend</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-center">Last Order</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer, idx) => {
                const diffTime = Math.abs(new Date() - new Date(customer.lastOrderDate));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isNew = diffDays <= 7;

                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&color=fff&size=80`} 
                          alt={customer.name} 
                          className="w-10 h-10 rounded-full object-contain p-2 shadow-sm border border-gray-100" 
                        />
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {customer.name}
                            {isNew && <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-purple-100 text-purple-700">New</span>}
                          </div>
                          <div className="text-xs font-medium text-gray-500 flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-1.5"><Phone size={10} className="text-gray-400" /> {customer.phone}</span>
                            {customer.email !== '-' && <span className="flex items-center gap-1.5"><Mail size={10} className="text-gray-400" /> {customer.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-gray-600 w-48 whitespace-normal line-clamp-2 text-xs font-medium">
                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <span>{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100 font-bold text-gray-700">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-[#0f8b80]">BDT {customer.totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                      <div className="text-[10px] text-gray-400 font-medium">Avg: BDT {(customer.totalSpend / customer.totalOrders).toFixed(0)} / order</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-700 font-bold text-xs">{customer.lastOrderDate ? format(new Date(customer.lastOrderDate), 'dd MMM yyyy') : '-'}</div>
                      <div className="text-[10px] text-gray-400 font-medium mt-0.5">{diffDays} days ago</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Search for their orders via Orders page */}
                      <Link 
                        href={`/admin/orders?search=${encodeURIComponent(customer.phone !== '-' ? customer.phone : customer.email)}`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-[#0f8b80] hover:border-[#0f8b80] transition-colors"
                        title="View Orders"
                      >
                        <ExternalLink size={16} strokeWidth={2.5} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="text-gray-400" size={24} />
                    </div>
                    <p className="font-medium text-gray-600">No customers found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
