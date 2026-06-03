import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CollectionBanners() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Women's Collection Banner */}
        <div className="relative bg-[#f4f4f4] rounded-xl overflow-hidden h-[260px] md:h-[320px] flex items-center group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/womens-collection.png"
              alt="Women's Collection"
              fill
              className="object-cover object-right"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 pl-8 md:pl-12 w-[60%]">
            <p className="text-gray-500 font-medium text-sm md:text-base mb-2">
              Save up to <span className="text-[#2a2d96]">50%off</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Women's collection
            </h2>
            <Link
              href="/shop/women"
              className="inline-flex items-center gap-2 bg-[#2a2d96] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm tracking-wide"
            >
              SHOP NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Men's Collection Banner */}
        <div className="relative bg-[#f4f4f4] rounded-xl overflow-hidden h-[260px] md:h-[320px] flex items-center group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/mens-collection.png"
              alt="Men's Collection"
              fill
              className="object-cover object-right"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 pl-8 md:pl-12 w-[60%]">
            <p className="text-gray-500 font-medium text-sm md:text-base mb-2">
              Save up to <span className="text-[#2a2d96]">50%off</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Men's collection
            </h2>
            <Link
              href="/shop/men"
              className="inline-flex items-center gap-2 bg-[#2a2d96] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm tracking-wide"
            >
              SHOP NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Kid's Collection Banner */}
        <div className="relative bg-[#f4f4f4] rounded-xl overflow-hidden h-[260px] md:h-[320px] flex items-center group">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/kids-collection.png"
              alt="Kid's Collection"
              fill
              className="object-cover object-right"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 pl-8 md:pl-12 w-[65%]">
            <p className="text-gray-500 font-medium text-sm md:text-base mb-2">
              Save up to <span className="text-[#2a2d96]">50%off</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Kid's collection
            </h2>
            <Link
              href="/shop/kids"
              className="inline-flex items-center gap-2 bg-[#2a2d96] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-md transition-colors text-sm tracking-wide"
            >
              SHOP NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
