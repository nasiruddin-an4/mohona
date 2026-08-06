'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, Star, Heart, Rocket, Coffee } from 'lucide-react';

export default function CareersPage() {
  const benefits = [
    {
      icon: <Heart size={24} className="text-[#f18e6c]" />,
      title: "Impactful Work",
      description: "Every day, your work directly supports local artisans and promotes sustainable, ethical commerce in Bangladesh."
    },
    {
      icon: <Star size={24} className="text-[#f18e6c]" />,
      title: "Growth & Learning",
      description: "We invest in our people. From workshops to leadership training, we provide the resources you need to advance your career."
    },
    {
      icon: <Coffee size={24} className="text-[#f18e6c]" />,
      title: "Flexible Environment",
      description: "We believe in work-life balance. Enjoy flexible working hours, remote options, and a supportive team culture."
    },
    {
      icon: <Rocket size={24} className="text-[#f18e6c]" />,
      title: "Innovation First",
      description: "Bring your boldest ideas. We foster a culture of creativity where innovative solutions are always encouraged."
    }
  ];

  const openings = [
    {
      title: "Artisan Community Manager",
      department: "Operations",
      location: "Dhaka, Bangladesh (Hybrid)",
      type: "Full-time"
    },
    {
      title: "E-commerce Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Customer Success Representative",
      department: "Support",
      location: "Dhaka, Bangladesh",
      type: "Part-time"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#f18e6c] selection:text-white">
      
      {/* Hero Section */}
      <div className="relative bg-[#fafafa] py-24 sm:py-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 uppercase tracking-widest mb-8 shadow-sm">
            <Briefcase size={16} className="text-[#f18e6c]" /> Join the Team
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Build a career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f18e6c] to-orange-400">purpose</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            We are always on the lookout for passionate, driven individuals who share our vision of empowering communities through ethical commerce.
          </p>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Why work at Mohona?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We offer more than just a job. We offer a community, a mission, and a place to grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-4">Open Positions</h2>
            <p className="text-gray-400">Find the perfect role to showcase your skills and make a difference.</p>
          </div>
          
          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="group bg-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-800/80 transition-colors border border-gray-700 hover:border-gray-600">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#f18e6c] transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 font-medium">
                    <span className="bg-gray-700/50 px-3 py-1 rounded-full">{job.department}</span>
                    <span className="bg-gray-700/50 px-3 py-1 rounded-full">{job.location}</span>
                    <span className="bg-gray-700/50 px-3 py-1 rounded-full">{job.type}</span>
                  </div>
                </div>
                <button className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-[#f18e6c] hover:text-white transition-all transform group-hover:scale-110">
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-gray-800 rounded-3xl p-10 border border-gray-700">
            <h3 className="text-xl font-bold mb-3">Don't see a fit?</h3>
            <p className="text-gray-400 mb-6">We're always looking for great talent. Send your resume and tell us how you can contribute.</p>
            <a href="mailto:careers@mohonacgfwa.com" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-gray-200 transition-colors">
              Email Us Your Resume
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
