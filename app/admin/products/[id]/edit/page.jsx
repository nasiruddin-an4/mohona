'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Upload, Trash2, X, Save, Plus } from 'lucide-react';
import MultiImageUploader from '../../../components/MultiImageUploader';
import { uploadToImageKit } from '@/lib/imagekit';
import Swal from 'sweetalert2';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);

  // New variant form state
  const [newVariant, setNewVariant] = useState({ variantType: 'Size', value: 'L' });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    stock_qty: '',
    description: '',
    unit_price: '',
    selling_price: '',
    status: 'Publish',
    stock_status: 'In stock',
    tags: [],
    variants: [],
    discounts: [],
    image_url: '',
    product_images: [],
    fabric: '',
    wash_care: '',
    material: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        let fetchedStockStatus = data.data.stock_status || 'In stock';
        let fetchedStatus = data.data.status || 'Publish';
        
        // Migrate old data that used stock_status for Publish/Draft
        if (fetchedStockStatus === 'Publish' || fetchedStockStatus === 'Draft') {
          fetchedStatus = fetchedStockStatus;
          fetchedStockStatus = 'In stock';
        }

        setFormData({
          name: data.data.name || '',
          category: data.data.category || 'Fashion',
          description: data.data.description || '',
          unit_price: data.data.unit_price || '',
          selling_price: data.data.selling_price || '',
          stock_qty: data.data.stock_qty || '',
          status: fetchedStatus,
          stock_status: fetchedStockStatus,
          tags: data.data.tags || [],
          variants: data.data.variants || [],
          discounts: data.data.discounts || [],
          image_url: data.data.image_url || '',
          product_images: data.data.product_images && data.data.product_images.length > 0 
            ? data.data.product_images 
            : (data.data.image_url ? [data.data.image_url] : []),
          fabric: data.data.fabric || '',
          wash_care: data.data.wash_care || '',
          material: data.data.material || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Generic Input Handler ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Tags ──
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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

  // ── Variants ──
  const handleAddVariant = () => {
    const skuNum = Math.floor(10000 + Math.random() * 90000);
    const vIdx = formData.variants.length + 1;
    const variant = {
      sku: `#${skuNum}`,
      variant_id: `#V-${String(vIdx).padStart(3, '0')}`,
      image: product?.image_url || '',
      color: product?.colors?.[0] || 'Black',
      size: newVariant.value,
      visible: '1 x 80ml',
      status: 'Active',
    };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, variant] }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v),
    }));
  };

  // ── Discounts ──
  const handleAddDiscount = () => {
    setFormData(prev => ({
      ...prev,
      discounts: [...prev.discounts, { title: '', price: '', duration: '' }],
    }));
  };

  const handleRemoveDiscount = (index) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  };

  const handleDiscountChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.map((d, i) => i === index ? { ...d, [field]: value } : d),
    }));
  };

  // ── Media (Image Upload - deferred) ──
  const handleFilesSelect = (files) => {
    setPendingFiles(files);
  };

  const handleUrlsChange = (urls) => {
    setFormData(prev => ({ ...prev, product_images: urls }));
  };

  // ── Save ──
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Upload new image to ImageKit first if a file was selected
      let updatedData = { ...formData };
      let newImageUrls = [];
      if (pendingFiles.length > 0) {
        newImageUrls = await Promise.all(pendingFiles.map(file => uploadToImageKit(file, '/products')));
      }

      const allImages = [...updatedData.product_images, ...newImageUrls];
      updatedData.product_images = allImages;
      updatedData.image_url = allImages.length > 0 ? allImages[0] : '';

      // 2. Then save product data to DB
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
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

  // ── Delete ──
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
              {formData.status} <ChevronDown size={16} className={`transition-transform duration-200 ${isPublishMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPublishMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setFormData(p => ({...p, status: 'Publish'})); setIsPublishMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${formData.status === 'Publish' ? 'text-[#0f8b80] bg-teal-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Publish
                </button>
                <button 
                  onClick={() => { setFormData(p => ({...p, status: 'Draft'})); setIsPublishMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${formData.status === 'Draft' ? 'text-[#0f8b80] bg-teal-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ════════════════════ Basic Information ════════════════════ */}
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
                  <option value="Furniture">Furniture</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                  <option value="Accessories">Accessories</option>
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
                placeholder="e.g. 100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Selling Price</label>
              <input 
                type="number" 
                name="selling_price"
                value={formData.selling_price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                placeholder="e.g. 80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Fabric</label>
              <input 
                type="text" 
                name="fabric"
                value={formData.fabric}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                placeholder="e.g. 100% Cotton"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Material</label>
              <input 
                type="text" 
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                placeholder="e.g. Leather"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Wash Care</label>
              <input 
                type="text" 
                name="wash_care"
                value={formData.wash_care}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                placeholder="e.g. Machine wash cold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Stock Quantity</label>
              <input 
                type="number" 
                name="stock_qty"
                value={formData.stock_qty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                placeholder="e.g. 100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Stock Status</label>
              <div className="relative">
                <select 
                  name="stock_status"
                  value={formData.stock_status}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors cursor-pointer"
                >
                  <option value="In stock">In stock</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Limited">Limited</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5 mt-2">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Short Description</label>
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

        {/* ════════════════════ Media ════════════════════ */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <h2 className="text-base font-bold text-gray-900 mb-6">Media</h2>
          
          <MultiImageUploader
            existingUrls={formData.product_images}
            onFilesSelect={handleFilesSelect}
            onUrlsChange={handleUrlsChange}
            label="Product Images"
          />
        </div>

        {/* ════════════════════ Variants ════════════════════ */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">Variant</h2>
            <button 
              onClick={handleAddVariant}
              className="flex items-center gap-1 border border-[#0f8b80] text-[#0f8b80] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f8b80] hover:text-white transition-colors"
            >
              <Plus size={14} /> Add More Variant
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Select Variant</label>
              <div className="relative">
                <select 
                  value={newVariant.variantType}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, variantType: e.target.value }))}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                >
                  <option>Size</option>
                  <option>Color</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f8b80] uppercase tracking-wider">Value</label>
              <div className="relative">
                <select 
                  value={newVariant.value}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80] transition-colors"
                >
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {formData.variants.length > 0 && (
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
                  {formData.variants.map((variant, index) => (
                    <tr key={index}>
                      <td className="py-4 pr-4">
                        <input 
                          type="text" 
                          value={variant.sku} 
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                          className="w-20 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#0f8b80] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={variant.variant_id}
                          onChange={(e) => handleVariantChange(index, 'variant_id', e.target.value)}
                          className="w-20 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#0f8b80] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-6 h-6 bg-gray-100 rounded">
                          {variant.image && <img src={variant.image} className="w-full h-full object-contain p-2" alt="Variant"/>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          className="w-16 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#0f8b80] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="w-10 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#0f8b80] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input 
                          type="text" 
                          value={variant.visible}
                          onChange={(e) => handleVariantChange(index, 'visible', e.target.value)}
                          className="w-20 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#0f8b80] focus:outline-none text-sm"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${variant.status === 'Active' ? 'bg-[#e2f5f3] text-[#0f8b80]' : 'bg-red-50 text-red-500'}`}>
                          {variant.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button 
                          onClick={() => handleRemoveVariant(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {formData.variants.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No variants added yet. Click &quot;Add More Variant&quot; to create one.</p>
          )}
        </div>

        {/* ════════════════════ Tags ════════════════════ */}
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

        {/* ════════════════════ Discounts ════════════════════ */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-gray-900">Discount</h2>
            <button 
              onClick={handleAddDiscount}
              className="flex items-center gap-1 border border-[#0f8b80] text-[#0f8b80] px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#0f8b80] hover:text-white transition-colors"
            >
              <Plus size={14} /> Add New Discount
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.discounts.map((discount, index) => (
              <div key={index} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">{index + 1} Discount</span>
                    <div className="w-8 h-4 bg-[#0f8b80] rounded-full relative cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveDiscount(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={discount.title}
                    onChange={(e) => handleDiscountChange(index, 'title', e.target.value)}
                    placeholder="Discount Title"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
                  />
                  <input
                    type="text"
                    value={discount.price}
                    onChange={(e) => handleDiscountChange(index, 'price', e.target.value)}
                    placeholder="Discount Price"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
                  />
                  <input
                    type="text"
                    value={discount.duration}
                    onChange={(e) => handleDiscountChange(index, 'duration', e.target.value)}
                    placeholder="Discount Duration"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f8b80]"
                  />
                </div>
              </div>
            ))}

            {formData.discounts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No discounts added yet. Click &quot;Add New Discount&quot; to create one.</p>
            )}
          </div>
        </div>

        {/* ════════════════════ Action Buttons ════════════════════ */}
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
