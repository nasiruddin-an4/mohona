'use client';

import React, { useState } from 'react';
import { Search, Globe, Bell, Settings, Menu, LogOut, ChevronDown, Building2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  OUTLET_MANAGER: 'Outlet Manager',
  OUTLET_STAFF: 'Outlet Staff',
};

const ROLE_COLORS = {
  SUPER_ADMIN: 'text-purple-600 bg-purple-50 border-purple-100',
  OUTLET_MANAGER: 'text-teal-600 bg-teal-50 border-teal-100',
  OUTLET_STAFF: 'text-blue-600 bg-blue-50 border-blue-100',
};

export default function AdminHeader({ toggleSidebar }) {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/admin-logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const displayName = user?.name || settings?.adminName || 'Admin';
  const displayRole = user?.role ? ROLE_LABELS[user.role] : (settings?.adminRole || 'Administrator');
  const roleColorClass = user?.role ? ROLE_COLORS[user.role] : ROLE_COLORS['OUTLET_STAFF'];
  const avatarUrl = settings?.adminAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f8b80&color=fff`;

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
      
      {/* Left side: Menu toggle & Search */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-72">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-5 relative">

        {/* Outlet badge — shown for non-super admins */}
        {!loading && user && !user.isSuperAdmin && user.outletName && (
          <div className="hidden lg:flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <Building2 size={13} />
            <span>{user.outletName}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-4 text-gray-400 border-r border-gray-200 pr-5">
          <Link href="/" target="_blank" className="hover:text-[#0f8b80] transition-colors flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
             <Globe size={16} />
             <span className="text-xs font-bold text-gray-600">Visit Website</span>
          </Link>
          <button className="hover:text-gray-900 transition-colors relative">
             <Bell size={18} />
             <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-[#0f8b80]/20 transition-all">
               <img
                 src={avatarUrl}
                 alt="Profile"
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {user?.isSuperAdmin ? (
                  <ShieldAlert size={10} className="text-purple-500" />
                ) : (
                  <ShieldCheck size={10} className="text-teal-500" />
                )}
                <p className="text-[11px] font-medium text-gray-400">{displayRole}</p>
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" />
          </div>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* User info block */}
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-xs font-bold text-gray-900">{displayName}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{user?.email || ''}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleColorClass}`}>
                    {displayRole}
                  </span>
                  {user?.outletName && (
                    <p className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
                      <Building2 size={10} /> {user.outletName}
                    </p>
                  )}
                </div>

                <Link 
                  href="/admin/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0f8b80] transition-colors"
                >
                  <Settings size={16} />
                  Profile Settings
                </Link>
                <div className="h-px bg-gray-100 my-1 w-full"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    </header>
  );
}
