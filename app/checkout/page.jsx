'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function CartCheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, updateQuantity, removeItem, shippingCost, setShippingCost } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  // Calculate total items (sum of quantities)
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row overflow-hidden">

        {/* Left Section: Shopping Cart */}
        <div className="w-full md:w-[85%] p-10 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-[28px] font-bold text-gray-800">Shopping Cart</h1>
            <span className="text-[18px] font-bold text-gray-800">{totalItemsCount} Items</span>
          </div>

          {/* Table Headers */}
          <div className="hidden sm:grid grid-cols-12 gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
            <div className="col-span-5">Product Details</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
            {items.length === 0 ? (
              <div className="text-gray-500 flex items-center justify-center h-full">
                Your cart is empty.
              </div>
            ) : (
              items.map((item) => {
                const itemTotal = item.product.unit_price * item.quantity;
                return (
                  <div key={`${item.product.product_id}-${item.selected_unit}`} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Product Details */}
                    <div className="col-span-1 sm:col-span-5 flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 flex-shrink-0 flex items-center justify-center p-2">
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-bold text-[14px] text-gray-800 mb-1">{item.product.name}</span>
                        <span className="text-[12px] text-red-400 font-medium mb-2">{item.product.category || item.selected_unit}</span>
                        <button
                          onClick={() => removeItem(item.product.product_id, item.selected_unit)}
                          className="text-[11px] text-gray-400 hover:text-red-500 text-left transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-1 sm:col-span-3 flex justify-center items-center gap-3">
                      <button onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)} className="text-gray-800 hover:text-gray-500 font-bold text-lg leading-none">
                        -
                      </button>
                      <div className="w-10 h-8 border border-gray-200 flex items-center justify-center text-[13px] text-gray-800">
                        {item.quantity}
                      </div>
                      <button onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)} className="text-gray-800 hover:text-gray-500 font-bold text-lg leading-none">
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 sm:col-span-2 text-center text-[13px] font-bold text-gray-800">
                      ৳{item.product.unit_price.toFixed(2)}
                    </div>

                    {/* Total */}
                    <div className="col-span-1 sm:col-span-2 text-right text-[13px] font-bold text-gray-800">
                      ৳{itemTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Section: Order Summary */}
        <div className="w-full md:w-[35%] bg-[#F5F6FA] p-10 flex flex-col">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h2 className="text-[22px] font-bold text-gray-800">Order Summary</h2>
          </div>

          <div className="flex justify-between items-center mb-8 text-[14px] font-bold text-gray-800">
            <span className="uppercase tracking-wider">Items {totalItemsCount}</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>

          <div className="mb-8">
            <label className="block text-[12px] font-bold text-gray-800 uppercase tracking-wider mb-4">Shipping</label>
            <div className="relative">
              <select
                className="w-full bg-white border-none text-[13px] text-gray-600 p-3 appearance-none outline-none shadow-sm cursor-pointer"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value))}
              >
                <option value="5">Standard Delivery - ৳ 5.00</option>
                <option value="15">Express Delivery - ৳ 15.00</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[12px] font-bold text-gray-800 uppercase tracking-wider mb-4">Promo Code</label>
            <input
              type="text"
              placeholder="Enter your code"
              className="w-full bg-white border-none p-3 text-[13px] outline-none shadow-sm mb-4 placeholder:text-gray-400 text-gray-800"
            />
            <button className="bg-[#FA6B6B] hover:bg-[#e65a5a] text-white text-[12px] font-bold tracking-wider uppercase px-6 py-2.5 transition-colors shadow-sm">
              Apply
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[13px] font-bold text-gray-800 uppercase tracking-wider">Total Cost</span>
              <span className="text-[18px] font-bold text-gray-800">৳{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push('/payment')}
              disabled={items.length === 0}
              className="w-full bg-[#6B5CE7] hover:bg-[#5a4cd1] disabled:bg-gray-400 text-white font-bold text-[14px] uppercase tracking-wider py-4 transition-colors shadow-lg shadow-indigo-200"
            >
              Checkout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
