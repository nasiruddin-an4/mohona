'use client';

import React, { useState, useEffect, use } from 'react';
import ProductCard from '../../../components/ProductCard';
import { Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage({ params }) {
  // Use React.use to unwrap params Promise in Next.js 15+
  const resolvedParams = use(params);
  const rawCategory = resolvedParams.category;
  
  // Format the category string from URL (e.g. "home-decor" -> "Home Decor")
  const categoryName = rawCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceFilter, setPriceFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'under_50', label: 'Under ৳50' },
    { value: '50_100', label: '৳50 - ৳100' },
    { value: 'over_100', label: 'Over ৳100' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.filter(p => (p.status || 'Publish') === 'Publish'));
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allColors = Array.from(new Set(products.flatMap(p => p.colors || []))).sort();

  // Filter products based on URL category and search
  let filteredProducts = products.filter((product) => {
    const matchesCategory = product.category.toLowerCase() === categoryName.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    let matchesPrice = true;
    const price = Number(product.unit_price) || 0;
    if (priceFilter === 'under_50') matchesPrice = price < 50;
    else if (priceFilter === '50_100') matchesPrice = price >= 50 && price <= 100;
    else if (priceFilter === 'over_100') matchesPrice = price > 100;
    
    let matchesColor = true;
    if (colorFilter !== 'all') {
       matchesColor = product.colors && product.colors.includes(colorFilter);
    }
    
    return matchesCategory && matchesSearch && matchesPrice && matchesColor;
  });

  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => (Number(a.unit_price) || 0) - (Number(b.unit_price) || 0));
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => (Number(b.unit_price) || 0) - (Number(a.unit_price) || 0));
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Top Navigation & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 mb-8 border-b border-gray-100 gap-6">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{categoryName}</span>
        </div>

        {/* Minimalist Dropdowns */}
        <div className="flex items-center gap-8 text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] relative">
          
          {/* Color Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')}
              className={`flex items-center gap-1.5 transition-opacity ${openDropdown === 'color' ? 'opacity-100 text-[#f18e6c]' : 'hover:opacity-70'}`}
            >
              COLOR {colorFilter !== 'all' && `(${colorFilter})`} <ChevronDown size={14} className={`stroke-[1.5] transition-transform ${openDropdown === 'color' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-2xl py-2 z-20 min-w-[140px]">
                <button onClick={() => { setColorFilter('all'); setOpenDropdown(null); }} className={`block w-full text-left px-5 py-2.5 hover:bg-gray-50 ${colorFilter === 'all' ? 'text-[#f18e6c]' : ''}`}>ALL COLORS</button>
                {allColors.map(c => (
                  <button key={c} onClick={() => { setColorFilter(c); setOpenDropdown(null); }} className={`block w-full text-left px-5 py-2.5 hover:bg-gray-50 ${colorFilter === c ? 'text-[#f18e6c]' : ''}`}>{c.toUpperCase()}</button>
                ))}
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
              className={`flex items-center gap-1.5 transition-opacity ${openDropdown === 'price' ? 'opacity-100 text-[#f18e6c]' : 'hover:opacity-70'}`}
            >
              PRICE {priceFilter !== 'all' && '*'} <ChevronDown size={14} className={`stroke-[1.5] transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-2xl py-2 z-20 min-w-[180px]">
                {priceOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setPriceFilter(opt.value); setOpenDropdown(null); }} className={`block w-full text-left px-5 py-2.5 hover:bg-gray-50 ${priceFilter === opt.value ? 'text-[#f18e6c]' : ''}`}>{opt.label.toUpperCase()}</button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
              className={`flex items-center gap-1.5 transition-opacity ${openDropdown === 'sort' ? 'opacity-100 text-[#f18e6c]' : 'hover:opacity-70'}`}
            >
              SORT BY {sortBy !== 'default' && '*'} <ChevronDown size={14} className={`stroke-[1.5] transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'sort' && (
              <div className="absolute top-full right-0 mt-4 bg-white border border-gray-100 shadow-2xl py-2 z-20 min-w-[200px]">
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }} className={`block w-full text-left px-5 py-2.5 hover:bg-gray-50 ${sortBy === opt.value ? 'text-[#f18e6c]' : ''}`}>{opt.label.toUpperCase()}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f18e6c]"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center flex flex-col items-center justify-center border border-gray-100 bg-[#f4f4f4] rounded-sm">
          <Search size={32} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-sm text-gray-500 mb-6">We couldn't find any products in the {categoryName} category.</p>
          <button
            onClick={() => { setSearchQuery(''); setColorFilter('all'); setPriceFilter('all'); setSortBy('default'); }}
            className="text-[11px] font-bold text-white bg-black uppercase tracking-widest px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
