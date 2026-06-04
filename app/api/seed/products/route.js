import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    
    // Read the mock_products.json file
    const filePath = path.join(process.cwd(), 'data', 'mock_products.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const mockData = JSON.parse(fileContents);
    
    // Clear existing products (as requested in the plan)
    await Product.deleteMany({});
    
    const productsToInsert = [];
    
    for (const category of mockData.categories) {
      for (const prod of category.products) {
        // Map variants
        const mappedVariants = [];
        if (prod.variants) {
          // Just storing the raw variants string for simplicity, or we could map them to the schema structure.
          // The Product schema expects: [{ sku, variant_id, image, color, size, visible, status }]
          // Since the mock data has { type: "Size", values: [...] }, this is a bit different.
          // For now, let's keep variants empty or adapt if necessary, but the schema doesn't match this directly.
          // Actually, we can add a 'options' field or just ignore variants if not heavily used, or store them as tags.
        }

        let discountPct = null;
        if (prod.discount) {
           if (prod.discount.type === 'Percentage') {
             discountPct = prod.discount.value;
           } else if (prod.discount.type === 'Flat') {
             // Calculate percentage from flat discount
             discountPct = Math.round((prod.discount.value / prod.basic_information.unit_price) * 100);
           }
        }

        productsToInsert.push({
          name: prod.basic_information.product_name,
          slug: prod.basic_information.slug,
          category: prod.basic_information.category,
          product_type: prod.basic_information.product_type,
          brand: prod.basic_information.brand,
          stock_qty: prod.basic_information.stock_quantity,
          stock_status: prod.basic_information.stock_status,
          unit_price: prod.basic_information.unit_price,
          selling_price: prod.basic_information.selling_price,
          description: prod.basic_information.short_description,
          cover_image: prod.media.cover_photo ? (prod.media.cover_photo.startsWith('/') ? prod.media.cover_photo : `/productImg/${prod.media.cover_photo}`) : null,
          product_images: prod.media.product_photos ? prod.media.product_photos.map(p => p.startsWith('/') ? p : `/productImg/${p}`) : [],
          // video_url is explicitly ignored as per user request
          tags: prod.tags || [],
          discount_pct: discountPct
        });
      }
    }
    
    // Insert all products
    const inserted = await Product.insertMany(productsToInsert);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${inserted.length} products.`,
      data: inserted 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
