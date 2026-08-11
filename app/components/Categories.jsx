'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 1, name: 'Clothing', image: '/catelogImg/119_Clothing_Section.png' },
  { id: 2, name: 'Saree', image: '/catelogImg/109_Jamdani_Saree.png' },
  { id: 3, name: 'Home Decor', image: '/catelogImg/89_Home_Decor_Section.png' },
  { id: 4, name: 'Jewellery', image: '/catelogImg/114_Jewellery_Collection.png' },
  { id: 5, name: 'Indoor Plants', image: '/catelogImg/123_Indoor_Plants_Section.png' },
  { id: 6, name: 'Traditional', image: '/catelogImg/120_Traditional_Gents_Items.png' },
  { id: 7, name: 'Handicrafts', image: '/catelogImg/104_Shitolpati_Handicraft.png' },
  { id: 8, name: 'Womens Accessories', image: '/catelogImg/108_Saree_and_Womens_Accessories_Section.png' },
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
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
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
