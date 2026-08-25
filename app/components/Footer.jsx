'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from "../context/SiteSettingsContext";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* 1. Logo & Description */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-6 bg-white w-fit p-2 rounded-md">
              <img src="/logoFinal.jpg" alt={settings?.storeName || "Mohona"} className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings?.storeName || 'Mohona'} provides high-quality traditional clothing, beautiful handicrafts, and premium home decor items directly to you.
            </p>
          </div>

          {/* 2. About Mohona */}
          <div className="flex flex-col lg:pl-10">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">About Mohona</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Shop Locations */}
          <div className="flex flex-col">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Our Locations</h4>
            <ul className="space-y-3">
              {shopLocations.map((loc, index) => (
                <li key={index}>
                  <Link href={loc.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Social Media */}
          <div className="flex flex-col lg:items-end">
            <div className="w-full lg:w-auto">
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Stay Connected</h4>
              <div className="flex items-center gap-3 justify-start lg:justify-end">
                <a href={settings?.socialLinks?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href={settings?.socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href={settings?.socialLinks?.youtube || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>
                <a href={settings?.socialLinks?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
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
