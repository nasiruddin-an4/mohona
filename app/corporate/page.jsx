'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Globe, Users, Leaf, ShieldCheck, Award } from 'lucide-react';

export default function CorporateResponsibilityPage() {
  const initiatives = [
    {
      icon: <Users size={32} className="text-[#f18e6c]" />,
      title: "Empowering Artisans",
      description: "We are committed to uplifting local artisans, particularly women in rural communities, by providing fair wages, safe working conditions, and a platform to showcase their traditional crafts to the world."
    },
    {
      icon: <Leaf size={32} className="text-[#f18e6c]" />,
      title: "Sustainable Practices",
      description: "Environmental sustainability is at the core of our operations. We prioritize eco-friendly materials, minimize waste in our packaging, and promote products that are handcrafted using natural, biodegradable resources."
    },
    {
      icon: <ShieldCheck size={32} className="text-[#f18e6c]" />,
      title: "Ethical Sourcing",
      description: "Transparency is key. We ensure that every product in our catalog is sourced ethically. We maintain direct relationships with our creators to ensure fair trade practices are upheld at every step of the supply chain."
    },
    {
      icon: <Globe size={32} className="text-[#f18e6c]" />,
      title: "Community Development",
      description: "A portion of our proceeds is continuously reinvested into the communities we work with. From funding local education initiatives to providing healthcare support for artisan families."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#f18e6c] selection:text-white">
      
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-24 sm:py-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 uppercase tracking-widest mb-8 shadow-sm">
            <Heart size={16} className="text-[#f18e6c]" /> Our Commitment
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f18e6c] to-orange-400">Responsibility</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            At Mohona, we believe that business should be a force for good. We are dedicated to creating a positive impact on our communities, our artisans, and our planet.
          </p>
        </div>
      </div>

      {/* Initiatives Grid */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {initiatives.map((initiative, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-6 p-8 rounded-3xl bg-gray-50 hover:bg-gray-100/80 transition-colors border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                    {initiative.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{initiative.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {initiative.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-gray-900 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <Award size={48} className="text-[#f18e6c] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Join Us in Making a Difference</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Every purchase you make directly supports our mission to empower artisans and promote sustainable, ethical trade. Together, we can build a better future.
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase bg-white rounded-xl hover:bg-gray-100 transition-colors">
            Shop Ethically Now
          </Link>
        </div>
      </div>

    </div>
  );
}
