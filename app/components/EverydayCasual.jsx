import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useSidebarStore } from '../../store/useSidebarStore';

export default function EverydayCasual() {
  const [activeTab, setActiveTab] = useState('DRESSES');
  const { addItem } = useCartStore();
  const { openCart } = useSidebarStore();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
  };

  const tabs = ['DRESSES', 'TOPS', 'WINTER WEAR'];

  const products = [
    // DRESSES
    { id: 1, tab: 'DRESSES', name: "Couture Edge", category: "Purple Mini Dress", price: 4.34, originalPrice: 5.00, discount: "5% Off", rating: 4.5, image: "/productImg/10001.jpg", colors: ["#fef3c7", "#d4d4d8", "#e5e5e5"] },
    { id: 2, tab: 'DRESSES', name: "Glamour Gaze", category: "Chic Mini Dress", price: 3.40, originalPrice: null, discount: null, rating: 4.5, image: "/productImg/10002.jpg", colors: ["#fef3c7", "#d4b896", "#e5e5e5"] },
    { id: 3, tab: 'DRESSES', name: "Urban Chic", category: "Stripped Bodycon Dress", price: 2.10, originalPrice: null, discount: null, rating: 4.5, image: "/productImg/10003.jpg", colors: ["#fef3c7", "#d4b896", "#e5e5e5"] },
    { id: 4, tab: 'DRESSES', name: "Velvet Night", category: "Evening Gown", price: 6.50, originalPrice: 8.00, discount: "15% Off", rating: 4.9, image: "/productImg/10004.jpg", colors: ["#000000", "#d4af37"] },
    
    // TOPS
    { id: 5, tab: 'TOPS', name: "Glamour Gaze", category: "Tie and Dye Chiffon Top", price: 2.79, originalPrice: 3.00, discount: "7% Off", rating: 4.5, image: "/productImg/10005.jpg", colors: ["#fef3c7", "#d4b896", "#e5e5e5"] },
    { id: 6, tab: 'TOPS', name: "Silk Essence", category: "Sleeveless Top", price: 5.10, originalPrice: null, discount: null, rating: 5.0, image: "/productImg/10006.jpg", colors: ["#000000", "#ffffff"] },
    { id: 7, tab: 'TOPS', name: "Casual Breeze", category: "Cotton T-Shirt", price: 1.50, originalPrice: 2.00, discount: "25% Off", rating: 4.2, image: "/productImg/10007.jpg", colors: ["#ff0000", "#0000ff"] },
    { id: 8, tab: 'TOPS', name: "Chic Aura", category: "Crop Top", price: 2.90, originalPrice: null, discount: null, rating: 4.7, image: "/productImg/10008.jpg", colors: ["#ffb6c1", "#e5e5e5"] },

    // WINTER WEAR
    { id: 9, tab: 'WINTER WEAR', name: "Cozy Comfort", category: "Knitted Sweater", price: 12.50, originalPrice: 15.00, discount: "16% Off", rating: 4.8, image: "/productImg/10009.jpg", colors: ["#cbd5e1", "#475569"] },
    { id: 10, tab: 'WINTER WEAR', name: "Frost Shield", category: "Puffer Jacket", price: 25.00, originalPrice: 30.00, discount: "15% Off", rating: 4.9, image: "/productImg/10010.jpg", colors: ["#000000", "#1e3a8a"] },
    { id: 11, tab: 'WINTER WEAR', name: "Snow Drift", category: "Wool Coat", price: 45.00, originalPrice: 50.00, discount: "10% Off", rating: 5.0, image: "/productImg/10011.jpg", colors: ["#9ca3af", "#d1d5db"] },
    { id: 12, tab: 'WINTER WEAR', name: "Alpine Warmth", category: "Thermal Inner", price: 5.50, originalPrice: null, discount: null, rating: 4.6, image: "/productImg/10012.jpg", colors: ["#ffffff", "#000000"] }
  ];

  const filteredProducts = products.filter(product => product.tab === activeTab);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h4 className="text-[#f18e6c] font-medium text-sm tracking-wide mb-2">Exclusive Products</h4>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">Everyday Casual</h2>
        <div className="w-16 h-1 bg-[#f18e6c] mt-3"></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 mb-10">
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-semibold text-sm tracking-wider uppercase transition-colors ${
              activeTab === tab ? 'text-[#f18e6c]' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div 
            key={product.id} 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            style={{ originY: 0 }}
            className="group border border-gray-100 p-3 flex flex-col bg-white hover:shadow-lg transition-shadow duration-300"
          >
            
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden rounded-sm">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Top Right Heart */}
              <button className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:text-[#f18e6c] transition-colors">
                <Heart size={14} className="text-[#f18e6c]" />
              </button>

              {/* Bottom Left Rating */}
              <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded shadow-sm flex items-center gap-1">
                <Star size={12} className="text-orange-400 fill-orange-400" />
                <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              </div>

              {/* Hover Actions (Right Side) */}
              <div className="absolute top-14 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-[#f18e6c] hover:text-white transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart size={14} />
                </button>
                <button className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-[#f18e6c] hover:text-white transition-colors" title="Quick View">
                  <Eye size={14} />
                </button>
                <button className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-[#f18e6c] hover:text-white transition-colors" title="Compare">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1 pb-2 px-1">
              {/* Title & Colors */}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{product.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  {product.colors.map((color, idx) => (
                    <div key={idx} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color }}></div>
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">+2</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-2 truncate">{product.category}</p>
              
              {/* Pricing */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-gray-900 text-[15px]">$ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">$ {product.originalPrice.toFixed(2)}</span>
                )}
                {product.discount && (
                  <span className="text-xs font-bold text-[#f18e6c]">{product.discount}</span>
                )}
              </div>

              <div className="mt-auto">
                <div className="w-full h-px bg-gray-100 mb-3"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-[#f18e6c]">
                    <span className="text-[10px] font-bold">%</span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium truncate">Limited Time Offer: 5% off</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
