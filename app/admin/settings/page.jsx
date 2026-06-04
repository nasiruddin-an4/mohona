'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Store, Phone, Mail, MapPin, Share2, Globe, Camera, PlayCircle, Briefcase } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function AdminSettingsPage() {
  const { settings, loading: contextLoading, refreshSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    storeName: '',
    phone: '',
    phoneAlt: '',
    email: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage({ type: 'success', text: 'Settings updated successfully!' });
        refreshSettings(); // Refresh context
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    }
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#2a2d96]" size={40} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in duration-700 font-sans">
      
      {/* Premium Header */}
      <div className="mb-8 rounded-3xl bg-[#2a2d96] text-white p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-[#2a2d96]/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 opacity-10 transform rotate-12 pointer-events-none">
          <Globe size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold mb-6">
            <Store size={16} />
            <span>Central Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Global Settings
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl font-medium leading-relaxed">
            Configure your store's core identity. These settings instantly synchronize across your entire storefront, including the header, footer, and about page.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* General Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2a2d96] group-hover:scale-110 transition-transform">
                  <Store size={20} strokeWidth={2.5} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg">General Information</h2>
              </div>
              <div className="p-8">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName || ''}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                    placeholder="e.g. Mohona by CGFWA"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Phone size={20} strokeWidth={2.5} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg">Contact Details</h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                      placeholder="e.g. 01769-441085"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alternative Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                      type="text"
                      name="phoneAlt"
                      value={formData.phoneAlt || ''}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                      placeholder="e.g. +880 1769-441085"
                    />
                  </div>
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Support Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium"
                      placeholder="e.g. contact@store.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Address Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <MapPin size={20} strokeWidth={2.5} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg">Physical Address</h2>
              </div>
              <div className="p-8">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Store Location</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#2a2d96]/10 focus:border-[#2a2d96] transition-all text-gray-900 font-medium resize-none"
                    placeholder="Enter complete store address..."
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">This address will be displayed on the About and Contact pages.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Socials) */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 xl:sticky xl:top-24">
              <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Share2 size={20} strokeWidth={2.5} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg">Social Connections</h2>
              </div>
              <div className="p-8 space-y-6">
                
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Globe size={16} className="text-[#1877F2]" /> Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1877F2]/20 focus:border-[#1877F2] transition-all text-sm font-medium"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Camera size={16} className="text-[#E4405F]" /> Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E4405F]/20 focus:border-[#E4405F] transition-all text-sm font-medium"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <PlayCircle size={16} className="text-[#FF0000]" /> YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.socialLinks?.youtube || ''}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FF0000]/20 focus:border-[#FF0000] transition-all text-sm font-medium"
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Briefcase size={16} className="text-[#0A66C2]" /> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all text-sm font-medium"
                    placeholder="https://linkedin.com/..."
                  />
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Floating Action Bar */}
        <div className="mt-8 bg-white/90 backdrop-blur-xl border border-gray-200 p-4 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center rounded-2xl shadow-sm gap-4 md:gap-0">
          
          <div className="flex-1 flex justify-center md:justify-start">
            {saveMessage.text && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-in slide-in-from-bottom-4 fade-in ${
                saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {saveMessage.type === 'success' ? (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                )}
                {saveMessage.text}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-[#2a2d96] text-white font-bold rounded-xl hover:bg-[#1f2278] hover:shadow-lg hover:shadow-[#2a2d96]/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:shadow-none transform active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
