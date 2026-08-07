import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog - Mohona',
  description: 'Read the latest news, updates, and stories from Mohona.',
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Art of Local Craftsmanship",
      excerpt: "Discover the intricate details and dedication behind our locally sourced handcrafted items that bring warmth to every home.",
      date: "Oct 15, 2025",
      category: "Crafts",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Decorating Your Home for the Festive Season",
      excerpt: "A complete guide on how to utilize Mohona's exclusive decor collection to transform your living space this upcoming holiday season.",
      date: "Sep 28, 2025",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Supporting Coast Guard Families",
      excerpt: "Learn how every purchase from Mohona directly contributes to the welfare of Bangladesh Coast Guard families.",
      date: "Sep 10, 2025",
      category: "Community",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Winter Collection",
      excerpt: "Discover our latest winter collection featuring warm, stylish, and comfortable clothing perfect for the colder months.",
      date: "Oct 28, 2025",
      category: "Winter",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative py-24 md:py-40 px-4 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
              alt="Blog Background"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7f6580]/90 via-[#49447b]/90 to-[#1f224b]/95"></div>
          </div>

          <div className="container mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 leading-tight text-white">
                Our Blog
              </h1>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200">
                Stories, inspiration, and updates from the Mohona community.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />

                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar size={16} className="mr-2" />
                      {post.date}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#49447b] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 font-medium leading-relaxed mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <Link href={`/blog/${post.id}`} className="flex items-center text-[#49447b] font-bold text-sm group/btn w-fit mt-auto">
                      Read More
                      <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
