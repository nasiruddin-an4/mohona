'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, ChevronDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Check, Building2, Lock, Plus, Package, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import { uploadToR2 } from '@/lib/r2-client';

// ── Reusable filter dropdown ─────────────────────────────────────────────────
const FilterDropdown = ({ value, options, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => (o.value || o) === value);
  const label = selected ? (selected.label || selected) : placeholder;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none transition-colors min-w-[150px] ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
      >
        <span className="truncate">{label}</span>
        {disabled ? <Lock size={13} className="text-gray-400 shrink-0" /> : <ChevronDown size={13} className={`text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100">
          <button onClick={() => { onChange(''); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${!value ? 'text-[#0f8b80] font-bold bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>
            {placeholder} {!value && <Check size={14} className="text-[#0f8b80]" />}
          </button>
          {options.map(opt => {
            const val = opt.value || opt;
            const lbl = opt.label || opt;
            return (
              <button key={val} onClick={() => { onChange(val); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${val === value ? 'text-[#0f8b80] font-bold bg-gray-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>
                {lbl} {val === value && <Check size={14} className="text-[#0f8b80]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Stock badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ status }) => {
  const map = {
    'In stock': 'bg-blue-50 text-blue-600',
    'Out of stock': 'bg-red-50 text-red-600',
    'Limited': 'bg-amber-50 text-amber-600',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${map[status] || 'bg-gray-50 text-gray-500'}`}>{status}</span>;
};

// ── Unified Add Product Modal ────────────────────────────────────────────────
function AddOutletProductModal({ outlets, categories, isSuperAdmin, userOutletId, onClose, onSaved }) {
  const [selectedOutletId, setSelectedOutletId] = useState(isSuperAdmin ? '' : userOutletId);
  const [form, setForm] = useState({
    name: '', image_url: '', description: '', brand: '',
    categoryId: '', price: '', salePrice: '', stock_qty: 0,
    available: true, featured: false, status: 'Publish'
  });
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.price) {
      Swal.fire({ icon: 'warning', title: 'Name and Price are required', confirmButtonColor: '#0f8b80' }); return;
    }
    const outletId = isSuperAdmin ? selectedOutletId : userOutletId;
    if (!outletId) {
      Swal.fire({ icon: 'warning', title: 'Please select an outlet', confirmButtonColor: '#0f8b80' }); return;
    }
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (pendingImageFile) {
        imageUrl = await uploadToR2(pendingImageFile, 'mohona_shop/products');
      }

      const res = await fetch('/api/outlet-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outletId,
          ...form,
          image_url: imageUrl,
          price: Number(form.price),
          salePrice: Number(form.salePrice || 0),
          stock_qty: Number(form.stock_qty || 0)
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: 'Product created!', timer: 1500, showConfirmButton: false });
        onSaved();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || data.error, confirmButtonColor: '#0f8b80' });
      }
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e2f5f3] flex items-center justify-center"><Package size={20} className="text-[#0f8b80]" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
              <p className="text-sm text-gray-500">Create a product and add it to your inventory</p>
            </div>
          </div>

          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
            <ImageUploader value={form.image_url} onFileSelect={setPendingImageFile} label="Product Image" maxSizeMB={5} />

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" placeholder="e.g. Elegant Sofa" />
            </div>

            {isSuperAdmin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign Outlet *</label>
                <select value={selectedOutletId} onChange={e => setSelectedOutletId(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-white">
                  <option value="">Select outlet...</option>
                  {outlets.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-white">
                  <option value="">No category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand (Optional)</label>
                <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" placeholder="e.g. Mohona" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Price (৳) *</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Stock Qty</label>
                <input type="number" min="0" value={form.stock_qty} onChange={e => setForm(p => ({ ...p, stock_qty: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div><p className="text-sm font-bold text-gray-700">Available</p></div>
                <button onClick={() => setForm(p => ({ ...p, available: !p.available }))} className="shrink-0">{form.available ? <ToggleRight size={32} className="text-[#0f8b80]" /> : <ToggleLeft size={32} className="text-gray-300" />}</button>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-white">
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex gap-3 justify-end border-t border-gray-100 mt-4">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Unified Edit Product Modal ────────────────────────────────────────────────
function EditOutletProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.productId?.name || '',
    image_url: product.productId?.image_url || '',
    categoryId: product.categoryId?._id || '',
    price: product.price || '',
    salePrice: product.salePrice || '',
    stock_qty: product.stock_qty || 0,
    available: product.available ?? true,
    featured: product.featured ?? false,
    status: product.status || 'Publish'
  });
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.price) {
      Swal.fire({ icon: 'warning', title: 'Name and Price are required', confirmButtonColor: '#0f8b80' }); return;
    }
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (pendingImageFile) {
        imageUrl = await uploadToR2(pendingImageFile, 'mohona_shop/products');
      }

      const res = await fetch(`/api/outlet-products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image_url: imageUrl,
          price: Number(form.price),
          salePrice: Number(form.salePrice || 0),
          stock_qty: Number(form.stock_qty || 0)
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: 'Product updated!', timer: 1500, showConfirmButton: false });
        onSaved();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || data.error, confirmButtonColor: '#0f8b80' });
      }
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e2f5f3] flex items-center justify-center"><Edit2 size={20} className="text-[#0f8b80]" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
              <p className="text-sm text-gray-500">Update product details and inventory</p>
            </div>
          </div>
          
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
            <ImageUploader value={form.image_url} onFileSelect={setPendingImageFile} label="Product Image" maxSizeMB={5} />
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-white">
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Price (৳) *</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Sale Price (৳)</label>
                <input type="number" min="0" value={form.salePrice} onChange={e => setForm(p => ({ ...p, salePrice: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Stock Qty</label>
                <input type="number" min="0" value={form.stock_qty} onChange={e => setForm(p => ({ ...p, stock_qty: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div><p className="text-sm font-bold text-gray-700">Available</p></div>
                <button onClick={() => setForm(p => ({ ...p, available: !p.available }))} className="shrink-0">{form.available ? <ToggleRight size={32} className="text-[#0f8b80]" /> : <ToggleLeft size={32} className="text-gray-300" />}</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div><p className="text-sm font-bold text-gray-700">Featured</p></div>
                <button onClick={() => setForm(p => ({ ...p, featured: !p.featured }))} className="shrink-0">{form.featured ? <ToggleRight size={32} className="text-amber-500" /> : <ToggleLeft size={32} className="text-gray-300" />}</button>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex gap-3 justify-end border-t border-gray-100 mt-4">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Products Page ───────────────────────────────────────────────────────
export default function ProductsPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchAll = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedOutlet) params.set('outlet', selectedOutlet);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedStatus) params.set('status', selectedStatus);

      const [prodRes, outletsRes, catsRes] = await Promise.all([
        fetch(`/api/outlet-products?${params}`, { cache: 'no-store' }),
        isSuperAdmin ? fetch('/api/outlets') : Promise.resolve(null),
        fetch(`/api/categories${user?.outletId ? `?outlet=${user.outletId}` : ''}`),
      ]);
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.data);

      if (outletsRes) {
        const outletsData = await outletsRes.json();
        if (outletsData.success) setOutlets(outletsData.data);
      }

      const catsData = await catsRes.json();
      if (catsData.success) setCategories(catsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isSuperAdmin, selectedOutlet, selectedCategory, selectedStatus, user?.outletId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleAvailable = async (product) => {
    try {
      const res = await fetch(`/api/outlet-products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !product.available }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, available: data.data.available } : p));
      }
    } catch (err) { console.error(err); }
  };

  const toggleFeatured = async (product) => {
    try {
      const res = await fetch(`/api/outlet-products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, featured: data.data.featured } : p));
      }
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Remove from outlet?',
      text: "This removes the product from this outlet only. The master product remains.",
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
    });
    if (!result.isConfirmed) return;
    const res = await fetch(`/api/outlet-products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setProducts(prev => prev.filter(p => p._id !== id));
      Swal.fire({ icon: 'success', title: 'Removed', timer: 1200, showConfirmButton: false });
    }
  };

  const filtered = products.filter(p => {
    if (!search) return true;
    return p.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
           p.productId?.brand?.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const outletOptions = outlets.map(o => ({ value: o._id, label: o.name }));
  const categoryOptions = categories.map(c => ({ value: c._id, label: c.name }));

  if (authLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#0f8b80] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="container mx-auto bg-white rounded-2xl p-6 shadow-sm min-h-[calc(100vh-120px)] animate-in fade-in duration-500 flex flex-col">

      {/* Header */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 mb-6 border-b border-gray-200 pb-5">
        <h1 className="text-xl font-bold text-gray-900 shrink-0">Products</h1>

        {/* Outlet badge for managers */}
        {!isSuperAdmin && user?.outletName && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
            <Building2 size={12} />
            <span>{user.outletName}</span>
            <Lock size={11} className="text-teal-400" />
          </div>
        )}

        {/* Search */}
        <div className="flex-1 flex w-full lg:w-auto lg:justify-center">
          <div className="relative w-full max-w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0 ml-auto flex-wrap">
          {isSuperAdmin && (
            <FilterDropdown value={selectedOutlet} onChange={v => { setSelectedOutlet(v); setCurrentPage(1); }} placeholder="All Outlets" options={outletOptions} />
          )}
          <FilterDropdown value={selectedCategory} onChange={v => { setSelectedCategory(v); setCurrentPage(1); }} placeholder="All Categories" options={categoryOptions} />
          <FilterDropdown value={selectedStatus} onChange={v => { setSelectedStatus(v); setCurrentPage(1); }} placeholder="All Status" options={[{ value: 'Publish', label: 'Published' }, { value: 'Draft', label: 'Draft' }]} />
          <button onClick={() => setShowAddModal(true)} className="bg-[#0f8b80] hover:bg-[#0c7269] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
            <Plus size={15} strokeWidth={2.5} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="font-bold text-gray-700">{filtered.length}</span> products
        {selectedOutlet && <span>in selected outlet</span>}
        {search && <span>matching <em>"{search}"</em></span>}
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> {products.filter(p => p.available).length} Available</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span> {products.filter(p => !p.available).length} Unavailable</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 flex-1"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div></div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-gray-500 font-bold bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3">Product</th>
                {isSuperAdmin && <th className="px-4 py-3">Outlet</th>}
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-center">Available</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length > 0 ? paginated.map(product => {
                const mp = product.productId || {};
                const displayImg = mp.image_url || mp.cover_image || (mp.product_images?.[0]);
                return (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {displayImg ? <img src={displayImg} alt={mp.name} className="w-full h-full object-contain p-1" /> : <Package size={18} className="text-gray-200" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-[13px] leading-tight">{mp.name || '—'}</p>
                          {mp.brand && <p className="text-[11px] text-gray-400">{mp.brand}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Outlet (Super Admin only) */}
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
                          <Building2 size={12} />
                          {product.outletId?.name || '—'}
                        </div>
                      </td>
                    )}
                    {/* Category */}
                    <td className="px-4 py-3 text-gray-500 text-[13px]">{product.categoryId?.name || <span className="text-gray-300">—</span>}</td>
                    {/* Price */}
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-bold text-[#0f8b80] text-[13px]">৳{product.price?.toLocaleString()}</span>
                        {product.salePrice > 0 && <span className="block text-[11px] text-gray-400 line-through">৳{product.salePrice?.toLocaleString()}</span>}
                      </div>
                    </td>
                    {/* Stock */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-medium text-gray-700">{product.stock_qty ?? 0} pcs</span>
                        <StockBadge status={product.stock_status} />
                      </div>
                    </td>
                    {/* Available toggle */}
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleAvailable(product)} title={product.available ? 'Click to hide' : 'Click to show'} className="transition-transform hover:scale-110">
                        {product.available
                          ? <ToggleRight size={26} className="text-[#0f8b80]" />
                          : <ToggleLeft size={26} className="text-gray-300" />}
                      </button>
                    </td>
                    {/* Featured toggle */}
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleFeatured(product)} title={product.featured ? 'Click to unfeature' : 'Click to feature'} className="transition-transform hover:scale-110">
                        {product.featured
                          ? <ToggleRight size={26} className="text-amber-500" />
                          : <ToggleLeft size={26} className="text-gray-300" />}
                      </button>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${product.status === 'Publish' ? 'bg-[#e2f5f3] text-[#0f8b80]' : 'bg-orange-50 text-orange-500'}`}>
                        {product.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditProduct(product)}
                          title="Edit Outlet Specifics"
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#0f8b80] hover:border-[#0f8b80] hover:bg-teal-50 transition-all"
                        >
                          <Edit2 size={13} />
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => deleteProduct(product._id)}
                            title="Unlist from Outlet"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} className="text-center py-16 text-gray-500">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3"><Package size={24} className="text-gray-300" /></div>
                    <p className="font-bold text-gray-600">No products found</p>
                    <p className="text-xs text-gray-400 mt-1">Click "+ Add Product" to list your first product.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${currentPage === page ? 'bg-[#0f8b80] text-white font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddOutletProductModal
          outlets={outlets}
          categories={categories}
          isSuperAdmin={isSuperAdmin}
          userOutletId={user?.outletId}
          onClose={() => setShowAddModal(false)}
          onSaved={fetchAll}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditOutletProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
}
