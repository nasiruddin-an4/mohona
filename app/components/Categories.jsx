'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 1, name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  { id: 2, name: 'Men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80' },
  { id: 3, name: 'Kids', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80' },
  { id: 4, name: 'Teen', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80' }
];

export default function Categories({ outletSlug }) {
  return (
    <section className="py-8 mt-2 md:mt-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={outletSlug ? `/${outletSlug}/menu?category=${encodeURIComponent(cat.name)}` : `/shop/${cat.name}`}
              className="group relative w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] aspect-[4/5] bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
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
