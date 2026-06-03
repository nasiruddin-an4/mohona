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

  const currentPrice = useMemo(() => {
    const multiplier = getUnitMultiplier(selectedUnit);
    return product.unit_price * multiplier;
  }, [selectedUnit, product.unit_price]);

  // Calculate price range for display
  const priceRange = useMemo(() => {
    if (!product.available_units || product.available_units.length <= 1) {
      return `${product.unit_price.toLocaleString()}৳`;
    }
    const prices = product.available_units.map(
      (unit) => product.unit_price * getUnitMultiplier(unit),
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `${minPrice.toLocaleString()}৳ — ${maxPrice.toLocaleString()}৳`;
  }, [product.available_units, product.unit_price]);

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
    <div className="flex flex-col group relative">
      {/* Image Container */}
      <Link href={`/product/${product.product_id}`} className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f4] mb-2 block">
        <img
          src={product.image_url}
          alt={product.name}
          className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? "grayscale opacity-30" : ""}`}
        />

        {/* Discount Badge */}
        {product.discount_pct && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 uppercase">
            {product.discount_pct}% OFF
          </div>
        )}
      </Link>

      {/* Gallery Segment Lines */}
      <div className="flex gap-1 mb-2 px-1">
        <div className="h-[2px] w-full bg-gray-400"></div>
        <div className="h-[2px] w-full bg-gray-200"></div>
        <div className="h-[2px] w-full bg-gray-200"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-1">
        <Link href={`/product/${product.product_id}`}>
          <h3 className="text-[11px] text-gray-700 leading-tight mb-1.5 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="text-[13px] font-bold text-gray-900">
          {priceRange} <span className="font-normal text-gray-500 ml-0.5 text-[11px]">+ VAT</span>
        </div>
      </div>
    </div>
  );
}
