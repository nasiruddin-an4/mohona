'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, ShoppingCart, User, Layers } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function InventoryDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product details', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 min-h-[calc(100vh-120px)] flex justify-center items-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const productImg = product.cover_image || product.image_url || 'https://placehold.co/100x100/eeeeee/999999?text=No+Image';

  // Mock data for the UI
  const mockRecentStock = [
    { stock: '10 pcs', addedBy: 'Jenny Wilson', date: '12 Sept, 2027' },
    { stock: '10 pcs', addedBy: 'Jenny Wilson', date: '12 Sept, 2027' },
    { stock: '10 pcs', addedBy: 'Jenny Wilson', date: '12 Sept, 2027' },
    { stock: '10 pcs', addedBy: 'Jenny Wilson', date: '12 Sept, 2027' },
  ];

  const soldOutMock = Math.floor(Math.random() * 500) + 50;

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] bg-gray-50/30 w-full max-w-full animate-in fade-in duration-500 font-sans">
      
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/inventory" className="text-gray-600 hover:text-gray-900 transition-colors p-1">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Details</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
              <img src={productImg} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Layers size={14} className="text-gray-400" />
                <span className="font-medium text-[13px]">Category Name</span>
                <span className="text-gray-400 mx-1">•</span>
                <span className="font-medium text-gray-800 text-[13px]">{product.category || '-'}</span>
              </div>
            </div>
          </div>
          <div>
            <span className="px-3 py-1 bg-[#e2f5f3] text-[#0f8b80] text-xs font-bold rounded-full border border-[#0f8b80]/20">
              {product.status || 'Published'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Current Stock Card */}
          <div className="border border-gray-100 rounded-xl p-5 flex justify-between items-center bg-gray-50/30">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{product.stock_qty || 0} pcs</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#0f8b80] border-r-[#0f8b80] flex items-center justify-center relative">
               <span className="text-xs font-bold text-gray-900">{product.stock_qty || 0}</span>
            </div>
          </div>
          
          {/* Sold Out Card */}
          <div className="border border-gray-100 rounded-xl p-5 flex justify-between items-center bg-gray-50/30">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sold Out</p>
              <p className="text-2xl font-bold text-gray-900">{soldOutMock} pcs</p>
            </div>
            <div className="h-10 w-24 flex items-end">
              {/* Very simple CSS mock of a green gradient line chart */}
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f8b80" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#0f8b80" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,40 L0,30 L20,35 L40,20 L60,25 L80,10 L100,5 L100,40 Z" fill="url(#grad)" />
                <path d="M0,30 L20,35 L40,20 L60,25 L80,10 L100,5" fill="none" stroke="#0f8b80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
              <Tag size={14} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Discount Title</p>
              <p className="text-[13px] font-bold text-gray-700">{product.discount_pct ? `${product.discount_pct}% OFF` : '-'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <ShoppingCart size={14} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Slug</p>
              <p className="text-[13px] font-bold text-gray-700 max-w-[120px] truncate">{product.slug || 'Slug Information'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <User size={14} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Seller</p>
              <p className="text-[13px] font-bold text-gray-700">{product.seller || 'Seller Name'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Recent Add Stock</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr className="text-gray-500 font-bold border-b border-gray-100 bg-gray-50/30">
                <th className="px-4 py-3 font-bold">Stock</th>
                <th className="px-4 py-3 font-bold">Added by</th>
                <th className="px-4 py-3 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockRecentStock.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-3.5 text-gray-600 font-medium">{row.stock}</td>
                  <td className="px-4 py-3.5 text-gray-500">{row.addedBy}</td>
                  <td className="px-4 py-3.5 text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
