'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Megaphone, Award, ArrowRight } from 'lucide-react';
import linksData from "../../data/links.json";
import { useSiteSettings } from "../context/SiteSettingsContext";

export default function Footer() {
  const { settings } = useSiteSettings();

  const features = [
    {
      id: 1,
      title: "Fast Delivery",
      description: "Get fast and hassle-free delivery of your orders to your doorstep. Ensuring a seamless experience.",
      icon: <Truck size={36} strokeWidth={1.5} className="mb-4 text-gray-800" />,
      link: "#"
    },
    {
      id: 2,
      title: "Super Deals",
      description: "Stay updated on all our latest news, offers, and campaigns.",
      icon: <Megaphone size={36} strokeWidth={1.5} className="mb-4 text-gray-800" />,
      link: "#"
    },
    {
      id: 3,
      title: "Mohona Rewards",
      description: "Unlock a world of exciting benefits with Mohona Rewards loyalty program.",
      icon: <Award size={36} strokeWidth={1.5} className="mb-4 text-gray-800" />,
      link: "#"
    },
    {
      id: 4,
      title: "Stay Connected",
      description: "Keep up with the latest styles, news and offers on our social channels.",
      isSocial: true
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20 font-sans">

      {/* Top Section - Features */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">

            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col items-center text-center px-6 py-12">
                {feature.isSocial ? (
                  <div className="flex items-center justify-center gap-3 mb-6 w-full">
                    {settings?.socialLinks?.facebook && (
                      <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                      </a>
                    )}
                    {settings?.socialLinks?.instagram && (
                      <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-sm flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                      </a>
                    )}
                    {settings?.socialLinks?.youtube && (
                      <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                      </a>
                    )}
                    {settings?.socialLinks?.linkedin && (
                      <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-700 rounded-sm flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                      </a>
                    )}
                    {(!settings?.socialLinks?.facebook && !settings?.socialLinks?.instagram && !settings?.socialLinks?.youtube && !settings?.socialLinks?.linkedin) && (
                      <span className="text-gray-400 text-sm">No social links configured</span>
                    )}
                  </div>
                ) : (
                  feature.icon
                )}
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 max-w-[200px]">
                  {feature.description}
                </p>
                {!feature.isSocial && (
                  <Link href={feature.link} className="text-xs font-bold text-black border-b border-black pb-0.5 hover:text-[#2a2d96] hover:border-[#2a2d96] transition-colors">
                    Learn More
                  </Link>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Middle Section - Links & Newsletter */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Newsletter */}
          <div className="lg:col-span-4 lg:pr-8">
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Sign up and Stay Updated</h4>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Sign up and stay updated with the latest product launches and offers!
            </p>
            <form className="flex w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-gray-300 rounded-l-sm px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-r-sm transition-colors flex items-center justify-center"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Links 1 */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col lg:items-center">
            <div className="w-full lg:w-auto">
              <h4 className="font-bold text-gray-900 mb-6 text-sm">About Mohona</h4>
              <ul className="space-y-3">
                {linksData.footerAbout.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-500 hover:text-black text-xs transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Links 2 */}
          <div className="lg:col-span-2 flex flex-col lg:items-center">
            <div className="w-full lg:w-auto">
              <h4 className="font-bold text-gray-900 mb-6 text-sm">Help</h4>
              <ul className="space-y-3">
                {linksData.footerHelp.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-500 hover:text-black text-xs transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-3 flex flex-col lg:items-end">
            <div className="w-full max-w-[200px]">
              {/* Using simple text boxes to mimic payment logos */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-blue-800 font-bold text-[10px] italic">VISA</div>
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-red-500 font-bold text-[10px]">MasterCard</div>
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-blue-600 font-bold text-[10px]">AMEX</div>
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-pink-600 font-bold text-[10px]">bKash</div>
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-orange-500 font-bold text-[10px]">Nagad</div>
                <div className="bg-gray-50 border border-gray-200 h-10 rounded flex items-center justify-center text-purple-600 font-bold text-[10px]">Rocket</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-300 font-medium">
            © {new Date().getFullYear()} {settings?.storeName || 'Mohona by CGFWA'}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
