'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Building2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function InventoryPage() {
  const { user, isSuperAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchOutlets = async () => {
    try {
      const res = await fetch('/api/outlets');
      const data = await res.json();
      if (data.success) setOutlets(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedOutlet) params.set('outlet', selectedOutlet);
      else if (!isSuperAdmin && user?.outletId) params.set('outlet', user.outletId);

      const res = await fetch(`/api/outlet-products?${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, [selectedOutlet, isSuperAdmin, user?.outletId]);

  useEffect(() => {
    fetchProducts();
    if (isSuperAdmin) fetchOutlets();
  }, [fetchProducts, isSuperAdmin]);

  // Get unique categories for the filter
  const categories = [...new Set(products.map(p => p.categoryId?.name).filter(Boolean))];

  // Apply filters
  let filteredProducts = products.filter(p => {
    const pName = p.productId?.name || '';
    const pId = p.productId?._id || p._id;
    const matchesSearch = pName.toLowerCase().includes(search.toLowerCase()) || 
                          pId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.categoryId?.name === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Sort by date (mocking date based on createdAt)
  if (dateFilter === 'newest') {
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (dateFilter === 'oldest') {
    filteredProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] bg-white w-full max-w-full animate-in fade-in duration-500 flex flex-col font-sans">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-[22px] font-bold text-gray-900">Manage Inventory</h1>
        <button className="bg-[#0f8b80] hover:bg-[#0c766d] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
          Export
        </button>
      </div>

      <div className="bg-white flex-1 flex flex-col rounded-2xl">
        <div className="pb-4 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
              />
            </div>
            {isSuperAdmin && (
              <select
                value={selectedOutlet}
                onChange={e => setSelectedOutlet(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-full text-[13px] text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-gray-50"
              >
                <option value="">All Outlets (Global)</option>
                {outlets.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
              </select>
            )}
            {!isSuperAdmin && user?.outletName && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
                <Building2 size={12} /> {user.outletName} <Lock size={11} className="text-teal-400" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer min-w-[120px]"
              >
                <option value="">Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-gray-50/80 border border-gray-100 rounded-full px-5 py-2 pr-10 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer min-w-[120px]"
              >
                <option value="">Date</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 border border-gray-100 rounded-xl">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4 font-bold text-gray-600">ID</th>
                  <th className="px-4 py-4 font-bold text-gray-600">Name</th>
                  {isSuperAdmin && <th className="px-4 py-4 font-bold text-gray-600">Outlet</th>}
                  <th className="px-4 py-4 font-bold text-gray-600">Category</th>
                  <th className="px-4 py-4 font-bold text-gray-600">Stock</th>
                  <th className="px-4 py-4 font-bold text-gray-600">Sold Out</th>
                  <th className="px-4 py-4 font-bold text-gray-600">Date</th>
                  <th className="px-4 py-4 font-bold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => {
                    const dateObj = new Date(product.createdAt || Date.now());
                    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const mp = product.productId || {};
                    const productImg = mp.cover_image || mp.image_url || 'https://placehold.co/100x100/eeeeee/999999?text=No+Image';
                    
                    // Mocking 'sold out' amount for design display since order history isn't fully linked
                    const soldOutMock = Math.floor(Math.random() * 500) + 10;

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          #{mp._id?.slice(-5) || product._id.slice(-5)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-50">
                              <img src={productImg} alt={mp.name} className="w-full h-full object-contain p-2" />
                            </div>
                            <span className="font-medium text-gray-700">{mp.name || 'Unknown'}</span>
                          </div>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-600">
                              <Building2 size={12} />
                              {product.outletId?.name || '—'}
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-4 text-gray-500">{product.categoryId?.name || '-'}</td>
                        <td className="px-4 py-4 text-gray-500">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-700">{product.stock_qty || 0} pcs</span>
                            {product.stock_status && (
                              <span className={`text-[10px] font-bold uppercase ${
                                product.stock_status === 'In stock' ? 'text-blue-500' :
                                product.stock_status === 'Out of stock' ? 'text-red-500' : 'text-amber-500'
                              }`}>{product.stock_status}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{soldOutMock} pcs</td>
                        <td className="px-4 py-4 text-gray-500">{formattedDate}</td>
                        <td className="px-4 py-4">
                          <Link href={`/admin/inventory/${product._id}`} className="text-gray-400 hover:text-gray-900 transition-colors inline-block" title="View Details">
                            <Eye size={16} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
