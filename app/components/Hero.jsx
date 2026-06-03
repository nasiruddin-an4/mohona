'use client';

import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="w-full flex flex-col">
      {/* Top Banner Section - Full Width Breakout */}
      <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-gradient-to-r from-red-900 via-red-700 to-red-900 text-white py-16 md:py-28 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Everything You Need, Every Day
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-3xl mx-auto leading-relaxed">
          Bangladesh Coast Guard Family Welfare Association-supervised reliable institution for handicrafts and home decoration items.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/category/men"
            className="border border-white hover:bg-white hover:text-[#2a2d96] text-white px-12 py-2.5 rounded-sm font-medium transition-all"
          >
            Men
          </Link>
          <Link
            href="/category/women"
            className="border border-white hover:bg-white hover:text-[#2a2d96] text-white px-12 py-2.5 rounded-sm font-medium transition-all"
          >
            Women
          </Link>
        </div>
      </section>
    </div>
  );
}
