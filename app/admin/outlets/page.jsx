'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, CheckCircle, XCircle, MapPin, Phone, Mail, Globe } from 'lucide-react';
import Swal from 'sweetalert2';

const EMPTY_FORM = {
  name: '',
  slug: '',
  address: '',
  phone: '',
  email: '',
  openingHours: '',
  googleMapUrl: '',
  coverImage: '',
  description: '',
  status: 'Active',
};

export default function OutletsPage() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchOutlets = async () => {
    try {
      const res = await fetch('/api/outlets');
      const data = await res.json();
      if (data.success) setOutlets(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOutlets(); }, []);

  const openAdd = () => {
    setEditingOutlet(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (outlet) => {
    setEditingOutlet(outlet);
    setForm({
      name: outlet.name,
      slug: outlet.slug,
      address: outlet.address || '',
      phone: outlet.phone || '',
      email: outlet.email || '',
      openingHours: outlet.openingHours || '',
      googleMapUrl: outlet.googleMapUrl || '',
      coverImage: outlet.coverImage || '',
      description: outlet.description || '',
      status: outlet.status,
    });
    setShowModal(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm(prev => ({
      ...prev,
      name,
      slug: !editingOutlet
        ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name is required', confirmButtonColor: '#0f8b80' });
      return;
    }
    setSaving(true);
    try {
      const url = editingOutlet ? `/api/outlets/${editingOutlet._id}` : '/api/outlets';
      const method = editingOutlet ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: editingOutlet ? 'Outlet updated!' : 'Outlet created!', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        fetchOutlets();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || data.message, confirmButtonColor: '#0f8b80' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Network error', confirmButtonColor: '#0f8b80' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (outlet) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete outlet?',
      text: `This will permanently delete "${outlet.name}". This cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;

    const res = await fetch(`/api/outlets/${outlet._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      fetchOutlets();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0f8b80' });
    }
  };

  const filtered = outlets.filter(o =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Outlets</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all Mohona branches and their details.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} /> Add Outlet
        </button>
      </div>

      {/* Cards Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search outlets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
          </div>
          <span className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl shadow-sm self-start md:self-auto flex items-center">
            <span className="text-[#0f8b80] mr-1">{filtered.length}</span> Outlets
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0f8b80] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Outlet</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Contact</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-center">Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((outlet) => (
                  <tr key={outlet._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm">
                          <Building2 size={18} className="text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{outlet.name}</div>
                          {outlet.address && (
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {outlet.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {outlet.phone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone size={10} /> {outlet.phone}
                          </span>
                        )}
                        {outlet.email && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={10} /> {outlet.email}
                          </span>
                        )}
                        {!outlet.phone && !outlet.email && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                        outlet.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {outlet.status === 'Active'
                          ? <CheckCircle size={11} />
                          : <XCircle size={11} />}
                        {outlet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(outlet)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#0f8b80] hover:border-[#0f8b80] hover:bg-[#0f8b80]/5 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(outlet)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-gray-500">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building2 className="text-gray-300" size={28} />
                      </div>
                      <p className="font-medium text-gray-600">No outlets found</p>
                      <p className="text-xs text-gray-400 mt-1">Add your first outlet to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingOutlet ? 'Edit Outlet' : 'Add New Outlet'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingOutlet ? 'Update outlet information.' : 'Create a new Mohona branch outlet.'}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Outlet Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Mohona Shop Dhaka"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                  />
                </div>


                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+880..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="outlet@mohona.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Opening Hours</label>
                    <input
                      type="text"
                      value={form.openingHours}
                      onChange={(e) => setForm(prev => ({ ...prev, openingHours: e.target.value }))}
                      placeholder="e.g. 9:00 AM - 10:00 PM"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Google Map URL</label>
                    <input
                      type="text"
                      value={form.googleMapUrl}
                      onChange={(e) => setForm(prev => ({ ...prev, googleMapUrl: e.target.value }))}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image URL</label>
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of this outlet..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 shrink-0 flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editingOutlet ? 'Update Outlet' : 'Create Outlet'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
