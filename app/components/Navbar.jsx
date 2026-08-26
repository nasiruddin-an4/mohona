"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "../../store/useCartStore";
import { useSidebarStore } from "../../store/useSidebarStore";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Wheat,
  Beef,
  Carrot,
  Milk,
  Flame,
  Cookie,
  Coffee,
  Sparkles,
  Phone,
} from "lucide-react";
import CartSidebar from "../../components/CartSidebar";
import linksData from "../../data/links.json";
import { useSiteSettings } from "../context/SiteSettingsContext";

// Map icon names from JSON to lucide components
const ICON_MAP = {
  Wheat,
  Beef,
  Carrot,
  Milk,
  Flame,
  Cookie,
  Coffee,
  Sparkles,
};

const shopLocations = [
  { id: 1, name: "Mohona Shop Dhaka", hasCategories: true },
  { id: 2, name: "Mohona Exclusive Shop Chattogram", hasCategories: false },
  { id: 3, name: "Super Shop Mohona Mongla", hasCategories: false },
  { id: 4, name: "Mohona Exclusive Shop Bhola", hasCategories: false },
  { id: 5, name: "Mohona Exclusive Shop Patuakhali", hasCategories: false }
];

export default function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { isCartOpen, openCart, closeCart } = useSidebarStore();
  const { settings } = useSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(null);
  const [activeShopCategory, setActiveShopCategory] = useState(null);

  // Search State
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setAllProducts(data.data.filter(p => (p.status || 'Publish') === 'Publish'));
          const categories = new Set(data.data.map(p => p.category));
          setAvailableCategories(Array.from(categories));
        }
      } catch (error) {
        console.error("Error fetching available categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const categoryRef = useRef(null);
  const categoryTimeoutRef = useRef(null);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutsideSearch(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  // Close shop dropdown when navigating
  useEffect(() => {
    setShopMenuOpen(false);
  }, [pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="hidden md:block bg-slate-900 py-2.5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-2 text-gray-50 shrink-0">
            <Phone size={14} className="text-slate-300 fill-slate-300" />
            <span className="font-medium tracking-wide">
              Call Us: {settings?.phone || '01769-441085'}
            </span>
          </div>

          {/* Center: Marquee */}
          <div className="flex-1 overflow-hidden mx-6 relative flex items-center h-full">
            <div className="animate-marquee-rtl flex whitespace-nowrap text-amber-400 font-semibold tracking-wider w-max">
              <span className="mx-16">মোহনা শপ এই মুহূর্তে অনলাইনে অর্ডার নিচ্ছে না। আমাদের অফলাইন ডেলিভারি এই মুহূর্তে বন্ধ আছে। প্রোডাক্ট অর্ডার করতে হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন।</span>
              <span className="mx-16">মোহনা শপ এই মুহূর্তে অনলাইনে অর্ডার নিচ্ছে না। আমাদের অফলাইন ডেলিভারি এই মুহূর্তে বন্ধ আছে। প্রোডাক্ট অর্ডার করতে হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন।</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-3 text-gray-50 font-medium shrink-0">
            {linksData.topbar.map((link, index) => (
              <React.Fragment key={index}>
                <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                {index < linksData.topbar.length - 1 && <span className="text-gray-100">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <nav className="bg-gray-50 sticky top-0 z-50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Section: Logo & Menus */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group mr-4">
                <img src="/logoFinal.jpg" alt={settings?.storeName || "Mohona by CGFWA"} className="h-16 w-auto object-contain py-1" />
              </Link>

              {/* Main Menu */}
              <div className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-gray-700">

                {/* Shop with Dropdown */}
                <div
                  className="relative py-2"
                  onMouseEnter={() => setShopMenuOpen(true)}
                  onMouseLeave={() => setShopMenuOpen(false)}
                >
                  <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="flex items-center gap-1 hover:text-black transition-colors">
                    <span>Shop</span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform duration-300 ${shopMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  <div className={`absolute top-full left-0 mt-0 w-72 bg-white shadow-xl border border-gray-100 z-[60] transition-all duration-300 ease-in-out ${shopMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                    <div className="flex flex-col py-2">
                        {shopLocations.map((loc) => (
                          <div key={loc.id} className="relative group">
                            <div className="px-6 py-2.5 text-[14px] font-normal text-gray-600 hover:bg-gray-50 hover:text-black transition-colors flex items-center justify-between cursor-pointer">
                              {loc.name}
                              {loc.hasCategories && <ChevronRight size={14} />}
                            </div>
                            {/* Submenu */}
                            {loc.hasCategories && (
                              <div className="absolute top-2 left-full ml-0 w-56 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70]">
                                <div className="flex flex-col py-2">
                                  {linksData.shopDropdown
                                      .filter(item => !availableCategories || item.label === 'All Categories' || availableCategories.includes(item.label))
                                      .map((item, idx) => (
                                      <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setShopMenuOpen(false)}
                                        className="px-6 py-2 text-[14px] font-normal text-gray-600 hover:text-black transition-colors flex items-center justify-between"
                                      >
                                        {item.label}
                                        {item.badge && (
                                          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{item.badge}</span>
                                        )}
                                      </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                  </div>
                </div>

                <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
                <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
              </div>
            </div>

            {/* Search - Central */}
            <div className="hidden md:flex flex-1 max-w-2xl relative group mx-8" ref={searchRef}>
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#f3f4f6] border-none rounded-full py-2.5 pl-6 pr-12 text-sm font-medium transition-all outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-gray-200"
              />
              <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Search size={18} className="text-gray-500" />
              </button>

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
                  {(() => {
                    const query = searchQuery.toLowerCase().trim();
                    const filtered = allProducts.filter(p => 
                      p.name.toLowerCase().includes(query) || 
                      p.category.toLowerCase().includes(query)
                    ).slice(0, 5); // Show max 5 results

                    if (filtered.length === 0) {
                      return (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          No products found matching "{searchQuery}"
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col">
                        {filtered.map(product => (
                          <Link
                            key={product._id || product.product_id}
                            href={`/product/${product.slug || product._id}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.image_url || product.cover_image || (product.product_images?.[0])} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-gray-900 truncate">{product.name}</span>
                              <span className="text-xs text-gray-500">{product.category}</span>
                            </div>
                            <div className="ml-auto text-sm font-bold text-gray-900 whitespace-nowrap">
                              ৳{product.unit_price}
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-5">

              <Link
                href="/contact"
                className="hidden md:flex bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors items-center gap-2"
              >
                <Phone size={16} />
                Contact Us
              </Link>


              {/* Cart Toggle Button */}
              {/* <button
                onClick={openCart}
                id="cart-trigger"
                className="text-gray-800 hover:text-black transition-all relative flex items-center group"
              >
                <ShoppingCart
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />

                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button> */}

              {/* User Icon (Track Order) */}
              {/* <Link
                href="/track-order"
                className="text-gray-800 hover:text-black transition-all relative flex items-center group"
                title="Track Order"
              >
                <User
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link> */}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-gray-800 hover:text-black transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-[60] transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-0 right-0 h-full w-[80%] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
              <img src="/logoFinal.jpg" alt={settings?.storeName || "Mohona by CGFWA"} className="h-12 w-auto object-contain py-1" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1 p-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="font-bold text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-black transition-colors"
            >
              Home
            </Link>

            {/* Shop Accordion */}
            <div>
              <button
                onClick={() => setMobileExpandedCat(mobileExpandedCat === "shop" ? null : "shop")}
                className="w-full font-bold text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-black transition-colors flex items-center justify-between"
              >
                <span>Shop</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-300 ${mobileExpandedCat === "shop" ? "rotate-180" : ""}`}
                />
              </button>

              {mobileExpandedCat === "shop" && (
                <div className="ml-2 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                  {shopLocations.map((loc) => (
                    <div key={loc.id}>
                      <button 
                        onClick={() => loc.hasCategories && setActiveShopCategory(activeShopCategory === loc.id ? null : loc.id)}
                        className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors ${!loc.hasCategories ? 'cursor-default' : ''}`}
                      >
                        <span className="text-left leading-tight">{loc.name}</span>
                        {loc.hasCategories && (
                          <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${activeShopCategory === loc.id ? "rotate-180" : ""}`} />
                        )}
                      </button>
                      
                      {loc.hasCategories && activeShopCategory === loc.id && (
                        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3 pb-2">
                          {linksData.shopDropdown
                            .filter(item => !availableCategories || item.label === 'All Categories' || availableCategories.includes(item.label))
                            .map((item, idx) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between py-2 px-3 rounded-lg text-[13px] font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              {item.label}
                              {item.badge && (
                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{item.badge}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="font-bold text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-black transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="font-bold text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-50 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full py-3 bg-gray-50 text-gray-800 text-center rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                {settings.phone}
              </a>
            )}
            {/* <Link
              href="/track-order"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-3 bg-black text-white text-center rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              Track My Order
            </Link> */}


          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

      {/* Dropdown Animations */}
      <style jsx global>{`
        @keyframes categoryDropdownIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes subcategoryFadeIn {
          from {
            opacity: 0;
            transform: translateX(6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes marquee-rtl {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 20s linear infinite;
        }
      `}</style>
    </>
  );
}
