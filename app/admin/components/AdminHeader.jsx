'use client';

import React from 'react';
import { Search, Globe, Moon, Bell, Maximize, Settings, Menu } from 'lucide-react';

export default function AdminHeader({ toggleSidebar }) {
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
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-4 text-gray-400 border-r border-gray-200 pr-5">
          <button className="hover:text-gray-900 transition-colors">
             <Globe size={18} />
          </button>
          <button className="hover:text-gray-900 transition-colors">
             <Moon size={18} />
          </button>
          <button className="hover:text-gray-900 transition-colors relative">
             <Bell size={18} />
             <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <button className="hover:text-gray-900 transition-colors">
             <Settings size={18} />
          </button>
          <button className="hover:text-gray-900 transition-colors">
             <Maximize size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
             <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900">Kristin Watson</p>
            <p className="text-[11px] font-medium text-gray-400">Sale Administrator</p>
          </div>
        </div>
      </div>

    </header>
  );
}
