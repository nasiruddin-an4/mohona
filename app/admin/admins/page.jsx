'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, ShieldCheck, Mail, ShieldAlert, Edit, Trash2, Building2, UserCheck, UserX, Key } from 'lucide-react';
import Swal from 'sweetalert2';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  OUTLET_MANAGER: 'Outlet Manager',
  OUTLET_STAFF: 'Outlet Staff',
};

const ROLE_COLORS = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-700 border-purple-100',
  OUTLET_MANAGER: 'bg-teal-50 text-teal-700 border-teal-100',
  OUTLET_STAFF: 'bg-blue-50 text-blue-700 border-blue-100',
};

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'OUTLET_MANAGER',
  outletId: '',
  status: 'Active',
};

export default function AdminsPage() {
  const [users, setUsers] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, outletsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/outlets'),
      ]);
      const usersData = await usersRes.json();
      const outletsData = await outletsRes.json();
      if (usersData.success) setUsers(usersData.data);
      if (outletsData.success) setOutlets(outletsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '', // don't pre-fill password
      role: user.role,
      outletId: user.outletId?._id || user.outletId || '',
      status: user.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      Swal.fire({ icon: 'warning', title: 'Name and email are required', confirmButtonColor: '#0f8b80' });
      return;
    }
    if (!editingUser && !form.password) {
      Swal.fire({ icon: 'warning', title: 'Password is required for new users', confirmButtonColor: '#0f8b80' });
      return;
    }
    if (form.role !== 'SUPER_ADMIN' && !form.outletId) {
      Swal.fire({ icon: 'warning', title: 'Please assign an outlet for this role', confirmButtonColor: '#0f8b80' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (payload.role === 'SUPER_ADMIN') payload.outletId = null;

      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchData();
        
        if (!editingUser) {
          Swal.fire({
            icon: 'success',
            title: 'User created successfully!',
            html: `
              <div class="text-left bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">
                <p class="text-sm text-gray-500 mb-1">Email / Username:</p>
                <p class="font-bold text-gray-900 mb-3">${payload.email}</p>
                <p class="text-sm text-gray-500 mb-1">Password:</p>
                <p class="font-bold text-gray-900 font-mono">${payload.password}</p>
              </div>
            `,
            confirmButtonColor: '#0f8b80',
            confirmButtonText: 'Copy Credentials',
            showCancelButton: true,
            cancelButtonText: 'Close',
          }).then((result) => {
            if (result.isConfirmed) {
              navigator.clipboard.writeText(`Email: ${payload.email}\nPassword: ${payload.password}`);
              Swal.fire({
                icon: 'success',
                title: 'Copied!',
                timer: 1500,
                showConfirmButton: false
              });
            }
          });
        } else {
          Swal.fire({ icon: 'success', title: 'User updated!', timer: 1500, showConfirmButton: false });
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || data.error, confirmButtonColor: '#0f8b80' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Network error', confirmButtonColor: '#0f8b80' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete user?',
      text: `Remove "${user.name}" permanently?`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;

    const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      fetchData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0f8b80' });
    }
  };

  const handleResetPassword = async (user) => {
    const { value: newPassword } = await Swal.fire({
      title: 'Reset Password',
      input: 'password',
      inputLabel: `New password for ${user.name}`,
      inputPlaceholder: 'Enter new password',
      showCancelButton: true,
      confirmButtonColor: '#0f8b80',
      inputValidator: (value) => {
        if (!value) return 'You need to write something!';
        if (value.length < 6) return 'Password must be at least 6 characters.';
      }
    });

    if (newPassword) {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPassword }),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire({ icon: 'success', title: 'Password Updated!', timer: 1500, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0f8b80' });
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network error', confirmButtonColor: '#0f8b80' });
      } finally {
        setLoading(false);
      }
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const formatLastActive = (date) => {
    if (!date) return 'Never';
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users & Staff</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin roles, outlet assignments, and staff accounts.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} /> Add User
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400 font-medium text-gray-900"
              />
            </div>
            {/* Role filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20"
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="OUTLET_MANAGER">Outlet Manager</option>
              <option value="OUTLET_STAFF">Outlet Staff</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl shadow-sm">
              <span className="text-[#0f8b80] mr-1">{filtered.length}</span> Users
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0f8b80] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">User</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Role</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Outlet</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-center">Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Last Active</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f8b80&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} className="text-gray-400" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'SUPER_ADMIN' ? (
                          <ShieldAlert size={15} className="text-purple-500 shrink-0" />
                        ) : (
                          <ShieldCheck size={15} className="text-teal-500 shrink-0" />
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.outletId ? (
                        <div className="flex items-center gap-1.5 text-teal-600">
                          <Building2 size={13} />
                          <span className="font-medium text-xs">{user.outletId.name || 'Unknown'}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">All Outlets</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-medium text-xs">{formatLastActive(user.lastActive)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleResetPassword(user)}
                          title="Reset Password"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-amber-600 hover:border-amber-600 hover:bg-amber-50 transition-all"
                        >
                          <Key size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          title="Edit User"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#0f8b80] hover:border-[#0f8b80] hover:bg-[#0f8b80]/5 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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
                    <td colSpan="6" className="text-center py-20 text-gray-500">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="text-gray-400" size={24} />
                      </div>
                      <p className="font-medium text-gray-600">No users found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search or add a new user.</p>
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
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <p className="text-sm text-gray-500 mt-1">{editingUser ? 'Update user details and permissions.' : 'Create a new admin or staff account.'}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rahim Uddin"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="user@mohona.com"
                    disabled={!!editingUser}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder={editingUser ? '••••••••' : 'Min 8 characters'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Role *</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value, outletId: '' }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all bg-white"
                  >
                    <option value="OUTLET_STAFF">Outlet Staff</option>
                    <option value="OUTLET_MANAGER">Outlet Manager</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                {form.role !== 'SUPER_ADMIN' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign Outlet *</label>
                    <select
                      value={form.outletId}
                      onChange={e => {
                        const selectedId = e.target.value;
                        const selectedOutlet = outlets.find(o => o._id === selectedId);
                        
                        setForm(p => {
                          const updates = { outletId: selectedId };
                          if (selectedOutlet) {
                            const parts = selectedOutlet.slug.split('-');
                            const city = parts[parts.length - 1];
                            const cityCap = city.charAt(0).toUpperCase() + city.slice(1);
                            
                            const rolePrefix = p.role === 'OUTLET_MANAGER' ? 'manager' : 'staff';
                            updates.email = `${rolePrefix}.${city}@mohona.com`;
                            updates.name = `${cityCap} ${p.role === 'OUTLET_MANAGER' ? 'Manager' : 'Staff'}`;
                          }
                          return { ...p, ...updates };
                        });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all bg-white"
                    >
                      <option value="">Select an outlet...</option>
                      {outlets.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 focus:border-[#0f8b80] transition-all bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3 justify-end">
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
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
