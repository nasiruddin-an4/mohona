'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Upload, Trash2, X, Save } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    unit_price: 0,
    stock_status: 'Publish', // Mapped to stock_status conceptually for UI
    tags: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        setFormData({
          name: data.data.name || '',
          category: data.data.category || 'Fashion',
          description: data.data.description || '',
          unit_price: data.data.unit_price || 0,
          stock_status: data.data.stock_status === 'Draft' ? 'Draft' : 'Publish',
          tags: data.data.tags || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if any
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map UI publish status to DB logic if needed, or just save generic fields
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product updated successfully!',
          confirmButtonColor: '#0f8b80',
        });
        router.push('/admin/products');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.error || 'Error updating product',
          confirmButtonColor: '#0f8b80',
        });
      }
    } catch (error) {
      console.error('Failed to update product', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update product',
        confirmButtonColor: '#0f8b80',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
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
      const res = await fetch(`/api/products/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0f8b80',
        });
        router.push('/admin/products');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Edit Product <span className="text-gray-400 font-medium uppercase text-sm ml-2">#{product._id.slice(-6)}</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Product"
          >
            <Trash2 size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsPublishMenuOpen(!isPublishMenuOpen)}
              className="flex items-center gap-2 border border-teal-200 bg-teal-50/50 text-[#0f8b80] px-4 py-2 rounded-full text-sm font-bold focus:outline-none"
            >
              {formData.stock_status} <ChevronDown size={16} className={`transition-transform duration-200 ${isPublishMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPublishMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setFormData(p => ({...p, stock_status: 'Publish'})); setIsPublishMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${formData.stock_status === 'Publish' ? 'text-[#0f8b80] bg-teal-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Publish
                </button>
                <button 
                  onClick={() => { setFormData(p => ({...p, stock_status: 'Draft'})); setIsPublishMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${formData.stock_status === 'Draft' ? 'text-[#0f8b80] bg-teal-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <h2 className="text-base font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Product Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Slug</label>
              <input 
                type="text" 
                value={formData.name.toLowerCase().replace(/ /g, '-')}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Category</label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors cursor-pointer"
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Electronics">Electronics</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Unit Price</label>
              <input 
                type="number" 
                name="unit_price"
                value={formData.unit_price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5 mt-2">
              <label className="text-sm text-gray-400">Short Description</label>
              <textarea 
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors resize-none placeholder:text-gray-300"
                placeholder="Write a brief description..."
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <h2 className="text-base font-bold text-gray-900 mb-6">Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-10 hover:border-[#0f8b80] transition-colors cursor-pointer bg-gray-50/50">
              <Upload size={24} className="text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-700">Upload Cover photo</p>
              <p className="text-xs text-gray-400 mt-1">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
              <p className="text-xs text-gray-400">Max size of 3.1 MB</p>
            </div>
          </div>
          
          {product.image_url && (
            <div className="flex gap-4 mt-6">
              <div className="w-12 h-12 rounded bg-gray-50 border border-gray-200 overflow-hidden relative group">
                <img src={product.image_url} alt="Thumbnail" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Variant */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">Variant</h2>
            <button className="border border-[#0f8b80] text-[#0f8b80] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f8b80] hover:text-white transition-colors">
              Add More Variant
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Select Variant</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors">
                  <option>Size</option>
                  <option>Color</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Value</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors">
                  <option>L</option>
                  <option>M</option>
                  <option>S</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-gray-700 font-bold border-b border-gray-100">
                  <th className="py-4 pr-4">SKU ID</th>
                  <th className="py-4 px-4">Variant ID</th>
                  <th className="py-4 px-4">Image</th>
                  <th className="py-4 px-4">Color</th>
                  <th className="py-4 px-4">Size</th>
                  <th className="py-4 px-4">Visible</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-500">
                <tr>
                  <td className="py-4 pr-4">#73423</td>
                  <td className="py-4 px-4">#V-001</td>
                  <td className="py-4 px-4">
                    <div className="w-6 h-6 bg-gray-100 rounded">
                      {product.image_url && <img src={product.image_url} className="w-full h-full object-contain" alt="Variant"/>}
                    </div>
                  </td>
                  <td className="py-4 px-4">{product.colors?.[0] || 'Black'}</td>
                  <td className="py-4 px-4">L</td>
                  <td className="py-4 px-4">1 x 80ml</td>
                  <td className="py-4 px-4">
                    <span className="bg-[#e2f5f3] text-[#0f8b80] px-3 py-1 rounded-full text-[10px] font-bold">Active</span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4">#73424</td>
                  <td className="py-4 px-4">#V-002</td>
                  <td className="py-4 px-4">
                    <div className="w-6 h-6 bg-gray-100 rounded">
                      {product.image_url && <img src={product.image_url} className="w-full h-full object-contain" alt="Variant"/>}
                    </div>
                  </td>
                  <td className="py-4 px-4">{product.colors?.[0] || 'Black'}</td>
                  <td className="py-4 px-4">M</td>
                  <td className="py-4 px-4">1 x 80ml</td>
                  <td className="py-4 px-4">
                    <span className="bg-[#e2f5f3] text-[#0f8b80] px-3 py-1 rounded-full text-[10px] font-bold">Active</span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <h2 className="text-base font-bold text-gray-900 mb-6">Tags</h2>
          <div className="relative mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span key={index} className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                {tag} <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">Discount</h2>
            <button className="border border-[#0f8b80] text-[#0f8b80] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f8b80] hover:text-white transition-colors">
              Add New Discount
            </button>
          </div>
          
          <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700">1 Discount</span>
                <div className="w-8 h-4 bg-[#0f8b80] rounded-full relative cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Discount Title"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
              />
              <input
                type="text"
                placeholder="Discount Price"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
              />
              <input
                type="text"
                placeholder="Discount Duration"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link 
            href="/admin/products"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#0f8b80] text-white text-sm font-bold hover:bg-[#0c7269] transition-colors disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

      </div>
    </div>
  );
}
