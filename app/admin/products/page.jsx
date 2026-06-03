'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto bg-white rounded-[1.5rem] p-6 shadow-sm min-h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900">Product List</h1>
        <Link 
          href="/admin/products/add" 
          className="bg-[#0f8b80] hover:bg-[#0c7269] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
        >
          Create Product
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <select className="appearance-none bg-gray-50 border-none rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer">
              <option>Category</option>
              <option>Fashion</option>
              <option>Electronics</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="appearance-none bg-gray-50 border-none rounded-full px-5 py-2.5 pr-10 text-sm font-medium text-gray-600 focus:outline-none cursor-pointer">
              <option>Status</option>
              <option>Publish</option>
              <option>Draft</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-gray-600 font-bold border-b border-gray-100">
                  <th className="px-4 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, idx) => {
                    const isDraft = idx % 2 !== 0; // Every other is draft for demo
                    const statusText = isDraft ? 'Draft' : 'Publish';

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-500 uppercase">#{product._id.slice(-6)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-gray-200"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-600">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{product.category}</td>
                        <td className="px-4 py-4 font-bold text-[#0f8b80]">${product.unit_price}</td>
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
                            <button className="hover:text-gray-900 transition-colors">
                              <Eye size={16} strokeWidth={2} />
                            </button>
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

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-end items-center mt-8 gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#e2f5f3] text-[#0f8b80] font-bold text-sm flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-50 text-sm font-medium flex items-center justify-center transition-colors">
                2
              </button>
              <button className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-50 text-sm font-medium flex items-center justify-center transition-colors">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
