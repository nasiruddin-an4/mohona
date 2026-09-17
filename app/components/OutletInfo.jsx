"use client";

import React from "react";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";

export default function OutletInfo({ outlet }) {
  if (!outlet) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {outlet.coverImage && (
        <div className="w-full h-48 md:h-64 lg:h-80 relative overflow-hidden">
          <img
            src={outlet.coverImage}
            alt={`${outlet.name} Cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <h1 className="text-3xl md:text-4xl font-bold text-white p-6 md:p-8">
              {outlet.name}
            </h1>
          </div>
        </div>
      )}

      <div className={`p-6 md:p-8 ${!outlet.coverImage ? "pt-8" : ""}`}>
        {!outlet.coverImage && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {outlet.name}
          </h1>
        )}

        {outlet.description && (
          <p className="text-gray-600 mb-8 leading-relaxed max-w-3xl text-sm md:text-base">
            {outlet.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {outlet.address && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Address</h3>
                <p className="text-sm text-gray-600">{outlet.address}</p>
              </div>
            </div>
          )}

          {outlet.openingHours && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Opening Hours</h3>
                <p className="text-sm text-gray-600">{outlet.openingHours}</p>
              </div>
            </div>
          )}

          {(outlet.phone || outlet.email) && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Contact</h3>
                {outlet.phone && <p className="text-sm text-gray-600">{outlet.phone}</p>}
                {outlet.email && <p className="text-sm text-gray-600">{outlet.email}</p>}
              </div>
            </div>
          )}

          {outlet.googleMapUrl && (
            <div className="flex items-start gap-3 lg:justify-end">
              <a
                href={outlet.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
