'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 6, 2026";

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#f18e6c] selection:text-white pb-24">
      
      {/* Hero Section */}
      <div className="bg-white py-16 sm:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Shield size={48} className="text-[#f18e6c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f18e6c] to-orange-400">Policy</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            At Mohona, we take your privacy and data security seriously. This policy outlines how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-400 font-medium">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mt-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-8 sm:p-12 space-y-12">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Eye size={20} className="text-[#f18e6c]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <div className="pl-14 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                </p>
                <p>
                  Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We refer to this information as "Order Information."
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-[#f18e6c]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <div className="pl-14 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
                </p>
                <p>
                  Additionally, we use this Order Information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Communicate with you regarding your order or inquiries;</li>
                  <li>Screen our orders for potential risk or fraud; and</li>
                  <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Lock size={20} className="text-[#f18e6c]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Data Security & Retention</h2>
              </div>
              <div className="pl-14 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All sensitive/credit information you supply is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems.
                </p>
                <p>
                  When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Changes & Contact</h2>
              </div>
              <div className="pl-14 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
                </p>
                <p>
                  For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:cgfwatreasurer@gmail.com" className="text-[#f18e6c] hover:underline font-medium">cgfwatreasurer@gmail.com</a>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
