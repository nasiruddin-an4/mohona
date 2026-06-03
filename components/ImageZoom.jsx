'use client';
import React, { useState, useRef } from 'react';

export default function ImageZoom({ src, alt }) {
  const [position, setPosition] = useState({ x: '50%', y: '50%' });
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      ref={imgRef}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover pointer-events-none"
        style={{
          transform: isHovered ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${position.x} ${position.y}`,
          transition: 'transform 0.3s ease-out'
        }}
      />
    </div>
  );
}
