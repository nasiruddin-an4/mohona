'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Mail, Phone, CheckCircle2, Circle, Package, Download, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

export default function OrderDetailsPage() {
  const { order_number } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${order_number}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };
    if (order_number) fetchOrder();
  }, [order_number]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>
        <Link href="/admin/orders" className="text-[#0f8b80] hover:underline mt-4 inline-block">Return to Orders</Link>
      </div>
    );
  }

  // Derived values
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Dummy data for VAT and Discount as requested in screenshot
  const subTotal = order.subtotal || order.total_amount;
  const vat = subTotal * 0.15; // 15% dummy VAT instead of 40% to be realistic
  const discount = 0;
  const shipping = order.shipping_cost || 0;
  const finalTotal = order.total_amount;

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Details</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 text-sm font-bold border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="px-5 py-2 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0d7a70] flex items-center gap-2">
            <Edit size={16} /> Edit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Information</h2>
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900">{order.order_number || `#${order._id?.slice(-5).toUpperCase()}`}</h3>
          <div className="flex gap-2">
            <span className={`px-4 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${order.payment_status === 'Paid' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-amber-500 text-amber-600 bg-amber-50'}`}>
              {order.payment_status || 'PENDING'}
            </span>
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-[#dcfce7] text-emerald-700 uppercase tracking-wider">
              {order.status || 'PROCESSING'}
            </span>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#ccfbf1] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-teal-800/60 uppercase tracking-wider mb-2">Order Date</div>
            <div className="text-lg font-bold text-teal-950">
              {order.createdAt ? format(new Date(order.createdAt), 'dd MMM, yyyy') : 'Unknown'}
            </div>
          </div>
          <div className="bg-[#fce7f3] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-pink-800/60 uppercase tracking-wider mb-2">Total Items</div>
            <div className="text-lg font-bold text-pink-950">{totalItems} pcs</div>
          </div>
          <div className="bg-[#dcfce7] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-emerald-800/60 uppercase tracking-wider mb-2">Delivery Date</div>
            <div className="text-lg font-bold text-emerald-950">
              {order.createdAt ? format(new Date(new Date(order.createdAt).getTime() + 3*24*60*60*1000), 'dd MMM, yyyy') : 'Unknown'}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Items Table */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4 text-center">Items</th>
                    <th className="px-4 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <div className="text-[10px] text-gray-500">ID: #{item.product_id?.slice(-5).toUpperCase() || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500">Shop</td>
                      <td className="px-4 py-4 text-center font-medium text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">BDT {item.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="px-3 py-1 border border-red-200 text-red-500 text-[11px] font-bold rounded-full hover:bg-red-50 transition-colors uppercase tracking-wider">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customer Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
              <div className="border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.customer_name || 'Customer')}&background=0f8b80&color=fff&size=80`} alt="Avatar" className="w-20 h-20 rounded-2xl shadow-sm" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{order.customer_name}</h3>
                  <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400"/> {order.email}</div>
                    <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400"/> {order.contact_number}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> {order.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Tracking</h2>
              <div className="border border-gray-100 rounded-2xl p-6">
                <div className="relative pl-8 flex flex-col gap-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Order Placed</div>
                        <div className="text-xs text-gray-500 mt-1">Confirmed by System</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">
                        {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy, hh:mm a') : ''}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {order.status !== 'Pending' ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Processing & Packed</div>
                        <div className="text-xs text-gray-500 mt-1">Preparing for shipment</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {['Shipped', 'Delivered'].includes(order.status) ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Shipped</div>
                        <div className="text-xs text-gray-500 mt-1">Handed over to courier</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {order.status === 'Delivered' ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Delivered</div>
                        <div className="text-xs text-gray-500 mt-1">Received by customer</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-[#fef08a] rounded-2xl p-6 sticky top-6 shadow-sm border border-yellow-200/50">
              <h2 className="text-lg font-bold text-yellow-950 mb-6">Order Summary</h2>
              
              <div className="flex flex-col gap-4 text-sm font-medium text-yellow-900/80 border-b border-yellow-900/10 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span className="font-bold text-yellow-950">BDT {subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span className="font-bold text-yellow-950">BDT {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-bold text-yellow-950">-BDT {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipment</span>
                  <span className="font-bold text-yellow-950">BDT {shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold text-yellow-950">BDT 0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold text-yellow-950">Total</span>
                <span className="text-2xl font-black text-yellow-950">BDT {finalTotal?.toFixed(2)}</span>
              </div>

              <div className="bg-white/60 rounded-xl p-4 flex justify-between items-center">
                <span className="text-[13px] font-bold text-yellow-950">Paid via {order.payment_method || 'System'}</span>
                {order.payment_method === 'Bkash' ? (
                  <span className="font-black text-pink-600 text-[13px]">bKash</span>
                ) : (
                  <Package size={20} className="text-yellow-700" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
