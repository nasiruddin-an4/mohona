'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/useCartStore';
import { useSidebarStore } from '../../../store/useSidebarStore';
import { ChevronRight, ChevronLeft, ShoppingCart, Copy, Store, ChevronDown, ChevronUp, Check, Star } from 'lucide-react';
import Link from 'next/link';
import ImageZoom from '../../../components/ImageZoom';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useSidebarStore((state) => state.openCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('N/A');
  const [copied, setCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleCopySku = () => {
    if (product) {
      const formattedId = product._id.slice(-6);
      const sku = `LSHR${formattedId}`;
      navigator.clipboard.writeText(sku);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewText.trim() || !reviewRating) return;
    
    setSubmittingReview(true);
    setReviewSuccess(false);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product._id,
          user_name: reviewName,
          review_text: reviewText,
          rating: reviewRating,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setReviewName('');
        setReviewText('');
        setReviewRating(5);
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setSelectedUnit(data.data.available_units?.[0] || data.data.unit || 'N/A');
          
          // Fetch reviews
          if (data.data._id) {
            const reviewRes = await fetch(`/api/reviews?product_id=${data.data._id}`);
            const reviewData = await reviewRes.json();
            if (reviewData.success) {
              setReviews(reviewData.data);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

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

  const displayImages = product.product_images?.length > 0 
    ? product.product_images 
    : (product.image_url ? [product.image_url] : []);

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
        <div className="w-full lg:w-[50%] flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible hide-scrollbar w-full md:w-20 shrink-0">
              {displayImages.map((imgUrl, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-[3/4] flex-shrink-0 w-16 md:w-full border-2 overflow-hidden ${selectedImage === idx ? 'border-gray-900' : 'border-transparent hover:border-gray-300'} transition-colors`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div className="order-1 md:order-2 flex-grow aspect-[4/5] md:aspect-auto md:h-[450px] lg:h-[500px] bg-gray-50 border border-gray-100 overflow-hidden relative">
             {displayImages.length > 0 ? (
               <ImageZoom src={displayImages[selectedImage] || displayImages[0]} alt={`${product.name} main view`} />
             ) : (
               <div className="flex items-center justify-center w-full h-full text-gray-400">No Image Available</div>
             )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-[50%] flex flex-col pt-2 lg:pl-10 pr-4 lg:pr-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <div className="text-sm text-gray-500 font-medium mb-4">Product Code: {displaySku}</div>
          
          <div className="text-[15px] text-gray-900 mb-4">
            ৳ {product.unit_price.toFixed(2)} <span className="text-gray-500">+ VAT</span>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-8">
            <span>SKU: {displaySku}</span>
            <button 
              onClick={handleCopySku}
              className={`${copied ? 'text-green-600' : 'text-gray-400 hover:text-gray-900'} transition-colors`}
              title="Copy SKU"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
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

          {/* Contact for Order */}
          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-[#fde047] hover:bg-[#facc15] text-gray-900 font-medium py-3.5 transition-colors flex items-center justify-center gap-2 mb-8"
          >
            Contact for order
          </button>

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
                  {product.description || 'No description available for this product.'}
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
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-start text-[13px]">
                        <div className="w-24 text-gray-900 font-medium">Color</div>
                        <div className="text-gray-600">{product.colors.join(', ')}</div>
                      </div>
                    )}
                    {selectedUnit && selectedUnit !== 'N/A' && (
                      <div className="flex items-start text-[13px]">
                        <div className="w-24 text-gray-900 font-medium">Size</div>
                        <div className="text-gray-600">{selectedUnit}</div>
                      </div>
                    )}
                    {product.fabric && (
                      <div className="flex items-start text-[13px]">
                        <div className="w-24 text-gray-900 font-medium">Fabric</div>
                        <div className="text-gray-600">{product.fabric}</div>
                      </div>
                    )}
                    {product.wash_care && (
                      <div className="flex items-start text-[13px]">
                        <div className="w-24 text-gray-900 font-medium">Wash Care</div>
                        <div className="text-gray-600">{product.wash_care}</div>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex items-start text-[13px]">
                        <div className="w-24 text-gray-900 font-medium">Material</div>
                        <div className="text-gray-600">{product.material}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
          
        </div>
      </div>

      {/* Separated Product Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Reviews List */}
          <div className="w-full lg:w-3/5">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-medium text-gray-900 text-[14px]">{review.user_name}</span>
                      <span className="text-gray-400 text-[12px]">• {new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-[14px] text-gray-700 leading-relaxed">{review.review_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[14px] text-gray-500 italic p-6 bg-gray-50 rounded-xl">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>

          {/* Right: Write Review Form */}
          <div className="w-full lg:w-2/5">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl">
              <h3 className="text-[16px] font-bold text-gray-900 mb-6">Write a Review</h3>
              {reviewSuccess && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 text-[14px] rounded-xl border border-green-100">
                  Thank you! Your review has been submitted successfully.
                </div>
              )}
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[14px] font-medium text-gray-900 mb-2">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={24} 
                          className={star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-900 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-gray-900 mb-2">Review</label>
                  <textarea 
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                    rows="5"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={submittingReview}
                  className="bg-black hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl text-[14px] transition-colors disabled:opacity-70 mt-2"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
