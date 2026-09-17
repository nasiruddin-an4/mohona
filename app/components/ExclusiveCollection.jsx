import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ExclusiveCollection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/featured-outlet-products');
        const data = await response.json();
        if (data.success) {
          setDisplayProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Exclusive Collection
          </h2>
          <p className="text-gray-500 text-sm max-w-md">
            Discover our premium, hand-picked selection of top-tier products curated exclusively for you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button ref={prevRef} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <button ref={nextRef} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#2a2d96]" size={40} />
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={displayProducts.length > 4}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {displayProducts.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <Link href={`/${product.outletSlug || 'dhaka'}/product/${product.productId?.slug || product.slug || product._id || product.id}`} className="flex flex-col group block">
                {/* Image Container */}
                <div className="relative bg-[#f4f5f7] rounded-2xl flex items-center justify-center aspect-square overflow-hidden">
                  <img
                    src={(product.productId?.product_images?.length > 0 ? product.productId.product_images[0] : null) || (product.product_images?.length > 0 ? product.product_images[0] : null) || (product.productId?.cover_image && !product.productId.cover_image.startsWith('/') && !product.productId.cover_image.startsWith('http') ? `/images/${product.productId.cover_image}` : product.productId?.cover_image) || (product.cover_image && !product.cover_image.startsWith('/') && !product.cover_image.startsWith('http') ? `/images/${product.cover_image}` : product.cover_image) || product.productId?.image_url || product.image_url || "/images/placeholder.jpg"}
                    alt={product.productId?.name || product.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Discount Badge */}
                  {product.discount_pct > 0 && (
                    <div
                      className={`absolute top-0 right-0 bg-[#2a2d96] text-white text-xs font-bold px-3 py-2 rounded-bl-xl z-10`}
                    >
                      {product.discount_pct}% OFF
                    </div>
                  )}
                  {/* View Details Hover Button */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-[150%] opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 w-[85%] max-w-[260px]">
                    <span
                      className="flex justify-center w-full bg-slate-900 cursor-pointer text-white py-3 rounded-full text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-lg tracking-wide uppercase"
                    >
                      View Details
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-grow mt-4 px-1">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">Code: LSHR{String(product.product_id || product.id || ((product.productId?._id || product._id) ? (product.productId?._id || product._id).toString().slice(-4) : '0000')).padStart(4, '0')}</div>

                  <h3 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1 group-hover:text-[#2a2d96] transition-colors">{product.productId?.name || product.name}</h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-gray-700">4.9</span>
                    <span className="text-[11px] text-gray-400 ml-1">(24)</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-2">
                    <div className="flex flex-col">
                      {product.discount_pct > 0 ? (
                        <>
                          <span className="text-[11px] text-gray-400 line-through mb-0.5">৳{product.price || product.unit_price}</span>
                          <span className="font-extrabold text-[#2a2d96] text-lg leading-none">৳{product.price || product.selling_price || product.unit_price}</span>
                        </>
                      ) : (
                        <span className="font-extrabold text-[#2a2d96] text-lg leading-none">৳{product.price || product.selling_price || product.unit_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
