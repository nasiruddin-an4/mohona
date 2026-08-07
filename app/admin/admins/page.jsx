'use client';

import React, { useState } from 'react';
import { Search, Plus, ShieldCheck, Mail, ShieldAlert, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for Admins since the current auth system uses a single env-based Super Admin
  const admins = [
    { id: 1, name: 'Super Admin', email: 'admin@mohona.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now', avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=0f8b80&color=fff' },
    { id: 2, name: 'Nasir Uddin', email: 'manager@mohona.com', role: 'Store Manager', status: 'Active', lastActive: '2 hours ago', avatar: 'https://ui-avatars.com/api/?name=Nasir+Uddin&background=6B5CE7&color=fff' },
    { id: 3, name: 'Support Team', email: 'support@mohona.com', role: 'Customer Support', status: 'Offline', lastActive: '1 day ago', avatar: 'https://ui-avatars.com/api/?name=Support&background=f59e0b&color=fff' }
  ];

  const handleAddAdmin = () => {
    Swal.fire({
      icon: 'info',
      title: 'Multi-Admin Support',
      text: 'Currently, the system runs on a single environment-secured Super Admin for maximum security. Database-driven multi-admin support will be enabled in the next update!',
      confirmButtonColor: '#0f8b80'
    });
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admins & Staff</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin roles, permissions, and staff accounts.</p>
        </div>
        
        <button 
          onClick={handleAddAdmin}
          className="px-5 py-2.5 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0c766d] flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} /> Add New Admin
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
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
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl shadow-sm">
              <span className="text-[#0f8b80] mr-1">{filteredAdmins.length}</span> Staff Members
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead>
              <tr className="text-gray-900 font-bold border-b border-gray-100 bg-white">
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">User</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Role & Access</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-center">Status</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400">Last Active</th>
                <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-xl object-contain p-2 border border-gray-100 shadow-sm" />
                      <div>
                        <div className="font-bold text-gray-900">{admin.name}</div>
                        <div className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-gray-400" /> {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {admin.role === 'Super Admin' ? (
                        <ShieldAlert size={16} className="text-purple-500" />
                      ) : (
                        <ShieldCheck size={16} className="text-[#0f8b80]" />
                      )}
                      <span className="font-bold text-gray-700">{admin.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                      admin.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-medium text-xs">{admin.lastActive}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#0f8b80] hover:border-[#0f8b80] hover:bg-[#0f8b80]/5 transition-all">
                        <Edit size={14} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="text-gray-400" size={24} />
                    </div>
                    <p className="font-medium text-gray-600">No admins found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
