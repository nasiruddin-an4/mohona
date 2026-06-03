'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Package, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function StockProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStockRange, setSelectedStockRange] = useState('');
  const [selectedDateSort, setSelectedDateSort] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? (p.status || 'Publish') === selectedStatus : true;
    
    let matchesStock = true;
    const qty = p.stock_qty || 0;
    if (selectedStockRange === 'available') matchesStock = qty >= 10;
    if (selectedStockRange === 'low') matchesStock = qty > 0 && qty < 10;
    if (selectedStockRange === 'out') matchesStock = qty === 0;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  if (selectedDateSort === 'newest') {
    filteredProducts.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  } else if (selectedDateSort === 'oldest') {
    filteredProducts.sort((a, b) => new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0));
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalProducts = products.length;
  // Let's define: In Stock = qty >= 10, Low Stock = qty > 0 && qty < 10, Out of Stock = qty === 0
  const inStockCount = products.filter(p => (p.stock_qty || 0) >= 10).length;
  const lowStockCount = products.filter(p => (p.stock_qty || 0) > 0 && (p.stock_qty || 0) < 10).length;
  const outOfStockCount = products.filter(p => (p.stock_qty || 0) === 0).length;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Products Report", 14, 15);

    const tableColumn = ["ID", "Product Name", "Category", "Price", "Qty", "Stock Status", "Publish Status"];
    const tableRows = [];

    // Use filteredProducts to only download what matches current filters
    filteredProducts.forEach(product => {
      const stockQty = product.stock_qty || 0;
      let stockBadge = 'Available';
      if (stockQty === 0) stockBadge = 'Out of Stock';
      else if (stockQty < 10) stockBadge = 'Low Stock';

      const productData = [
        `#${product._id.slice(-5)}`,
        product.name,
        product.category || '-',
        `BDT ${product.unit_price}`,
        stockQty.toString(),
        stockBadge,
        product.status || 'Publish'
      ];
      tableRows.push(productData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 139, 128] } // #0f8b80
    });

    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    doc.save(`Stock_Report_${date}.pdf`);
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] bg-white w-full max-w-full animate-in fade-in duration-500 flex flex-col font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Stock Products</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Download
          </button>
          <Link href="/admin/products/add" className="flex items-center gap-2 px-5 py-2 bg-[#0f8b80] text-white rounded-full text-sm font-medium hover:bg-[#0c766d] transition-colors">
            Add Stock
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#e5f6f4] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-[#fff7d1] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-600 mb-1">In Stock Products</p>
            <p className="text-2xl font-bold text-gray-900">{inStockCount}</p>
          </div>
        </div>

        <div className="bg-[#dcfce7] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-600 mb-1">Low Stock Products</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-[#fce7f3] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-600 mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-4 py-2 pr-8 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="">Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-4 py-2 pr-8 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="">Status</option>
                <option value="Publish">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={selectedStockRange}
                onChange={(e) => { setSelectedStockRange(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-4 py-2 pr-8 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="">Stock Range</option>
                <option value="available">Available Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={selectedDateSort}
                onChange={(e) => { setSelectedDateSort(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-4 py-2 pr-8 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Quantity</th>
                  <th className="px-4 py-4">Warehouse</th>
                  <th className="px-4 py-4">Seller</th>
                  <th className="px-4 py-4">Last Updated</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => {
                    const publishStatus = product.status || 'Publish';
                    const stockQty = product.stock_qty || 0;
                    
                    let stockBadge = 'Available stock';
                    let stockBadgeClass = 'bg-[#dcfce7] text-green-700 border border-green-200';
                    if (stockQty === 0) {
                      stockBadge = 'Out of Stock';
                      stockBadgeClass = 'bg-[#fee2e2] text-red-700 border border-red-200';
                    } else if (stockQty < 10) {
                      stockBadge = 'Low Stock';
                      stockBadgeClass = 'bg-[#fef9c3] text-yellow-700 border border-yellow-200';
                    }

                    // Format date (mocking "11 Sept, 2027")
                    const dateObj = new Date(product.updatedAt || Date.now());
                    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          #{product._id.slice(-5)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white">
                              {product.cover_image || product.image_url ? (
                                <img src={product.cover_image || product.image_url} alt={product.name} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-gray-100"></div>
                              )}
                            </div>
                            <span className="font-bold text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{product.category || '-'}</td>
                        <td className="px-4 py-4 font-bold text-gray-900">BDT {product.unit_price}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 w-12">{stockQty} pcs</span>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${stockBadgeClass}`}>
                              {stockBadge}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">#WR-001</td>
                        <td className="px-4 py-4 text-gray-500">{product.seller || 'Alex'}</td>
                        <td className="px-4 py-4 text-gray-500">{formattedDate}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold
                            ${publishStatus === 'Publish' 
                              ? 'bg-[#e2f5f3] text-[#0f8b80]' 
                              : 'bg-[#fff7d1] text-yellow-700'
                            }`}
                          >
                            {publishStatus === 'Publish' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="bg-[#0f8b80] text-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-[#0c766d] transition-colors">
                              Order Now
                            </button>
                            <Link href={`/admin/products/${product._id}`} className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-gray-50 transition-colors">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-12 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[13px] text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-[13px] font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#0f8b80] text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
