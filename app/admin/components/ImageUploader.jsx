'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

export default function ImageUploader({ 
  value = '', 
  onFileSelect,
  label = 'Product Image',
  className = '',
  acceptType = 'image',
  maxSizeMB = 10,
  helperText = ''
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // The displayed media is either the local preview or the existing DB url
  const displayUrl = previewUrl || value;

  const handleFile = (file) => {
    setError('');
    if (!file.type.startsWith(`${acceptType}/`)) {
      setError(`Please select a ${acceptType} file`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create local preview (no upload yet)
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Pass the raw file back to the parent
    onFileSelect(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-bold text-gray-700">{label} *</label>

      {displayUrl ? (
        /* ── Preview ── */
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 group shadow-sm">
          {acceptType === 'video' ? (
            <video src={displayUrl} className="w-full h-full object-cover" controls />
          ) : (
            <img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-white transition-colors shadow-lg pointer-events-auto"
            >
              <X size={18} />
            </button>
          </div>
          {previewUrl && (
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Pending upload
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
            ${dragOver 
              ? 'border-[#0f8b80] bg-[#e2f5f3]/30 scale-[1.01]' 
              : 'border-gray-200 hover:border-[#0f8b80]/50 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#e2f5f3] flex items-center justify-center">
              <Upload size={22} className="text-[#0f8b80]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Drop your {acceptType} here, or <span className="text-[#0f8b80]">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{helperText || `Max size ${maxSizeMB}MB`}</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={`${acceptType}/*`}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}
