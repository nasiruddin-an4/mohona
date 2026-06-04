"use client";

import React, { useState, useMemo } from "react";
import { useCartStore } from "../store/useCartStore";
import { useSidebarStore } from "../store/useSidebarStore";
import {
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import { calculateDeliveryDate, formatDeliveryDate } from "../lib/utils";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useSidebarStore((state) => state.openCart);
  const [selectedUnit, setSelectedUnit] = useState(
    product.available_units?.[0] || product.unit,
  );

  const isOutOfStock = product.stock_status === "Out of stock";
  const isLimited = product.stock_status === "Limited";

  // Helper to extract numeric value from units like "5 kg", "500g", "1 L"
  const getUnitMultiplier = (unitStr) => {
    if (!unitStr) return 1;
    const match = unitStr.match(/(\d+(\.\d+)?)\s*([a-zA-Z]+)?/);
    if (!match) return 1;

    const value = parseFloat(match[1]);
    const unit = match[3]?.toLowerCase();

    // Handle grams to kg conversion
    if (unit === "g" && product.unit?.toLowerCase() === "kg")
      return value / 1000;
    // Handle mg to g conversion
    if (unit === "mg" && product.unit?.toLowerCase() === "g")
      return value / 1000;
    // Handle ml to L conversion
    if (unit === "ml" && product.unit?.toLowerCase() === "l")
      return value / 1000;

    return value;
  };

  const safePrice = Number(product.unit_price) || 0;

  const currentPrice = useMemo(() => {
    const multiplier = getUnitMultiplier(selectedUnit);
    return safePrice * multiplier;
  }, [selectedUnit, safePrice]);

  // Calculate price range for display
  const priceRange = useMemo(() => {
    if (!product.available_units || product.available_units.length <= 1) {
      return `${safePrice.toLocaleString()}৳`;
    }
    const prices = product.available_units.map(
      (unit) => safePrice * getUnitMultiplier(unit),
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `${minPrice.toLocaleString()}৳`;
    }
    return `${minPrice.toLocaleString()}৳ — ${maxPrice.toLocaleString()}৳`;
  }, [product.available_units, safePrice]);

  const [hasSelected, setHasSelected] = useState(false);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setHasSelected(true);
  };

  const handleAddToCart = () => {
    // Create a modified product object with the selected unit's price
    const modifiedProduct = {
      ...product,
      unit_price: currentPrice,
      selected_unit: selectedUnit,
    };
    addItem(modifiedProduct, 1);
    openCart();
  };

  return (
    <div className="flex flex-col group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-3 h-full">
      {/* Image Container */}
      <Link href={`/product/${product.slug || product._id}`} className="relative aspect-square overflow-hidden bg-[#e5e7eb] rounded-xl mb-3 block">
        {(() => {
          const displayImage = (product.product_images?.length > 0 ? product.product_images[0] : null) || product.image_url || product.cover_image;
          return displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 mix-blend-multiply ${isOutOfStock ? "grayscale opacity-30" : ""}`}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${isOutOfStock ? "opacity-30" : ""}`}>
              No Image
            </div>
          );
        })()}

        {/* Discount Badge */}
        {product.discount_pct && !isOutOfStock ? (
          <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            {product.discount_pct}% OFF
          </div>
        ) : null}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm z-10 uppercase tracking-wide">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="text-[10px] text-gray-400 font-medium mb-1">Code: LSHR{String(product.product_id || product.id || (product._id ? product._id.toString().slice(-4) : '0000')).padStart(4, '0')}</div>
        <Link href={`/product/${product.slug || product._id}`}>
          <h3 className="text-[15px] font-medium text-gray-800 leading-snug mb-2 transition-colors line-clamp-1 hover:text-black">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center flex-wrap gap-2 mb-4 mt-auto">
          <span className="text-[20px] font-black text-gray-900 leading-none">{priceRange}</span>
          {/* Mock Original Price if there's a discount */}
          {product.discount_pct > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ৳{Math.round(safePrice / (1 - product.discount_pct / 100))}
            </span>
          )}
          
          <div className="flex items-center gap-0.5 ml-auto mt-1 sm:mt-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="bg-[#fef08a] text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">5.0</span>
          </div>
        </div>

        <button 
          onClick={(e) => {
             e.preventDefault();
             handleAddToCart();
          }}
          className="w-full bg-[#111827] text-white flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
