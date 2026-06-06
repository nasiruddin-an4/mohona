'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
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

  if (!product) return <div className="p-8 text-center text-gray-500">Product not found</div>;

  return (
    <div className="container mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors text-gray-700"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
        </div>
        <Link 
          href={`/admin/products/${product._id}/edit`}
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          <Edit2 size={16} /> Edit
        </Link>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
              {(() => {
                const displayImage = (product.product_images?.length > 0 ? product.product_images[0] : null) || product.image_url || product.cover_image;
                return displayImage ? (
                  <img src={displayImage} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                );
              })()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Category:</span> {product.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Slug:</span> {product.name.toLowerCase().replace(/ /g, '-')}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  ${(product.status || 'Publish') === 'Publish' 
                    ? 'bg-[#e2f5f3] text-[#0f8b80]' 
                    : 'bg-orange-50 text-orange-600'
                  }`}
                >
                  {product.status || 'Publish'}
                </span>
              </div>

              {product.description && (
                <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Short Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Unit Price</p>
              <p className="font-bold text-gray-900">BDT {product.unit_price || '0'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Selling Price</p>
              <p className="font-bold text-[#0f8b80]">BDT {product.selling_price || '0'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Quantity</p>
              <p className="font-bold text-gray-900">{product.stock_qty || '0'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Status</p>
              <span className={`px-2 py-1 rounded text-xs font-medium inline-block
                ${(product.stock_status || 'In stock') === 'In stock' ? 'bg-blue-50 text-blue-600' 
                : (product.stock_status || 'In stock') === 'Out of stock' ? 'bg-red-50 text-red-600'
                : 'bg-purple-50 text-purple-600'}`}
              >
                {product.stock_status || 'In stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Media</h2>
          <div className="flex flex-wrap gap-4">
            {(() => {
              const allImages = [product.image_url, ...(product.product_images || [])].filter(Boolean);
              const uniqueImages = [...new Set(allImages)];
              
              if (uniqueImages.length === 0) {
                return <p className="text-sm text-gray-400 italic">No media uploaded.</p>;
              }

              return uniqueImages.map((img, idx) => (
                <div key={idx} className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-center overflow-hidden">
                  <img src={img} alt={`Product Media ${idx}`} className="max-w-full max-h-full object-contain" />
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Variants</h2>
          {product.variants && product.variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-gray-400 font-bold border-b border-gray-100 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 px-4">Variant ID</th>
                    <th className="pb-3 px-4">Value</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {product.variants.map((variant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">{variant.variant_id}</td>
                      <td className="py-3 px-4 font-medium text-gray-700">{variant.size || variant.color}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-600">
                          {variant.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No variants added for this product.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
