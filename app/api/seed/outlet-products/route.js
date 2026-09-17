import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Outlet from '@/models/Outlet';
import Category from '@/models/Category';
import MasterProduct from '@/models/MasterProduct';
import OutletProduct from '@/models/OutletProduct';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await connectDB();

    // 1. Create or find the "Dhaka" outlet
    let outlet = await Outlet.findOne({ slug: 'dhaka' });
    if (!outlet) {
      outlet = await Outlet.create({
        name: 'Dhaka',
        slug: 'dhaka',
        address: 'Dhaka, Bangladesh',
        phone: '+880-1700-000000',
        status: 'Active',
      });
    }

    // 2. Create categories
    const categoryNames = ['Women', 'Men', 'Kids', 'Teen'];
    const categories = {};

    for (const catName of categoryNames) {
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = await Category.create({
          name: catName,
          status: 'Active',
          outletId: outlet._id,
        });
      }
      categories[catName] = cat;
    }

    // 3. Define sample products
    const sampleProducts = [
      // Women (4 products)
      {
        name: 'Elegant Silk Blouse',
        slug: 'elegant-silk-blouse',
        description: 'A luxurious silk blouse with a flattering drape, perfect for both work and evening occasions.',
        brand: 'Mohona',
        product_type: 'Tops',
        product_images: [
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
        category: 'Women',
        price: 2490,
        discount_pct: 15,
        featured: true,
      },
      {
        name: 'Floral Maxi Dress',
        slug: 'floral-maxi-dress',
        description: 'A stunning floral print maxi dress made from breathable cotton, ideal for summer outings.',
        brand: 'Mohona',
        product_type: 'Dresses',
        product_images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
        category: 'Women',
        price: 3250,
        discount_pct: 20,
        featured: false,
      },
      {
        name: 'Classic Denim Jacket',
        slug: 'classic-denim-jacket-women',
        description: 'Timeless denim jacket with a modern fit. A wardrobe essential for layering.',
        brand: 'Mohona',
        product_type: 'Outerwear',
        product_images: [
          'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=800&fit=crop',
        category: 'Women',
        price: 3990,
        discount_pct: 0,
        featured: false,
      },
      {
        name: 'Embroidered Kurti',
        slug: 'embroidered-kurti',
        description: 'Beautifully embroidered kurti crafted from premium cotton with intricate threadwork.',
        brand: 'Mohona',
        product_type: 'Ethnic Wear',
        product_images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop',
        category: 'Women',
        price: 1890,
        discount_pct: 10,
        featured: true,
      },

      // Men (4 products)
      {
        name: 'Premium Slim Fit Shirt',
        slug: 'premium-slim-fit-shirt',
        description: 'A tailored slim fit shirt in breathable fabric, designed for the modern gentleman.',
        brand: 'Mohona',
        product_type: 'Shirts',
        product_images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
        category: 'Men',
        price: 1990,
        discount_pct: 0,
        featured: true,
      },
      {
        name: 'Casual Chino Pants',
        slug: 'casual-chino-pants',
        description: 'Comfortable stretch chino pants in a versatile neutral tone for everyday wear.',
        brand: 'Mohona',
        product_type: 'Pants',
        product_images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
        category: 'Men',
        price: 2450,
        discount_pct: 25,
        featured: false,
      },
      {
        name: 'Leather Bomber Jacket',
        slug: 'leather-bomber-jacket',
        description: 'Premium faux leather bomber jacket with quilted lining for a rugged yet refined look.',
        brand: 'Mohona',
        product_type: 'Outerwear',
        product_images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
        category: 'Men',
        price: 5490,
        discount_pct: 10,
        featured: false,
      },
      {
        name: 'Classic Polo T-Shirt',
        slug: 'classic-polo-tshirt',
        description: 'A timeless polo t-shirt in premium piqué cotton, available in multiple colors.',
        brand: 'Mohona',
        product_type: 'T-Shirts',
        product_images: [
          'https://images.unsplash.com/photo-1625910513413-5fc28e44362e?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1625910513413-5fc28e44362e?w=600&h=800&fit=crop',
        category: 'Men',
        price: 1290,
        discount_pct: 0,
        featured: false,
      },

      // Kids (4 products)
      {
        name: 'Rainbow Cotton Dress',
        slug: 'rainbow-cotton-dress',
        description: 'A colorful cotton dress with rainbow pattern, perfect for playful days.',
        brand: 'Mohona Kids',
        product_type: 'Dresses',
        product_images: [
          'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1543854589-fdd4d3ffc793?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop',
        category: 'Kids',
        price: 990,
        discount_pct: 30,
        featured: true,
      },
      {
        name: 'Denim Dungaree Set',
        slug: 'denim-dungaree-set',
        description: 'Adorable denim dungaree set with matching striped t-shirt for little adventurers.',
        brand: 'Mohona Kids',
        product_type: 'Sets',
        product_images: [
          'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop',
        category: 'Kids',
        price: 1490,
        discount_pct: 0,
        featured: false,
      },
      {
        name: 'Superhero Graphic Tee',
        slug: 'superhero-graphic-tee',
        description: 'Fun superhero themed graphic t-shirt made from soft organic cotton.',
        brand: 'Mohona Kids',
        product_type: 'T-Shirts',
        product_images: [
          'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop',
        category: 'Kids',
        price: 690,
        discount_pct: 15,
        featured: false,
      },
      {
        name: 'Cozy Hoodie Jacket',
        slug: 'cozy-hoodie-jacket-kids',
        description: 'Warm and cozy hoodie jacket with fleece lining for chilly days.',
        brand: 'Mohona Kids',
        product_type: 'Outerwear',
        product_images: [
          'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1434389677669-e08b4cda3a38?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop',
        category: 'Kids',
        price: 1690,
        discount_pct: 0,
        featured: false,
      },

      // Teen (4 products)
      {
        name: 'Streetwear Hoodie',
        slug: 'streetwear-hoodie',
        description: 'Trendy oversized hoodie with urban-style graphics for the fashion-forward teen.',
        brand: 'Mohona Teen',
        product_type: 'Hoodies',
        product_images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1578768079470-0a4f6d7c2532?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
        category: 'Teen',
        price: 1990,
        discount_pct: 20,
        featured: true,
      },
      {
        name: 'Ripped Skinny Jeans',
        slug: 'ripped-skinny-jeans',
        description: 'Stylish ripped skinny jeans with stretch fabric for a perfect fit and edgy look.',
        brand: 'Mohona Teen',
        product_type: 'Jeans',
        product_images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
        category: 'Teen',
        price: 2290,
        discount_pct: 0,
        featured: false,
      },
      {
        name: 'Graphic Print Sneakers',
        slug: 'graphic-print-sneakers',
        description: 'Bold graphic print sneakers that make a statement with every step.',
        brand: 'Mohona Teen',
        product_type: 'Footwear',
        product_images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
        category: 'Teen',
        price: 3490,
        discount_pct: 10,
        featured: false,
      },
      {
        name: 'Varsity Baseball Cap',
        slug: 'varsity-baseball-cap',
        description: 'Classic varsity-style baseball cap with embroidered logo, adjustable strap.',
        brand: 'Mohona Teen',
        product_type: 'Accessories',
        product_images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop',
        ],
        cover_image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=800&fit=crop',
        category: 'Teen',
        price: 590,
        discount_pct: 0,
        featured: false,
      },
    ];

    const createdOutletProducts = [];

    for (const prod of sampleProducts) {
      // Create or find the MasterProduct
      let masterProduct = await MasterProduct.findOne({ slug: prod.slug });
      if (!masterProduct) {
        masterProduct = await MasterProduct.create({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          brand: prod.brand,
          product_type: prod.product_type,
          product_images: prod.product_images,
          cover_image: prod.cover_image,
          status: 'Active',
        });
      }

      // Create the OutletProduct linking
      const category = categories[prod.category];
      let outletProduct = await OutletProduct.findOne({
        outletId: outlet._id,
        productId: masterProduct._id,
      });

      if (!outletProduct) {
        outletProduct = await OutletProduct.create({
          outletId: outlet._id,
          productId: masterProduct._id,
          categoryId: category._id,
          price: prod.price,
          discount_pct: prod.discount_pct || 0,
          stock_qty: Math.floor(Math.random() * 100) + 10,
          stock_status: 'In stock',
          available: true,
          status: 'Publish',
          featured: prod.featured || false,
        });
      }

      createdOutletProducts.push(outletProduct);
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdOutletProducts.length} outlet products across ${categoryNames.length} categories.`,
      data: {
        outlet: outlet.name,
        categories: categoryNames,
        productsCount: createdOutletProducts.length,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding outlet products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
