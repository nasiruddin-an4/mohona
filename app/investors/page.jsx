'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, PieChart, Users, ArrowRight, Download, BarChart3, Target } from 'lucide-react';

export default function InvestorsPage() {
  const highlights = [
    {
      icon: <TrendingUp size={24} className="text-white" />,
      title: "Strong Growth",
      description: "Consistent year-over-year revenue growth driven by expanding domestic and international markets."
    },
    {
      icon: <Target size={24} className="text-white" />,
      title: "Market Leadership",
      description: "Pioneering the ethical commerce space in Bangladesh with a unique, scalable artisan-direct model."
    },
    {
      icon: <Users size={24} className="text-white" />,
      title: "Social Impact",
      description: "Measurable positive impact on rural communities, creating sustainable livelihoods for thousands of artisans."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#f18e6c] selection:text-white">
      
      {/* Hero Section */}
      <div className="bg-gray-900 py-24 border-b border-gray-800 text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <PieChart size={48} className="text-[#f18e6c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Invest in <span className="text-[#f18e6c]">Sustainable</span> Commerce
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Mohona is rapidly redefining the retail landscape by bridging the gap between rural craftsmanship and global consumer demand. Join us in scaling a profitable business with a profound social mission.
          </p>
        </div>
      </div>

      {/* Investment Highlights */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#f18e6c] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-gray-900">Why Partner With Us?</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  At Mohona, we have built a robust supply chain that eliminates middlemen, ensuring that artisans receive fair compensation while providing consumers with high-quality, authentic products at competitive prices.
                </p>
                <p>
                  The global demand for ethically sourced, artisanal goods is growing at an unprecedented rate. Our scalable platform is perfectly positioned to capture this market, leveraging technology to streamline operations and enhance the customer experience.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Reports & Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#f18e6c] hover:text-[#f18e6c] transition-colors group">
                      <span className="font-medium text-gray-700 group-hover:text-[#f18e6c]">Q4 2025 Investor Deck</span>
                      <Download size={18} />
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#f18e6c] hover:text-[#f18e6c] transition-colors group">
                      <span className="font-medium text-gray-700 group-hover:text-[#f18e6c]">Annual Impact Report</span>
                      <Download size={18} />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-20 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <BarChart3 size={40} className="text-[#f18e6c] mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-6">Let's Discuss the Future</h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Interested in investment opportunities or strategic partnerships? Our executive team is ready to connect and share our vision for the future.
          </p>
          <a href="mailto:investors@mohonacgfwa.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase bg-white rounded-xl hover:bg-[#f18e6c] hover:text-white transition-all shadow-lg">
            Contact Investor Relations <ArrowRight size={18} />
          </a>
        </div>
      </div>

    </div>
  );
}
