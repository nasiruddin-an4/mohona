import React, { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function PromoBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: "/images/promo_slider_1.png",
      alt: "Luxury Wallet Collection"
    },
    {
      id: 2,
      image: "/images/promo_slider_2.png",
      alt: "Luxury Timepiece Collection"
    },
    {
      id: 3,
      image: "/images/promo_slider_3.png",
      alt: "Signature Fragrance Collection"
    }
  ];

  return (
    <div className="w-full mt-12 mb-16 relative group">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 4000,
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
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[#e6e2db]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={slide.id === 1}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        ref={nextRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
