import React from 'react';
import { MapPin, Phone, Mail, Store, ShieldCheck, Send } from 'lucide-react';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

export const metadata = {
  title: 'Contact Us - Mohona',
  description: 'Get in touch with Mohona Arts & Crafts Store.',
};

export default async function ContactPage() {
  await connectDB();
  let settings = await SiteSettings.findOne({ key: 'singleton' });
  if (!settings) {
    settings = {}; // fallback if not initialized
  }

  const address = settings.address || 'Shop # 1, 2, Navy Market, Khilkhet, Dhaka-1229, Bangladesh';
  const phone = settings.phone || '01769-441085';
  const phoneAlt = settings.phoneAlt || '+880 1769-441085';
  const email = settings.email || 'cgfwatreasurer@gmail.com';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative py-24 md:py-40 px-4 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="Architecture Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#7f6580]/90 via-[#49447b]/90 to-[#1f224b]/95"></div>
          </div>

          <div className="container mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 leading-tight text-white tracking-tight">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200">
                We'd love to hear from you. Reach out to us using any of the methods below or send us a direct message.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information & Form Section */}
        <div className="py-20 px-4 relative z-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

              {/* Left Column: Contact Cards */}
              <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Get in Touch</h2>
                  <p className="text-gray-500 mb-10 text-lg">Have a question or just want to say hi? We'd love to hear from you.</p>

                  <div className="space-y-8">
                    {/* Address Card */}
                    <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-[#2a2d96]/5 rounded-2xl flex items-center justify-center text-[#2a2d96] group-hover:scale-110 group-hover:bg-[#2a2d96] group-hover:text-white transition-all duration-300 shrink-0 shadow-sm border border-[#2a2d96]/10">
                        <MapPin size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Our Location</h3>
                        <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                          {address}
                        </p>
                      </div>
                    </div>

                    {/* Phone Card */}
                    <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm border border-orange-100">
                        <Phone size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h3>
                        <div className="text-gray-600 font-medium">
                          <p>{phone}</p>
                          {phoneAlt && <p className="mt-0.5">{phoneAlt}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm border border-emerald-100">
                        <Mail size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Email Address</h3>
                        <a href={`mailto:${email}`} className="text-gray-600 font-medium hover:text-[#2a2d96] hover:underline transition-colors break-all">
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-3 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">Send us a Message</h3>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Your Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Subject</label>
                      <input
                        type="text"
                        placeholder="How can we help you?"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Your Message</label>
                      <textarea
                        rows="5"
                        placeholder="Write your message here..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      className="w-full md:w-auto px-8 py-4 bg-[#2a2d96] text-white font-bold rounded-xl hover:bg-[#1f2278] hover:shadow-lg hover:shadow-[#2a2d96]/30 transition-all flex items-center justify-center gap-3 transform active:scale-95"
                    >
                      <span>Send Message</span>
                      <Send size={20} />
                    </button>
                  </form>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
