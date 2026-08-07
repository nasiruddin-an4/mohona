import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useSidebarStore } from '../../store/useSidebarStore';

export default function EverydayCasual({ products = [], loading = false }) {
  const [activeTab, setActiveTab] = useState('Women');
  const { addItem } = useCartStore();
  const { openCart } = useSidebarStore();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
  };

  const availableCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const tabs = availableCategories.length > 0 ? availableCategories.slice(0, 4) : ['Women', 'Men', 'Kids', 'Teen'];

  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [products]);

  const filteredProducts = products.filter(product => product.category === activeTab).slice(0, 8);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h4 className="text-[#f18e6c] font-medium text-sm tracking-wide mb-2">Exclusive Products</h4>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">Everyday Casual</h2>
        <div className="w-16 h-1 bg-[#f18e6c] mt-3"></div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
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
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#f18e6c]" size={40} />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product._id || product.id} 
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
              style={{ originY: 0 }}
              className="group border border-gray-100 flex flex-col bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              
              {/* Image Container */}
              <Link href={`/product/${product.slug || product._id}`} className="relative aspect-[3/4] bg-gray-50 overflow-hidden block">
                <img 
                  src={(product.product_images?.length > 0 ? product.product_images[0] : null) || product.cover_image || product.image_url || "/images/placeholder.jpg"} 
                  alt={product.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                />
                
                {/* Top Right Heart */}
                <button className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:text-[#f18e6c] transition-colors">
                  <Heart size={14} className="text-[#f18e6c]" />
                </button>

                {/* Bottom Left Rating */}
                <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  <Star size={12} className="text-orange-400 fill-orange-400" />
                  <span className="text-xs font-bold text-gray-800">5.0</span>
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
              </Link>

              {/* Product Info */}
              <div className="flex flex-col flex-1 p-3">
                {/* Title & Colors */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-[10px] text-gray-400 font-medium mb-0.5">Code: LSHR{String(product.product_id || product.id || (product._id ? product._id.toString().slice(-4) : '0000')).padStart(4, '0')}</div>
                    <Link href={`/product/${product.slug || product._id}`}>
                      <h3 className="font-bold text-gray-900 text-sm truncate pr-2 hover:text-[#f18e6c] transition-colors">{product.name}</h3>
                    </Link>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-2 truncate">{product.category}</p>
                
                {/* Pricing */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 text-[15px]">৳{product.selling_price || product.unit_price}</span>
                  {product.discount_pct > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">৳{product.unit_price}</span>
                      <span className="text-xs font-bold text-[#f18e6c]">{product.discount_pct}% OFF</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No products found for this category.</div>
      )}
    </section>
  );
}
