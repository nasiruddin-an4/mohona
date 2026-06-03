'use client';

import React from 'react';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import PromotionalSales from './components/PromotionalSales';
import TopSaleList from './components/TopSaleList';
import { DollarSign, ShoppingBag, Users, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings"
          value="$334,945"
          percentage={1.56}
          trend="up"
          timeRange="Weekly"
          icon={DollarSign}
          color="bg-green-500"
          trendData="M0 40 Q 15 35, 25 30 T 40 20 T 60 30 T 80 15 T 100 10"
        />
        <StatCard 
          title="Total Orders"
          value="2,802"
          percentage={1.56}
          trend="down"
          timeRange="Monthly"
          icon={ShoppingBag}
          color="bg-orange-500"
          trendData="M0 10 Q 15 20, 25 25 T 40 30 T 60 15 T 80 20 T 100 40"
        />
        <StatCard 
          title="Customers"
          value="4,945"
          percentage={1.56}
          trend="up"
          timeRange="Yearly"
          icon={Users}
          color="bg-purple-500"
          trendData="M0 30 Q 15 35, 25 20 T 40 10 T 60 25 T 80 15 T 100 5"
        />
        <StatCard 
          title="My Balance"
          value="4,945"
          percentage={1.56}
          trend="up"
          timeRange="Yearly"
          icon={CreditCard}
          color="bg-blue-500"
          trendData="M0 25 Q 15 15, 25 20 T 40 30 T 60 15 T 80 5 T 100 15"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[400px]">
        
        {/* Revenue Chart - takes up half space or more */}
        <div className="lg:col-span-6 xl:col-span-6 h-full">
          <RevenueChart />
        </div>

        {/* Promotional Sales */}
        <div className="lg:col-span-3 xl:col-span-3 h-full">
          <PromotionalSales />
        </div>

        {/* Top Sale List */}
        <div className="lg:col-span-3 xl:col-span-3 h-full">
          <TopSaleList />
        </div>

      </div>
    </div>
  );
}
