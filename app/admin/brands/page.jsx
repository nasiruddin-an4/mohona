'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { renderToString } from 'react-dom/server';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setIsEditing(true);
    setCurrentId(brand._id);
    setFormData({ 
      name: brand.name || '', 
      description: brand.description || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = isEditing ? `/api/brands/${currentId}` : '/api/brands';
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
          text: `Brand ${isEditing ? 'updated' : 'added'} successfully.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        closeModal();
        fetchBrands(); // Refresh table instantly
      } else {
        Swal.fire('Error', data.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to save brand', 'error');
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
        const res = await fetch(`/api/brands/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        
        if (data.success) {
          Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
          fetchBrands(); // Refresh table instantly
        } else {
          Swal.fire('Error', data.error || 'Failed to delete', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred during deletion', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage product brands</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0f8b80] hover:bg-[#0c766d] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
        >
          <Plus size={16} />
          Add Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="text-gray-900 font-bold border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{brand.name}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-[400px] truncate">{brand.description || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => openEditModal(brand)}
                            className="text-gray-400 hover:text-[#0f8b80] transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} strokeWidth={2} />
                          </button>
                          <button 
                            onClick={() => handleDelete(brand._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-16 text-gray-500">
                      No brands found. Click "Add Brand" to create one.
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
                {isEditing ? 'Edit Brand' : 'Add Brand'}
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
                    placeholder="e.g. Apple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all text-sm resize-none"
                    placeholder="Brief description of the brand..."
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
                  {isEditing ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
