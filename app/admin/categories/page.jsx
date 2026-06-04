'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, FolderOpen, Tag } from 'lucide-react';
import Swal from 'sweetalert2';
import { renderToString } from 'react-dom/server';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategories: []
  });
  const [subcatInput, setSubcatInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', description: '', subcategories: [] });
    setSubcatInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat._id);
    setFormData({ 
      name: cat.name || '', 
      description: cat.description || '',
      subcategories: cat.subcategories || []
    });
    setSubcatInput('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addSubcategory = (e) => {
    e.preventDefault();
    if (subcatInput.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, { name: subcatInput.trim() }]
      });
      setSubcatInput('');
    }
  };

  const removeSubcategory = (index) => {
    const newSubcats = [...formData.subcategories];
    newSubcats.splice(index, 1);
    setFormData({
      ...formData,
      subcategories: newSubcats
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = isEditing ? `/api/categories/${currentId}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: `Category ${isEditing ? 'updated' : 'added'} successfully.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        closeModal();
        fetchCategories(); // Refresh table instantly
      } else {
        Swal.fire('Error', data.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to save category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#f1f5f9',
      confirmButtonText: `<span style="display:flex; align-items:center; gap:6px; font-weight:600;">${renderToString(<Trash2 size={16} strokeWidth={2.5} />)} Yes, Delete</span>`,
      cancelButtonText: `<span style="display:flex; align-items:center; gap:6px; font-weight:600; color:#475569;">${renderToString(<X size={16} strokeWidth={2.5} />)} Cancel</span>`
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        
        if (data.success) {
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          fetchCategories(); // Refresh table instantly
        } else {
          Swal.fire('Error', data.error || 'Failed to delete', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred during deletion', 'error');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.subcategories && cat.subcategories.some(sub => sub.name?.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage your product catalog structure</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#0f8b80] hover:bg-[#0c766d] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search categories or subcategories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          <div className="hidden md:block text-xs font-bold text-gray-400">
            {filteredCategories.length} Categories Found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 w-[40%]">Category Details</th>
                  <th className="px-6 py-4 w-[45%]">Subcategories</th>
                  <th className="px-6 py-4 text-right w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 mt-1 group-hover:scale-110 transition-transform">
                            <FolderOpen size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed max-w-sm line-clamp-2">
                              {cat.description || <span className="italic text-gray-400">No description provided</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top pt-5">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {cat.subcategories.map((sub, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 font-bold text-[11px] rounded-md border border-gray-200/50 hover:border-gray-300 transition-colors">
                                <Tag size={10} className="text-gray-400" />
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-md">Empty</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top pt-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(cat)}
                            className="p-2 text-gray-400 hover:text-[#0f8b80] hover:bg-[#0f8b80]/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-16 text-gray-500">
                      No categories found. Click "Add Category" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all text-sm"
                    placeholder="e.g. Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subcategories</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text"
                      value={subcatInput}
                      onChange={(e) => setSubcatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSubcategory(e);
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all text-sm"
                      placeholder="Type and press Enter or Add"
                    />
                    <button 
                      type="button" 
                      onClick={addSubcategory}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.subcategories.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-[#e2f5f3] text-[#0f8b80] px-3 py-1.5 rounded-full text-xs font-bold border border-[#0f8b80]/20">
                          <span>{sub.name}</span>
                          <button 
                            type="button" 
                            onClick={() => removeSubcategory(idx)}
                            className="hover:bg-[#0f8b80]/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all text-sm resize-none"
                    placeholder="Brief description of the category..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#0f8b80] hover:bg-[#0c766d] rounded-full transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {isEditing ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
