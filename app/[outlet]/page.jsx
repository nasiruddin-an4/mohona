"use client";
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ExclusiveCollection from "../components/ExclusiveCollection";
import EverydayCasual from "../components/EverydayCasual";
import Magazine from "../components/Magazine";
import OutletInfo from "../components/OutletInfo";
import { useParams } from "next/navigation";

export default function OutletHome() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [outletInfo, setOutletInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/public-outlets/${params.outlet}/products`);
        const data = await response.json();
        if (data.success) {
          // Format OutletProducts to match the frontend expectations (it expects .name, .category, .unit_price, .image_url etc)
          const formatted = data.data.map(op => ({
            _id: op._id,
            slug: op.productId?.slug || op._id,
            name: op.productId?.name,
            category: op.categoryId?.name,
            unit_price: op.price,
            image_url: op.productId?.cover_image || op.productId?.image_url,
            product_images: op.productId?.images || [],
            discount_price: op.compare_at_price,
            stock_status: op.stock_status,
            outletId: op.outletId?._id || op.outletId,
            outletSlug: op.outletId?.slug || params.outlet
          }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Error fetching outlet products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchOutletInfo = async () => {
      try {
        const response = await fetch(`/api/public-outlets/${params.outlet}`);
        const data = await response.json();
        if (data.success) {
          setOutletInfo(data.data);
        }
      } catch (error) {
        console.error("Error fetching outlet info:", error);
      }
    };

    if (params.outlet) {
      fetchProducts();
      fetchOutletInfo();
    }
  }, [params.outlet]);

  return (
    <div className="space-y-4 container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <OutletInfo outlet={outletInfo} />
      <Hero />
      <Categories outletSlug={params.outlet} />
      <ExclusiveCollection products={products} loading={loading} outletSlug={params.outlet} />
      <EverydayCasual products={products} loading={loading} outletSlug={params.outlet} />
      <Magazine />
    </div>
  );
}
