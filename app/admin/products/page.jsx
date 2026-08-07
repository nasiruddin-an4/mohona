'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Swal from 'sweetalert2';

const FilterDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-gray-50 border-none rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors min-w-[130px]"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100">
           <button 
              onClick={() => { onChange(''); setIsOpen(false); }} 
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${!value ? 'text-[#0f8b80] font-bold bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
           >
              {placeholder}
              {!value && <Check size={14} className="text-[#0f8b80]" />}
           </button>
           {options.map(opt => {
             const val = opt.value || opt;
             const label = opt.label || opt;
             return (
               <button 
                 key={val} 
                 onClick={() => { onChange(val); setIsOpen(false); }} 
                 className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${val === value ? 'text-[#0f8b80] font-bold bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {label}
                 {val === value && <Check size={14} className="text-[#0f8b80]" />}
               </button>
             );
           })}
        </div>
      )}
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
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

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0f8b80',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete product',
          confirmButtonColor: '#0f8b80',
        });
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete product',
        confirmButtonColor: '#0f8b80',
      });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? (p.status || 'Publish') === selectedStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto bg-white rounded-2xl p-6 shadow-sm min-h-[calc(100vh-120px)] animate-in fade-in duration-500 flex flex-col">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 mb-4 border-b border-gray-200 pb-6">
        {/* Left - Title */}
        <h1 className="text-xl font-bold text-gray-900 shrink-0">Product List</h1>
        
        {/* Middle - Search */}
        <div className="flex-1 flex w-full lg:w-auto lg:justify-center">
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right - Filters & Add */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          
          <FilterDropdown 
            value={selectedCategory}
            onChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
            placeholder="All Categories"
            options={Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort()}
          />

          <FilterDropdown 
            value={selectedStatus}
            onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
            placeholder="All Status"
            options={['Publish', 'Draft']}
          />

          <Link 
            href="/admin/products/add" 
            className="bg-[#0f8b80] hover:bg-[#0c7269] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-gray-600 font-bold bg-gray-100 border-b border-gray-100">
                  <th className="px-4 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Stock</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, idx) => {
                    const statusText = product.status || 'Publish';
                    const stockStatus = product.stock_status || 'In stock';

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-500 uppercase">#{product._id.slice(-6)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                              {(() => {
                                const displayImage = (product.product_images?.length > 0 ? product.product_images[0] : null) || product.image_url || product.cover_image;
                                return displayImage ? (
                                  <img src={displayImage} alt={product.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                  <div className="w-full h-full bg-gray-200"></div>
                                );
                              })()}
                            </div>
                            <span className="font-medium text-gray-600">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{product.category}</td>
                        <td className="px-4 py-4 font-bold text-[#0f8b80]">BDT {product.unit_price}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                            ${stockStatus === 'In stock' 
                              ? 'bg-blue-50 text-blue-600' 
                              : stockStatus === 'Out of stock' 
                              ? 'bg-red-50 text-red-600'
                              : 'bg-purple-50 text-purple-600'
                            }`}
                          >
                            {stockStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                            ${statusText === 'Publish' 
                              ? 'bg-[#e2f5f3] text-[#0f8b80]' 
                              : 'bg-orange-50 text-orange-600'
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 text-gray-400">
                            <Link href={`/admin/products/${product._id}`} className="hover:text-gray-900 transition-colors">
                              <Eye size={16} strokeWidth={2} />
                            </Link>
                            <Link href={`/admin/products/${product._id}/edit`} className="hover:text-gray-900 transition-colors">
                              <Edit2 size={16} strokeWidth={2} />
                            </Link>
                            <button onClick={() => deleteProduct(product._id)} className="hover:text-red-500 transition-colors">
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination - always at bottom */}
      {!loading && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-4 gap-4 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>Showing</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-gray-50 border-none rounded-md px-2 py-1 text-gray-700 focus:outline-none"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>products per page</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
                    currentPage === page
                      ? 'bg-[#e2f5f3] text-[#0f8b80] font-bold'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
