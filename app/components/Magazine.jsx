'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_BLOG_POSTS = [
  {
    id: 1,
    title: 'Mohona Wins The Bangladesh Retail Awards For The Third Year In A Row',
    admin: 'ADMIN',
    description: 'At the 3rd edition of the Bangladesh Retail Awards...',
    image: '/images/promo_slider_1.png',
  },
  {
    id: 2,
    title: 'Mohona KUET IV 2023: An Exhilarating Inter-University Debate Championship',
    admin: 'ADMIN',
    description: 'Mohona KUET IV 2023 was a battleground of disputes...',
    image: '/images/promo_slider_2.png',
  },
  {
    id: 3,
    title: 'Kids Art Competition: Young Minds Express The Spirit Of Victory Powered By Mohona',
    admin: 'ADMIN',
    description: 'To mark Victory Day on December 14, Mohona organiz...',
    image: '/images/kids-collection.png',
  },
  {
    id: 4,
    title: 'Pitha Utshob & Musical Night: A Community Celebration Of Culture And Togetherness Powered By Mohona',
    admin: 'ADMIN',
    description: 'On December 14, Mohona hosted a vibrant Pitha Utsh...',
    image: '/images/promo_slider_3.png',
  },
];

// Duplicate items to ensure there's enough content to scroll infinitely
const BLOG_POSTS = [...INITIAL_BLOG_POSTS, ...INITIAL_BLOG_POSTS.map(p => ({ ...p, id: p.id + 10 }))];

export default function Magazine() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Scroll by roughly the width of one card (plus gap)
      const cardWidth = clientWidth / 4;
      let scrollTo;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollTo = 0;
        } else {
          scrollTo = scrollLeft + cardWidth;
        }
      } else {
        if (scrollLeft <= 0) {
          scrollTo = scrollWidth - clientWidth;
        } else {
          scrollTo = scrollLeft - cardWidth;
        }
      }

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => scroll('right'), 3000);
    return () => clearInterval(interval);
  }, [scroll, isPaused]);

  return (
    <section
      className="pt-8 bg-[#fdfdfd] relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 uppercase tracking-tight">Mohona Journals</h2>
          <p className="text-gray-600 font-medium text-sm md:text-base">Latest Stories & Updates From Mohona</p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-800 hover:text-black transition-all opacity-0 group-hover:opacity-100 -translate-x-5"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-800 hover:text-black transition-all opacity-0 group-hover:opacity-100 translate-x-5"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="min-w-[calc(100%-32px)] sm:min-w-[calc((100%-16px)/2)] lg:min-w-[calc((100%-72px)/4)] group relative aspect-[4/5] bg-gray-200 overflow-hidden rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300 block snap-start shrink-0"
              >
                {/* Background Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end text-white text-left">
                  <span className="text-xs font-bold mb-2 tracking-wider uppercase text-white/90">
                    {post.admin}
                  </span>
                  <h3 className="text-[15px] md:text-base font-bold leading-snug mb-2 line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
