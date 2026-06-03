'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  Store, 
  PieChart, 
  Settings, 
  LogOut,
  HelpCircle,
  FileText,
  ShieldAlert,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const sidebarSections = [
  {
    title: null, // No title for top level items
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' }
    ]
  },
  {
    title: 'PRODUCT MANAGEMENT',
    items: [
      { 
        name: 'Manage Product', 
        icon: Package, 
        isAccordion: true,
        defaultOpen: true,
        subItems: [
          { name: 'All Products', path: '/admin/products' },
          { name: 'Draft Products', path: '/admin/products/drafts' },
          { name: 'Stock Products', path: '/admin/products/stock' },
          { name: 'Product Review', path: '/admin/products/reviews' },
        ]
      },
      { 
        name: 'Categories', 
        icon: Layers, 
        isAccordion: true,
        defaultOpen: false,
        subItems: [
          { name: 'Categories List', path: '/admin/categories' },
          { name: 'Tags List', path: '/admin/tags' },
          { name: 'Brand List', path: '/admin/brands' },
        ]
      },
      { name: 'Manage Inventory', icon: Store, path: '/admin/inventory' },
    ]
  },
  {
    title: 'ORDER MANAGEMENT',
    items: [
      { 
        name: 'Orders', 
        icon: ShoppingCart, 
        isAccordion: true,
        defaultOpen: false,
        subItems: [
          { name: 'All Orders', path: '/admin/orders' },
          { name: 'Return & Refund', path: '/admin/orders/returns' },
          { name: 'Abandoned Cart', path: '/admin/orders/abandoned' },
          { name: 'Transactions', path: '/admin/orders/transactions' },
        ]
      }
    ]
  },
  {
    title: 'REPORTS & ANALYTICS',
    items: [
      { name: 'Sales reports', icon: FileText, path: '/admin/reports/sales' },
    ]
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { name: 'Admin', icon: Users, path: '/admin/admins' },     
      { name: 'Customer', icon: Users, path: '/admin/customers' },
    ]
  },

];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  React.useEffect(() => {
    let activeAccordion = {};
    sidebarSections.forEach(section => {
      section.items.forEach(item => {
        if (item.isAccordion) {
          const hasActive = item.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/'));
          if (hasActive) activeAccordion[item.name] = true;
        }
      });
    });
    // If no accordion is active, keep the current one open, or close all. 
    // We will just set it to the active one to ensure it stays in sync.
    if (Object.keys(activeAccordion).length > 0) {
      setOpenMenus(activeAccordion);
    } else {
      setOpenMenus({});
    }
  }, [pathname]);

  const toggleMenu = (name) => {
    setOpenMenus(prev => {
      if (prev[name]) {
        return {}; // Close if already open
      }
      return { [name]: true }; // Open only the clicked one
    });
  };

  return (
    <aside 
      className={`bg-slate-900 flex flex-col transition-all duration-300 z-20
        ${isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0 lg:w-20'} 
        fixed lg:relative h-screen`}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
        <div className={`flex items-center gap-3 font-bold text-xl text-white ${!isOpen ? 'lg:hidden' : ''}`}>
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <span>Mohona</span>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-white lg:hidden transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sidebarSections.map((section, sIdx) => (
          <div key={sIdx} className="mb-6">
            {section.title && isOpen && (
              <div className="px-6 mb-3">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{section.title}</span>
              </div>
            )}
            
            <ul className="space-y-1.5 px-4">
              {section.items.map((item) => {
                const isAccordionOpen = openMenus[item.name];
                
                // If it's an accordion item
                if (item.isAccordion) {
                  const hasActiveChild = item.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/'));
                  
                  return (
                    <li key={item.name} className="flex flex-col">
                      <button 
                        onClick={() => {
                          if (!isOpen) setIsOpen(true);
                          toggleMenu(item.name);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left
                          ${isAccordionOpen 
                            ? 'bg-white/10 text-white font-bold' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white font-medium'
                          }`}
                      >
                        <item.icon size={18} className={isAccordionOpen || hasActiveChild ? 'text-orange-500' : ''} />
                        {isOpen && (
                          <span className="flex-1 text-sm">{item.name}</span>
                        )}
                        {isOpen && (
                          <ChevronDown size={16} className={`transition-transform duration-300 ${isAccordionOpen ? 'rotate-180 text-orange-500' : 'text-white/40'}`} />
                        )}
                      </button>

                      {/* Submenu with vertical line and smooth transition */}
                      {isOpen && (
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isAccordionOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="relative ml-[21px] pl-5 border-l-2 border-white/10">
                            <ul className="space-y-1 py-1">
                              {item.subItems.map((subItem) => {
                                const isSubActive = pathname === subItem.path || pathname.startsWith(subItem.path + '/');
                                return (
                                  <li key={subItem.name} className="relative">
                                    {/* Dot on the line */}
                                    <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-colors duration-300
                                      ${isSubActive ? 'bg-orange-500 border-orange-500' : 'bg-transparent border-white/20'}`} 
                                    />
                                    <Link 
                                      href={subItem.path}
                                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        isSubActive 
                                          ? 'text-orange-400 font-bold bg-white/5' 
                                          : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                                      }`}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                }

                // Normal items
                const isActive = pathname === item.path || (pathname.startsWith(item.path + '/') && item.path !== '/admin');
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-white/10 text-white font-bold' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white font-medium'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-orange-500' : ''} />
                      {isOpen && (
                        <span className="flex-1 text-sm">{item.name}</span>
                      )}
                      {isOpen && item.hasSubmenu && (
                        <ChevronDown size={16} className="text-white/40" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
