import React from 'react';
import { LifeBuoy, Mail, Phone, MapPin, MessageCircleQuestion } from 'lucide-react';

export const metadata = {
  title: 'Support - Mohona',
  description: 'Get help and support for your Mohona orders.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative py-24 md:py-40 px-4 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
              alt="Support Background"
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7f6580]/90 via-[#49447b]/90 to-[#1f224b]/95"></div>
          </div>

          <div className="container mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 leading-tight text-white">
                How Can We Help?
              </h1>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200">
                Our support team is here to assist you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Support Options Section */}
        <div className="py-20 px-4 bg-white relative z-20 -mt-10">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* FAQ / Knowledge Base */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col group hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircleQuestion size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
                <p className="text-gray-600 font-medium leading-relaxed mb-6">
                  Find quick answers to common questions about orders, shipping, returns, and our products.
                </p>
                <div className="space-y-3 mt-auto">
                  {['How do I track my order?', 'What is your return policy?', 'Do you offer international shipping?'].map((faq, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl text-gray-800 font-medium hover:bg-gray-100 transition-colors cursor-pointer flex justify-between items-center">
                      {faq}
                      <LifeBuoy size={18} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col group hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact Support</h3>
                <p className="text-gray-600 font-medium leading-relaxed mb-8">
                  Need to speak with a human? Reach out to our customer service team directly.
                </p>
                
                <div className="space-y-6 mt-auto">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Email Us</h4>
                      <p className="text-gray-600 font-medium">support@mohona.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Call Us</h4>
                      <p className="text-gray-600 font-medium">+880 1234 567890</p>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wider">Visit Us</h4>
                      <p className="text-gray-600 font-medium">Bangladesh Coast Guard HQ</p>
                      <p className="text-gray-600 font-medium">Agargaon, Dhaka</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
