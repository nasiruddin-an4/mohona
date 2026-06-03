'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
    colors: '',
    sizes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data for API
      const productData = {
        name: formData.name,
        category: formData.category,
        unit_price: Number(formData.price),
        stock_qty: Number(formData.stock),
        description: formData.description,
        image_url: formData.imageUrl,
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
        available_units: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-[1.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm min-h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Name *</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. Classic White T-Shirt"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category *</label>
              <select 
                name="category" 
                required
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Fish & Meat">Fish & Meat</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Price (BDT) *</label>
              <input 
                type="number" 
                name="price" 
                required 
                min="0" step="0.01"
                value={formData.price} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Stock Quantity *</label>
              <input 
                type="number" 
                name="stock" 
                required 
                min="0"
                value={formData.stock} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description *</label>
            <textarea 
              name="description" 
              required 
              rows="4"
              value={formData.description} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
              placeholder="Write a detailed description..."
            ></textarea>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Media</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Image URL *</label>
            <div className="flex gap-4">
              <input 
                type="url" 
                name="imageUrl" 
                required 
                value={formData.imageUrl} 
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="https://..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * Note: Direct ImageKit upload will be available once the API keys are configured in .env
            </p>
          </div>
          
          {formData.imageUrl && (
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Variants (Optional)</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Colors (Comma separated)</label>
              <input 
                type="text" 
                name="colors" 
                value={formData.colors} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Red, Blue, Green"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Sizes (Comma separated)</label>
              <input 
                type="text" 
                name="sizes" 
                value={formData.sizes} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="S, M, L, XL"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                Save Product
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
