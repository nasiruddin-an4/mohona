'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Calendar, MapPin, Truck, ChevronRight, PackageX } from 'lucide-react';
import { formatDeliveryDate } from '@/lib/utils'; // if exists, else just standard date

export default function TrackOrderPage() {
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactNumber.trim()) {
      setError('Please enter your contact number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact_number: contactNumber.trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
        setOrders(null);
      }
    } catch (err) {
      setError('An error occurred while tracking your order. Please try again.');
      setOrders(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track Your Orders</h1>
          <p className="text-gray-500">Enter your billing contact number to view your order history and current status.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 01712345678"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Find Orders'
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-600 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>{error}</p>}
        </div>

        {/* Results Section */}
        {orders !== null && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package size={20} className="text-gray-400" />
              {orders.length === 0 ? 'No orders found' : `Found ${orders.length} order${orders.length === 1 ? '' : 's'}`}
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    {/* Order Header */}
                    <div className="bg-gray-50 border-b border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-bold text-gray-900">{order.order_number}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1.5 font-medium text-gray-700">৳{order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Items */}
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                            </div>
                            <div className="text-sm font-bold text-gray-900 text-right">
                              ৳{(item.quantity * item.price).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Shipping Info */}
                      <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-8 border border-gray-100 text-sm">
                        <div className="flex gap-3 flex-1">
                          <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-0.5">Shipping Address</p>
                            <p className="text-gray-600 leading-relaxed">{order.customer_name}<br/>{order.address}</p>
                          </div>
                        </div>
                        {(order.tracking_number || order.courier_name) && (
                          <div className="flex gap-3 flex-1">
                            <Truck size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900 mb-0.5">Courier Info</p>
                              {order.courier_name && <p className="text-gray-600">Courier: <span className="font-medium text-gray-900">{order.courier_name}</span></p>}
                              {order.tracking_number && <p className="text-gray-600">Tracking: <span className="font-mono font-medium text-gray-900">{order.tracking_number}</span></p>}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 sm:p-20 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageX size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">We couldn&apos;t find any active or past orders linked to <span className="font-medium text-gray-700">{contactNumber}</span>. Please check the number and try again.</p>
                <button 
                  onClick={() => { setContactNumber(''); setOrders(null); }} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Try another number
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
