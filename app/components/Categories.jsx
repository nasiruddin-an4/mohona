'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 1, name: 'শাড়ি (Saree)', image: '/catelogImg/109_Jamdani_Saree.png' },
  { id: 2, name: 'পোশাক (Clothing)', image: '/catelogImg/119_Clothing_Section.png' },
  { id: 3, name: 'হোম ডেকোর (Home Decor)', image: '/catelogImg/89_Home_Decor_Section.png' },
  { id: 4, name: 'হস্তশিল্প (Handicrafts)', image: '/catelogImg/104_Shitolpati_Handicraft.png' },
  { id: 5, name: 'অন্যান্য (Others)', image: '/catelogImg/114_Jewellery_Collection.png' }
];

export default function Categories() {
  return (
    <section className="py-8 mt-2 md:mt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.name}`}
              className="group relative w-full aspect-[4/5] bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlaid Button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] bg-white text-gray-900 font-bold uppercase py-2.5 px-2 text-center text-sm md:text-base shadow-sm transition-colors duration-300 group-hover:bg-gray-900 group-hover:text-white">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
