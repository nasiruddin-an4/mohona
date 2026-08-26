'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from "../context/SiteSettingsContext";
import { MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const { settings } = useSiteSettings();

  const shopLocations = [
    { name: "Mohona Shop Dhaka", href: "/shop" },
    { name: "Mohona Exclusive Shop Chattogram", href: "/shop" },
    { name: "Super Shop Mohona Mongla", href: "/shop" },
    { name: "Mohona Exclusive Shop Bhola", href: "/shop" },
    { name: "Mohona Exclusive Shop Patuakhali", href: "/shop" }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20 font-sans text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">

          {/* Left Side: Logo & Description */}
          <div className="flex flex-col lg:col-span-4 xl:col-span-3">
            <Link href="/" className="inline-block mb-6 bg-white w-fit p-2 rounded-md">
              <img src="/logoFinal.jpg" alt={settings?.storeName || "Mohona"} className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 pr-4">
              {settings?.storeName || 'Mohona'} provides high-quality traditional clothing, beautiful handicrafts, and premium home decor items directly to you.
            </p>
          </div>

          {/* Right Side: Shop Locations Grid */}
          <div className="flex flex-col lg:col-span-8 xl:col-span-9">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider border-b border-slate-700 pb-3">Our Shop Location</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-6">
              {/* Dhaka */}
              <div className="flex flex-col">
                <h5 className="text-white font-bold mb-3 text-[15px]">Dhaka</h5>
                <div className="flex items-start gap-2 mb-2 text-gray-400">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">Shop # 1, 2, Navy Market, Khilkhet, Dhaka-1229</p>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">{settings?.phone || '01769-441085'}</p>
                </div>
              </div>
              
              {/* Chattogram */}
              <div className="flex flex-col">
                <h5 className="text-white font-bold mb-3 text-[15px]">Ctg</h5>
                <div className="flex items-start gap-2 mb-2 text-gray-400">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">Mohona Exclusive Shop, Chattogram, Bangladesh</p>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">{settings?.phone || '01769-441085'}</p>
                </div>
              </div>

              {/* Bhola */}
              <div className="flex flex-col">
                <h5 className="text-white font-bold mb-3 text-[15px]">Bhola</h5>
                <div className="flex items-start gap-2 mb-2 text-gray-400">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">Mohona Exclusive Shop, Bhola, Bangladesh</p>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">{settings?.phone || '01769-441085'}</p>
                </div>
              </div>

              {/* Mongla */}
              <div className="flex flex-col">
                <h5 className="text-white font-bold mb-3 text-[15px]">Mongla</h5>
                <div className="flex items-start gap-2 mb-2 text-gray-400">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">Super Shop Mohona, Mongla, Bangladesh</p>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <Phone size={14} className="shrink-0 text-gray-500" />
                  <p className="text-xs leading-relaxed">{settings?.phone || '01769-441085'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} {settings?.storeName || 'Mohona by CGFWA'}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
