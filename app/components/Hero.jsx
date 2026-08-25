'use client';

import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="w-full flex flex-col">
      {/* Top Banner Section - Full Width Breakout */}
      <section className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] text-white pt-32 pb-12 md:pt-48 md:pb-16 flex flex-col items-center justify-end text-center px-4 overflow-hidden h-[85vh]">

        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Brand Colored Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0 mix-blend-multiply"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full mt-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md">
            Everything You Need, Every Day
          </h1>
          <p className="text-lg md:text-xl font-light mb-2 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Bangladesh Coast Guard Family Welfare Association-supervised reliable institution for handicrafts and home decoration items.
          </p>
        </div>
      </section>
    </div>
  );
}
