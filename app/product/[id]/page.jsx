'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/useCartStore';
import { useSidebarStore } from '../../../store/useSidebarStore';
import { ChevronRight, ChevronLeft, ShoppingCart, Copy, Store, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import ImageZoom from '../../../components/ImageZoom';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useSidebarStore((state) => state.openCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('N/A');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setSelectedUnit(data.data.available_units?.[0] || data.data.unit || 'N/A');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f18e6c]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <button 
          onClick={() => router.push('/shop')}
          className="bg-black text-white px-6 py-2 rounded-xl font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const modifiedProduct = {
      ...product,
      unit_price: product.unit_price,
      selected_unit: selectedUnit
    };
    addItem(modifiedProduct, 1);
    openCart();
  };

  const formattedId = product._id.slice(-6);
  const displaySku = `LSHR${formattedId}`;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs & Back */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-[12px] text-gray-500 mb-4 whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/shop/${product.category.toLowerCase()}`} className="hover:text-black transition-colors">{product.category} Collection</Link>
          <span>/</span>
          <span className="text-gray-500">{product.name}</span>
        </nav>
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-1 text-[14px] font-medium text-gray-800 hover:text-black transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Product Images */}
        <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="aspect-[3/4]">
              <ImageZoom src={product.image_url} alt={`${product.name} view ${idx}`} />
            </div>
          ))}
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-[35%] flex flex-col pt-2 pr-4 lg:pr-10">
          <h1 className="text-[22px] font-light text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-[15px] text-gray-900 mb-4">
            ৳ {product.unit_price.toFixed(2)} <span className="text-gray-500">+ VAT</span>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-8">
            <span>SKU: {displaySku}</span>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <Copy size={14} />
            </button>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="text-[14px] font-medium text-gray-900 mb-3">Size:</div>
            <div className="flex flex-wrap gap-3">
              {(product.available_units || [product.unit || 'N/A']).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={`px-3 py-1.5 min-w-[48px] text-[13px] border transition-all ${
                    selectedUnit === unit
                      ? 'border-yellow-400 bg-[#fefce8] text-gray-900'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#fde047] hover:bg-[#facc15] text-gray-900 font-medium py-3.5 transition-colors flex items-center justify-center gap-2 mb-8"
          >
            <ShoppingCart size={18} />
            Add to cart
          </button>

          {/* Info Texts */}
          <div className="space-y-4 mb-10">
            <p className="text-[12px] text-gray-600 leading-relaxed pr-8">
              Product colour may slightly vary, depending on your device's screen resolution.
            </p>
            <p className="text-[12px] text-gray-600">
              Free shipping at ৳8000 purchase.
            </p>
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-200">
            {/* Product Info */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setInfoExpanded(!infoExpanded)}
                className="w-full flex items-center justify-between py-4 text-[13px] font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Product Info
                {infoExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {infoExpanded && (
                <div className="pb-4 text-[13px] text-gray-600 leading-relaxed">
                  {product.description || 'Premium quality product designed for everyday elegance and comfort. Sourced from the best materials to ensure longevity and style.'}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="border-b border-gray-200">
              <button 
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="w-full flex items-center justify-between py-4 text-[13px] font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Product Details
                {detailsExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {detailsExpanded && (
                <div className="pb-6 pt-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start text-[13px]">
                      <div className="w-24 text-gray-900 font-medium">Color</div>
                      <div className="text-gray-600">{product.colors?.[0] || 'Gray'}</div>
                    </div>
                    <div className="flex items-start text-[13px]">
                      <div className="w-24 text-gray-900 font-medium">Size</div>
                      <div className="text-gray-600">{selectedUnit}</div>
                    </div>
                    <div className="flex items-start text-[13px]">
                      <div className="w-24 text-gray-900 font-medium">Fabric</div>
                      <div className="text-gray-600">Cotton</div>
                    </div>
                    <div className="flex items-start text-[13px]">
                      <div className="w-24 text-gray-900 font-medium">Wash Care</div>
                      <div className="text-gray-600">Wash separately in mild detergent</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
