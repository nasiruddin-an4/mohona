'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function RecommendationCarousel({ products = [], loading = false }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Use a different slice of products for recommendations, maybe the last 15
  const displayProducts = products.length > 15 ? products.slice(-15) : products;

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const cardWidth = clientWidth / 5;
      let scrollTo;
      
      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollTo = 0;
        } else {
          scrollTo = scrollLeft + cardWidth;
        }
      } else {
        if (scrollLeft <= 0) {
          scrollTo = scrollWidth - clientWidth;
        } else {
          scrollTo = scrollLeft - cardWidth;
        }
      }
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isPaused || displayProducts.length === 0) return;
    const interval = setInterval(() => scroll('right'), 5000);
    return () => clearInterval(interval);
  }, [scroll, isPaused, displayProducts.length]);

  return (
    <section 
      className="py-12 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">You Might Also Like</h2>
        <Link href="/shop" className="text-sm font-bold text-gray-500 hover:text-[#f18e6c] transition-colors">
          See All Products
        </Link>
      </div>

      {displayProducts.length > 5 && (
        <>
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-[55%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#f18e6c] transition-all opacity-0 group-hover:opacity-100 -translate-x-5"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-[55%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#f18e6c] transition-all opacity-0 group-hover:opacity-100 translate-x-5"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#f18e6c]" size={40} />
        </div>
      ) : displayProducts.length > 0 ? (
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 transition-all duration-500 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {displayProducts.map((product) => (
            <div 
              key={product._id || product.product_id}
              className="min-w-[calc(100%/2)] sm:min-w-[calc((100%-16px)/3)] lg:min-w-[calc((100%-64px)/5)] bg-white border border-gray-100 rounded-2xl flex flex-col snap-start hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <Link href={`/product/${product.slug || product._id || product.product_id}`} className="aspect-square flex items-center justify-center overflow-hidden block bg-[#e5e7eb]">
                 <img src={(product.product_images?.length > 0 ? product.product_images[0] : null) || product.cover_image || product.image_url || "/images/placeholder.jpg"} className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500 mix-blend-multiply" alt={product.name} />
              </Link>

              <div className="flex-1 space-y-2 p-4">
                <div className="text-[10px] text-gray-400 font-medium mb-1">Code: LSHR{String(product.product_id || product.id || (product._id ? product._id.toString().slice(-4) : '0000')).padStart(4, '0')}</div>
                <Link href={`/product/${product.slug || product._id || product.product_id}`}>
                  <h3 className="text-xs font-bold text-gray-600 line-clamp-2 min-h-[32px] leading-snug hover:text-[#f18e6c] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 flex-wrap">
                   <span className="text-sm font-bold text-gray-900 italic">৳{product.selling_price || product.unit_price}</span>
                   {product.discount_pct > 0 && (
                     <>
                       <span className="text-[10px] text-gray-400 line-through font-bold">
                          ৳{product.unit_price}
                       </span>
                       <span className="text-[10px] font-bold text-white bg-[#f18e6c] px-1 rounded">
                          {product.discount_pct}% OFF
                       </span>
                     </>
                   )}
                </div>
              </div>

              <button 
                onClick={() => addItem(product, 1)}
                className="mt-4 w-full py-2 border border-black text-black text-[10px] font-bold rounded-lg hover:bg-black hover:text-white transition-all uppercase tracking-widest"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">No recommendations available.</div>
      )}
    </section>
  );
}

