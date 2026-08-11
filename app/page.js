"use client";
import React, { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
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
import Magazine from "./components/Magazine";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <Categories />

      {/* Collection Banners */}
      {/* <CollectionBanners /> */}

      {/* Exclusive Collection */}
      <ExclusiveCollection products={products} loading={loading} />

      {/* Promo Banner */}
      {/* <PromoBanner /> */}

      {/* Everyday Casual Section */}
      <EverydayCasual products={products} loading={loading} />

      {/* Shop by Category Bento Grid */}
      {/* <CategoryBento /> */}

      {/* Daily Deals Carousel */}
      {/* <DailyDeals products={products} loading={loading} /> */}

      {/* Featured Offers Section */}
      {/* <FeaturedOffers products={products} loading={loading} /> */}

      {/* You Might Also Like Carousel */}
      {/* <RecommendationCarousel products={products} loading={loading} /> */}

      {/* Magazine Section */}
      <Magazine />

    </div>
  );
}
