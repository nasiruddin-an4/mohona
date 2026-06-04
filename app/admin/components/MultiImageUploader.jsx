'use client';
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function MultiImageUploader({ 
  existingUrls = [], 
  onFilesSelect,
  onUrlsChange,
  label = 'Product Images',
  className = '',
  acceptType = 'image',
  maxSizeMB = 10,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    setError('');
    let validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith(`${acceptType}/`)) {
        setError(`Please select only ${acceptType} files`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      validFiles.push(file);
    }

    const newPending = [...pendingFiles, ...validFiles];
    setPendingFiles(newPending);
    onFilesSelect(newPending);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };

  const removePending = (index) => {
    const updated = pendingFiles.filter((_, i) => i !== index);
    setPendingFiles(updated);
    onFilesSelect(updated);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExisting = (index) => {
    const updated = existingUrls.filter((_, i) => i !== index);
    onUrlsChange(updated);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-bold text-gray-700">{label}</label>

      <div className="flex flex-wrap gap-4">
        {/* Existing URLs */}
        {existingUrls.map((url, index) => (
          <div key={`exist-${index}`} className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
            <img src={url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => removeExisting(index)} className="bg-white text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg pointer-events-auto"><X size={16}/></button>
            </div>
          </div>
        ))}

        {/* Pending Files */}
        {pendingFiles.map((file, index) => (
          <div key={`pending-${index}`} className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-[#0f8b80] bg-[#e2f5f3] group">
            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <button type="button" onClick={() => removePending(index)} className="bg-white text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg pointer-events-auto"><X size={16}/></button>
            </div>
            <div className="absolute bottom-1 left-1 right-1 pointer-events-none text-center">
              <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Pending</span>
            </div>
          </div>
        ))}

        {/* Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative w-32 h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragOver ? 'border-[#0f8b80] bg-[#e2f5f3]/30 scale-[1.02]' : 'border-gray-300 hover:border-[#0f8b80]/50 hover:bg-gray-50'}`}
        >
          <Upload size={20} className={`mb-2 ${dragOver ? 'text-[#0f8b80]' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500 font-medium">Add Image</span>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept={`${acceptType}/*`} onChange={handleFileSelect} className="hidden" />
      {error && <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg inline-block">{error}</p>}
    </div>
  );
}
