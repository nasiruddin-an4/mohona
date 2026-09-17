'use client';

import React, { useEffect, useState } from 'react';
import { Search, History, Building2, Lock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export default function AuditLogPage() {
  const { user, isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  
  const fetchOutlets = async () => {
    try {
      const res = await fetch('/api/outlets');
      const data = await res.json();
      if (data.success) setOutlets(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedOutlet) params.set('outlet', selectedOutlet);
      else if (!isSuperAdmin && user?.outletId) params.set('outlet', user.outletId);

      const res = await fetch(`/api/audit-logs?${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (isSuperAdmin) fetchOutlets();
  }, [selectedOutlet, isSuperAdmin, user?.outletId]);

  const filteredLogs = logs.filter(log => {
    if (!search) return true;
    const q = search.toLowerCase();
    return log.action.toLowerCase().includes(q) || 
           log.entityType.toLowerCase().includes(q) ||
           log.userId?.name?.toLowerCase().includes(q) ||
           log.userId?.email?.toLowerCase().includes(q);
  });

  const getActionColor = (action) => {
    if (action.includes('CREATE') || action.includes('ADD')) return 'text-green-600 bg-green-50 border-green-100';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (action.includes('DELETE') || action.includes('REMOVE')) return 'text-red-600 bg-red-50 border-red-100';
    return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans flex flex-col gap-6">
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0f8b80]/10 rounded-xl flex items-center justify-center text-[#0f8b80]">
            <History size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm font-medium text-gray-500">Track system activities and changes</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search action, entity or user..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
            
            {isSuperAdmin && (
              <select
                value={selectedOutlet}
                onChange={e => setSelectedOutlet(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-full text-[13px] text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 bg-white min-w-[160px]"
              >
                <option value="">All Outlets (Global)</option>
                {outlets.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
              </select>
            )}

            {!isSuperAdmin && user?.outletName && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
                <Building2 size={12} /> {user.outletName} <Lock size={11} className="text-teal-400" />
              </div>
            )}
          </div>
          
          <div className="hidden md:block text-xs font-bold text-gray-400">
            {filteredLogs.length} Records
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="text-gray-500 font-bold border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4 w-48">Date & Time</th>
                  <th className="px-6 py-4">User</th>
                  {isSuperAdmin && <th className="px-6 py-4">Outlet</th>}
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4 w-64">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{log.userId?.name || 'System'}</span>
                          {log.userId?.email && <span className="text-xs text-gray-500">{log.userId.email}</span>}
                        </div>
                      </td>
                      {isSuperAdmin && (
                        <td className="px-6 py-4">
                          {log.outletId ? (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600">
                              <Building2 size={11} />
                              {log.outletId.name}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded border border-gray-100">Global</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionColor(log.action)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-gray-700">
                          {log.entityType}
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {log.entityId?.slice(-6) || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <div className="max-h-16 overflow-y-auto pr-2 custom-scrollbar">
                          {log.details ? (
                            <pre className="font-mono text-[10px] text-gray-500 whitespace-pre-wrap">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-gray-400 italic">No additional details</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="text-center py-16 text-gray-500">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <History size={24} className="text-gray-300" />
                      </div>
                      <p className="font-bold text-gray-600">No logs found</p>
                      <p className="text-xs text-gray-400 mt-1">Activity logs will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
