'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from "../context/SiteSettingsContext";
import { MapPin, Phone, Mail } from 'lucide-react';

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

          {/* Shop Locations Grid */}
          <div className="flex flex-col lg:col-span-12 w-full">
            <div className="flex items-center justify-between mb-8 border-b border-slate-700/80 pb-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
                <MapPin className="text-emerald-400" size={18} />
                Our Shop Locations
              </h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {/* Dhaka */}
              <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group">
                <h5 className="text-white font-semibold mb-4 text-[15px] group-hover:text-emerald-400 transition-colors">Mohona Shop Dhaka</h5>
                <div className="flex items-start gap-3 mb-3 text-gray-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm leading-snug">Shop 1 & 2, Navy Market, Khilkhet, Dhaka-1229</p>
                </div>
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <Phone size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm">01769-441085</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mt-auto">
                  <Mail size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <a href="mailto:cgfwa123@gmail.com" className="text-sm hover:text-white transition-colors truncate">cgfwa123@gmail.com</a>
                </div>
              </div>
              
              {/* Chattogram */}
              <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group">
                <h5 className="text-white font-semibold mb-4 text-[15px] group-hover:text-emerald-400 transition-colors">Mohona Exclusive Shop Chattogram</h5>
                <div className="flex items-start gap-3 mb-3 text-gray-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm leading-snug">Adjacent to Ichhanagar BAFDC Gate, BAFDC Market, Shop No-1(Ka), Karnaphuli, Chattogram</p>
                </div>
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <Phone size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm">01769-442084</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mt-auto">
                  <Mail size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <a href="mailto:cgfwae@gmail.com" className="text-sm hover:text-white transition-colors truncate">cgfwae@gmail.com</a>
                </div>
              </div>

              {/* Mongla */}
              <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group">
                <h5 className="text-white font-semibold mb-4 text-[15px] group-hover:text-emerald-400 transition-colors">Super Shop Mohona Mongla</h5>
                <div className="flex items-start gap-3 mb-3 text-gray-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm leading-snug">Bus Stand, Mongla, Bagerhat</p>
                </div>
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <Phone size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm">01769-444089</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mt-auto">
                  <Mail size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <a href="mailto:supershopmohona.wz@gmail.com" className="text-sm hover:text-white transition-colors truncate">supershopmohona.wz@gmail.com</a>
                </div>
              </div>

              {/* Bhola */}
              <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group">
                <h5 className="text-white font-semibold mb-4 text-[15px] group-hover:text-emerald-400 transition-colors">Mohona Exclusive Shop Bhola</h5>
                <div className="flex items-start gap-3 mb-3 text-gray-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm leading-snug">Adjacent to Coast Guard Base Bhola, Kheyaghat Road, Bhola Sadar, Bhola</p>
                </div>
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <Phone size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm">01769-443082</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mt-auto">
                  <Mail size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <a href="mailto:mohonasouthzone@gmail.com" className="text-sm hover:text-white transition-colors truncate">mohonasouthzone@gmail.com</a>
                </div>
              </div>

              {/* Patuakhali */}
              <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-300 group">
                <h5 className="text-white font-semibold mb-4 text-[15px] group-hover:text-emerald-400 transition-colors">Mohona Exclusive Shop Patuakhali</h5>
                <div className="flex items-start gap-3 mb-3 text-gray-400">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm leading-snug">BGB Base Agrajatra, Durgapur, Patuakhali Sadar, Patuakhali</p>
                </div>
                <div className="flex items-center gap-3 mb-3 text-gray-400">
                  <Phone size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <p className="text-sm">01769-446280</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mt-auto">
                  <Mail size={16} className="shrink-0 text-slate-500 group-hover:text-emerald-500/70 transition-colors" />
                  <a href="mailto:mohonaexclusiveshopagrajatra@gmail.com" className="text-sm hover:text-white transition-colors truncate">mohonaexclusiveshopagrajatra@gmail.com</a>
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
