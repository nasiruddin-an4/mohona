"use client";
import Hero from "./components/Hero";
import CollectionBanners from "./components/CollectionBanners";
import ExclusiveCollection from "./components/ExclusiveCollection";
import PromoBanner from "./components/PromoBanner";
import EverydayCasual from "./components/EverydayCasual";
import CategoryBento from "./components/CategoryBento";
import DailyDeals from "./components/DailyDeals";
import FeaturedOffers from "./components/FeaturedOffers";
import ConfidenceBar from "./components/ConfidenceBar";
import RecommendationCarousel from "./components/RecommendationCarousel";
import MoreToDiscover from "./components/MoreToDiscover";
import AboutSection from "./components/AboutSection";

export default function Home() {
  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

      {/* Collection Banners */}
      <CollectionBanners />

      {/* Exclusive Collection */}
      <ExclusiveCollection />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Everyday Casual Section */}
      <EverydayCasual />

      {/* Shop by Category Bento Grid */}
      {/* <CategoryBento /> */}

      {/* Daily Deals Carousel */}
      {/* <DailyDeals /> */}

      {/* Featured Offers Section */}
      <FeaturedOffers />

      {/* You Might Also Like Carousel */}
      {/* <RecommendationCarousel /> */}

    </div>
  );
}
