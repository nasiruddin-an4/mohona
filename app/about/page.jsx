import React from 'react';
import { Store, ShieldCheck, Heart, Award, Star } from 'lucide-react';

export const metadata = {
  title: 'About Us - Mohona',
  description: 'Learn more about Mohona Arts & Crafts Store.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative py-24 md:py-40 px-4 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="Architecture Background"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7f6580]/90 via-[#49447b]/90 to-[#1f224b]/95"></div>
          </div>

          <div className="container mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 leading-tight text-white">
                About Us
              </h1>

              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200">
                A reliable institution for handicrafts and home decor items operated under the supervision of the Bangladesh Coast Guard Family Welfare Association.
              </p>
            </div>
          </div>
        </div>

        {/* About Our Business Section */}
        <div className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Core Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Quality Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                  <Star size={28} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Premium Quality</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  We offer only the highest quality handicrafts and decor, carefully selected to bring beauty and elegance to your home.
                </p>
              </div>

              {/* Trust Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <Award size={28} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Reliability</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Backed by the Bangladesh Coast Guard Family Welfare Association, we pride ourselves on trust and dependability.
                </p>
              </div>

              {/* Craftsmanship Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={28} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Craftsmanship</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Every product tells a story of authentic local craftsmanship, empowering artisans across the community.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
