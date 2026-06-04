'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, HandCoins, CreditCard, User, Mail, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function PaymentPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart, shippingCost } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bkashTrxId: ''
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && !orderSuccess) {
      router.push('/shop');
    }
  }, [items, router, orderSuccess]);

  const subtotal = getCartTotal();
  const shippingFee = shippingCost;
  const total = subtotal + shippingFee;
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderPayload = {
        customer_name: formData.fullName,
        email: formData.email,
        contact_number: formData.phone,
        address: formData.address,
        payment_method: paymentMethod === 'cod' ? 'Cash On Delivery' : paymentMethod === 'bkash' ? 'Bkash' : 'Other',
        transaction_id: paymentMethod === 'bkash' ? formData.bkashTrxId : null,
        items: items.map(item => ({
          product_id: item.product._id || item.product.product_id || item.product.id,
          name: item.product.name,
          price: item.product.unit_price || item.product.price || 0,
          quantity: item.quantity,
          image: item.product.image_url || (item.product.images ? item.product.images[0] : null)
        })),
        subtotal: subtotal,
        shipping_cost: shippingFee,
        total_amount: total
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      
      if (data.success) {
        clearCart();
        setOrderSuccess(data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: data.error || 'Failed to place order',
          confirmButtonColor: '#6B5CE7'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while placing the order.',
        confirmButtonColor: '#6B5CE7'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 max-w-lg w-full animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Order <span className="font-bold text-gray-900">#{orderSuccess.order_number || orderSuccess._id?.slice(-6).toUpperCase()}</span> placed via {orderSuccess.payment_method}.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 text-left space-y-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Truck size={14} />
              Delivery Info
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Address</span>
              <span className="text-gray-900 font-bold text-right max-w-[60%]">{formData.address}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated</span>
              <span className="text-gray-900 font-bold">3-5 Business Days</span>
            </div>
          </div>

          <Link href="/" className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-10 rounded-xl transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => router.push('/checkout')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors mb-3 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Cart</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-400 mt-1">Complete your order by filling in your details below</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-0 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">1</div>
          <span className="text-sm font-bold text-gray-900 hidden sm:block">Delivery</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-3" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">2</div>
          <span className="text-sm font-bold text-gray-900 hidden sm:block">Order Review</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-3" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#6B5CE7] text-white text-xs font-bold flex items-center justify-center">3</div>
          <span className="text-sm font-bold text-[#6B5CE7] hidden sm:block">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-7">
          <form id="payment-form" onSubmit={handlePlaceOrder} className="space-y-8">

            {/* Delivery Details Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Delivery Details</h2>
                  <p className="text-xs text-gray-400">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text" required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#6B5CE7]/20 focus:border-[#6B5CE7] transition-all outline-none placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#6B5CE7]/20 focus:border-[#6B5CE7] transition-all outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Contact Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="tel" required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXXXXXXXX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#6B5CE7]/20 focus:border-[#6B5CE7] transition-all outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-4 text-gray-300" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="3"
                      placeholder="House, Road, Area, City, District"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#6B5CE7]/20 focus:border-[#6B5CE7] transition-all outline-none resize-none placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                  <Package size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                  <p className="text-xs text-gray-400">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} in your cart</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.product._id || item.product.product_id || item.product.id}-${item.product.selected_unit || 'default'}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg p-1.5 shrink-0 border border-gray-100">
                      <img src={item.product.image_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">৳ {(item.product.unit_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800 font-semibold">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-800 font-semibold">৳ {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[#6B5CE7]">৳ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column — Payment */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#6B5CE7] text-white flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                <p className="text-xs text-gray-400">Select how you want to pay</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-amber-50 border-2 border-amber-400 shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${paymentMethod === 'cod' ? 'border-amber-500' : 'border-gray-300'}`}>
                  {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm text-gray-900 block">Cash on Delivery</span>
                  <span className="text-xs text-gray-400">Pay when you receive</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-amber-500 shadow-sm">
                  <HandCoins size={18} />
                </div>
              </div>

              {/* bKash */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'bg-pink-50 border-2 border-[#E2136E] shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${paymentMethod === 'bkash' ? 'border-[#E2136E]' : 'border-gray-300'}`}>
                  {paymentMethod === 'bkash' && <div className="w-2.5 h-2.5 rounded-full bg-[#E2136E]" />}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-sm text-gray-900 block">bKash</span>
                  <span className="text-xs text-gray-400">Mobile payment</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <span className="text-[#E2136E] font-extrabold text-xs">bKash</span>
                </div>
              </div>

              {/* bKash Instructions & Inputs */}
              {paymentMethod === 'bkash' && (
                <div className="bg-pink-50/50 p-5 rounded-xl border border-pink-100 mt-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[13px] text-gray-700 font-medium mb-4 leading-relaxed">
                    Please send the total amount to our bKash Merchant Number: <span className="font-bold text-[#E2136E] text-[15px]">017XXXXXXXX</span>.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Transaction ID (TrxID) *</label>
                      <input
                        type="text"
                        value={formData.bkashTrxId}
                        onChange={(e) => setFormData({ ...formData, bkashTrxId: e.target.value })}
                        required={paymentMethod === 'bkash'}
                        placeholder="e.g., 9F8G7H6J"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#E2136E]/20 focus:border-[#E2136E] transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Screenshot / Receipt *</label>
                      <input
                        type="file"
                        accept="image/*"
                        required={paymentMethod === 'bkash'}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#E2136E]/20 focus:border-[#E2136E] transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-[#E2136E] hover:file:bg-pink-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Security Note */}
            <div className="p-3.5 bg-gray-50 rounded-xl flex gap-3 mb-8">
              <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                All transactions are encrypted and secure. Your details are never shared.
              </p>
            </div>

            {/* Total & Button */}
            <div className="bg-gray-900 rounded-2xl p-5 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Total Amount</p>
                  <p className="text-2xl font-bold text-white">৳ {total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-500">incl. ৳{shippingFee.toFixed(2)} shipping</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              form="payment-form"
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${isProcessing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#6B5CE7] hover:bg-[#5a4cd1] text-white shadow-xl shadow-[#6B5CE7]/25 transform hover:-translate-y-0.5 active:scale-[0.98]'
                }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Place Order — ৳ {total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
