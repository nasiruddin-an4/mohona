'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search } from 'lucide-react';

export default function FindStorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stores = [
    {
      id: 1,
      name: "Mohona Flagship Store - Gulshan",
      address: "123 Gulshan Avenue, Dhaka 1212, Bangladesh",
      phone: "+880 1769-441085",
      hours: "Sun-Thu: 10:00 AM - 8:00 PM\nFri-Sat: 11:00 AM - 9:00 PM",
      type: "Flagship Experience Center",
      lat: "23.7925",
      lng: "90.4078" // Gulshan coordinates roughly
    },
    {
      id: 2,
      name: "Mohona Artisan Outlet - Dhanmondi",
      address: "Satmasjid Road, Dhanmondi, Dhaka 1205, Bangladesh",
      phone: "+880 1711-000000",
      hours: "Sun-Thu: 10:00 AM - 8:00 PM\nFri-Sat: 10:00 AM - 8:00 PM",
      type: "Retail Outlet",
      lat: "23.7461",
      lng: "90.3742" // Dhanmondi coordinates roughly
    },
    {
      id: 3,
      name: "Mohona Heritage Studio - Banani",
      address: "Block E, Banani, Dhaka 1213, Bangladesh",
      phone: "+880 1722-000000",
      hours: "Sun-Thu: 11:00 AM - 7:00 PM\nFri-Sat: Closed",
      type: "Boutique & Studio",
      lat: "23.7940",
      lng: "90.4043" // Banani coordinates roughly
    }
  ];

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#f18e6c] selection:text-white pb-24">
      
      {/* Hero Section */}
      <div className="bg-white py-16 sm:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <MapPin size={48} className="text-[#f18e6c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Find a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f18e6c] to-orange-400">Store Near You</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Experience our handcrafted products in person. Visit one of our outlets in Dhaka to feel the quality and learn the stories behind our collections.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Store List Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Search Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by area or street..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f18e6c] focus:border-transparent transition-all font-medium shadow-sm"
              />
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1">
              <div className="max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                
                {filteredStores.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No stores found matching your search.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredStores.map(store => (
                      <div key={store.id} className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold tracking-wider text-orange-500 uppercase bg-orange-50 px-2.5 py-1 rounded-md">
                            {store.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#f18e6c] transition-colors">{store.name}</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm text-gray-600">
                            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{store.address}</span>
                          </div>
                          <div className="flex items-start gap-3 text-sm text-gray-600">
                            <Phone size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{store.phone}</span>
                          </div>
                          <div className="flex items-start gap-3 text-sm text-gray-600">
                            <Clock size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="whitespace-pre-line">{store.hours}</span>
                          </div>
                        </div>

                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 w-full inline-flex justify-center items-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-[#f18e6c] transition-colors"
                        >
                          <Navigation size={16} /> Get Directions
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Map Display */}
          <div className="w-full lg:w-2/3 h-[400px] lg:h-auto min-h-[600px] bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
            {/* Embedded Google Map pointing to Dhaka, Bangladesh */}
            <iframe 
              title="Mohona Store Locations"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58431.1065406085!2d90.3994522!3d23.750567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Custom Overlay message for aesthetic */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#f18e6c] flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <h4 className="font-bold text-gray-900">Interactive Map</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use the map to explore our locations across Dhaka. Click "Get Directions" on any store card to open Google Maps navigation.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
