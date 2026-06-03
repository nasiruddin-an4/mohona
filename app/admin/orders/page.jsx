'use client';

import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    // In a real app, you'd have a PUT endpoint to update status
    alert(`Order ${orderId} status updated to ${newStatus} (Mocked)`);
  };

  return (
    <div className="container mx-auto bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm min-h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage customer orders</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">${order.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-md border-none outline-none cursor-pointer
                          ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                            'bg-yellow-50 text-yellow-600'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
