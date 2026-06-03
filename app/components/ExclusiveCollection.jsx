import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCartStore } from "../../store/useCartStore";
import { useSidebarStore } from "../../store/useSidebarStore";

export default function ExclusiveCollection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { addItem } = useCartStore();
  const { openCart } = useSidebarStore();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openCart();
  };

  const products = [
    {
      id: 1,
      product_id: 1,
      name: "Star Women pants",
      category: "WOMEN",
      price: "$200.00",
      unit_price: 200,
      originalPrice: "$300.00",
      image: "/images/product-pants.png",
      discount: "15%",
      discountColor: "bg-[#2a2d96]", // Brand
      rating: 5,
    },
    {
      id: 2,
      product_id: 2,
      name: "Slightly jackets XL Cool",
      category: "WOMEN",
      price: "$350.00",
      unit_price: 350,
      originalPrice: null,
      image: "/images/product-jacket.png",
      discount: null,
      rating: 5,
    },
    {
      id: 3,
      product_id: 3,
      name: "Distracted XL bag",
      category: "Bag",
      price: "$1200.00",
      unit_price: 1200,
      originalPrice: "$1500.00",
      image: "/images/product-bag.png",
      discount: "15%",
      discountColor: "bg-slate-700", // Slate
      rating: 5,
    },
    {
      id: 4,
      name: "Distracted XL bag",
      category: "Bag",
      price: "$1200.00",
      originalPrice: "$1500.00",
      image: "/images/product-bag.png",
      discount: "15%",
      discountColor: "bg-slate-700", // Slate
      rating: 5,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Exclusive Collection
          </h2>
          <p className="text-gray-500 text-sm max-w-md">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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

      {/* Product Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
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
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Link href={`/product/${product.id}`} className="flex flex-col group block">
              {/* Image Container */}
              <div className="relative bg-[#f4f5f7] rounded-2xl p-8 flex items-center justify-center aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
                {/* Discount Badge */}
                {product.discount && (
                  <div
                    className={`absolute top-0 right-0 ${product.discountColor} text-white text-xs font-bold px-3 py-2 rounded-bl-xl z-10`}
                  >
                    {product.discount}
                  </div>
                )}
                {/* Add To Cart Hover Button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-[150%] opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 w-[85%] max-w-[260px]">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-slate-900 cursor-pointer text-white py-3 rounded-full text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-lg tracking-wide uppercase"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-4 px-1">
                <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center mb-1">
                  <span className="text-[#2a2d96] font-semibold text-[15px]">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-xs ml-2 font-medium">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
