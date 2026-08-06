'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, CreditCard, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSidebarStore } from '@/store/useSidebarStore';

export default function GiftCardsPage() {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useSidebarStore((state) => state.openCart);

  const amounts = [500, 1000, 2000, 5000];
  const [selectedAmount, setSelectedAmount] = useState(amounts[1]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // Create a virtual product for the gift card
    const giftCardProduct = {
      _id: `gift-card-${selectedAmount}-${Date.now()}`,
      product_id: `GC-${selectedAmount}`,
      name: `Digital Gift Card - ৳${selectedAmount}`,
      slug: `digital-gift-card-${selectedAmount}`,
      category: 'Gift Cards',
      unit_price: selectedAmount,
      selling_price: selectedAmount,
      image_url: '/logoFinal.jpg', // Fallback to logo for gift card image
      stock_status: 'In stock',
      status: 'Publish',
      description: `Gift card for ${recipientName} (${recipientEmail}). Message: ${message}`
    };

    addItem(giftCardProduct, 1);
    openCart();
    
    // Reset form
    setRecipientEmail('');
    setRecipientName('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#f18e6c] selection:text-white">
      
      {/* Hero Section */}
      <div className="bg-gray-900 py-16 sm:py-24 border-b border-gray-800 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <Gift size={48} className="text-[#f18e6c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Give the Gift of <span className="text-[#f18e6c]">Choice</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Not sure what to get them? A Mohona Digital Gift Card lets them choose their favorite handcrafted piece, instantly delivered to their inbox.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-8 pb-24">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Visual Representation */}
          <div className="w-full md:w-5/12 bg-gray-50 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center items-center">
            
            {/* Gift Card Graphic */}
            <div className="relative w-full aspect-[1.58] bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-bold tracking-widest uppercase text-xs text-gray-300">Mohona</span>
                <Gift size={24} className="text-[#f18e6c]" />
              </div>

              <div className="relative z-10">
                <div className="text-sm text-gray-400 mb-1">Gift Card Value</div>
                <div className="text-4xl font-black">৳{selectedAmount.toLocaleString()}</div>
              </div>

              <div className="relative z-10 flex justify-between items-end mt-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Digital Delivery</div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="w-6 h-6 rounded-full bg-[#f18e6c]/80 -ml-3"></div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4 w-full">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={18} className="text-[#f18e6c]" /> Sent instantly via email
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 size={18} className="text-[#f18e6c]" /> Never expires
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CreditCard size={18} className="text-[#f18e6c]" /> No extra processing fees
              </div>
            </div>

          </div>

          {/* Right Side: Configuration Form */}
          <div className="w-full md:w-7/12 p-8 sm:p-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Customize Your Gift</h2>
            
            <form onSubmit={handleAddToCart} className="space-y-8">
              
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Select Amount (BDT)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        selectedAmount === amt 
                          ? 'border-black bg-black text-white shadow-md' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Delivery Details */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-900 mb-1">Delivery Details</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Recipient's Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Recipient's Email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Add a personal message (Optional)"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#f18e6c] text-white rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20"
              >
                <Send size={18} /> Add to Cart — ৳{selectedAmount.toLocaleString()}
              </button>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
