'use client';

import React, { useEffect, useState } from 'react';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import PromotionalSales from './components/PromotionalSales';
import TopSaleList from './components/TopSaleList';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (ordersData.success) setOrders(ordersData.data);
      if (productsData.success) setProducts(productsData.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // 3 seconds real-time polling
    return () => clearInterval(interval);
  }, []);

  // Compute Real Metrics
  const totalSales = orders
    .filter(o => o.payment_status?.toLowerCase() === 'paid')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.email || o.customer_name)).size;

  // Calculate real delays (processing orders older than 3 days)
  const shippingDelays = orders.filter(o => {
    if (!o.createdAt || o.status === 'Delivered' || o.status === 'Cancelled' || o.status === 'Shipped') return false;
    const diffDays = (new Date() - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
    return diffDays > 3;
  }).length;

  const refundRequests = orders.filter(o => o.status?.toLowerCase() === 'returned' || o.status?.toLowerCase() === 'refunded').length;
  const stockProducts = products.length;
  const abandonedCarts = orders.filter(o => o.status?.toLowerCase() === 'cancelled' || o.payment_status?.toLowerCase() === 'failed').length;
  const paymentFailures = orders.filter(o => ['failed', 'declined'].includes(o.payment_status?.toLowerCase())).length;

  // Format large numbers
  const formatMoney = (amount) => {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'k';
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Stat Cards - 8 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Row */}
        <StatCard
          title="Total Sales"
          value={formatMoney(totalSales)}
          textPrefix="৳"
          percentage={2.4} trend="up"
          bg="bg-[#d1f4eb]"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(totalOrders)}
          percentage={1.2} trend="up"
          bg="bg-[#fdf0bc]"
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(uniqueCustomers)}
          percentage={3.1} trend="up"
          bg="bg-[#fedcc1]"
        />
        <StatCard
          title="Shipping Delays"
          value={formatNumber(shippingDelays)}
          percentage={0.1} trend="down"
          bg="bg-[#fde3f4]"
        />

        {/* Bottom Row */}
        <StatCard
          title="Refund Requests"
          value={formatNumber(refundRequests)}
          percentage={0.4} trend="down"
          bg="bg-[#c3dafa]"
        />
        <StatCard
          title="Stock Products"
          value={formatNumber(stockProducts)}
          percentage={0.8} trend="up"
          bg="bg-[#fcd0a1]"
        />
        <StatCard
          title="Abandoned Carts"
          value={formatNumber(abandonedCarts)}
          percentage={0.0} trend="down"
          bg="bg-[#ccf2a6]"
        />
        <StatCard
          title="Payment Failures"
          value={formatNumber(paymentFailures)}
          percentage={0.2} trend="down"
          bg="bg-[#b6e4ff]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[400px]">

        {/* Revenue Chart - takes up half space or more */}
        <div className="lg:col-span-6 xl:col-span-6 h-full">
          <RevenueChart orders={orders} />
        </div>

        {/* Promotional Sales */}
        <div className="lg:col-span-3 xl:col-span-3 h-full">
          <PromotionalSales orders={orders} />
        </div>

        {/* Top Sale List */}
        <div className="lg:col-span-3 xl:col-span-3 h-full">
          <TopSaleList orders={orders} />
        </div>

      </div>
    </div>
  );
}
