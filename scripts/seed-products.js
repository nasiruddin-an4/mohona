// Using Node's native --env-file flag
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');
const slugify = require('slugify');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const IMAGE_DIR = path.join(__dirname, '../public/productImg');

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

// Product Schema definition
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function parseFilename(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const name = nameWithoutExt.replace(/_/g, ' ');
  
  // Replace Bengali digits to find the price
  const engName = nameWithoutExt.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
  const numbers = engName.match(/\d+/g);
  let price = 0;
  if (numbers && numbers.length > 0) {
    price = parseInt(numbers[numbers.length - 1], 10);
  }
  
  return { name, price };
}

async function uploadToImageKit(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  return new Promise((resolve, reject) => {
    imagekit.upload({
      file: fileContent, //required
      fileName: fileName,   //required
      folder: '/products'
    }, function(error, result) {
      if(error) reject(error);
      else resolve(result.url);
    });
  });
}

async function seedProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || 'mohonaEcommerceDB' });
    console.log("Connected to MongoDB.");

    console.log("Clearing existing products...");
    await Product.deleteMany({});
    console.log("Existing products cleared.");

    const files = fs.readdirSync(IMAGE_DIR).filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    console.log(`Found ${files.length} images to process.`);

    let successCount = 0;

    for (let file of files) {
      const { name, price } = parseFilename(file);
      const filePath = path.join(IMAGE_DIR, file);
      
      console.log(`Processing: ${name} (Price: ${price})`);
      
      try {
        const imageUrl = await uploadToImageKit(filePath, file);
        
        // Generate a random-looking slug from the filename to avoid collisions with Bengali chars
        const baseSlug = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'product';
        const slug = baseSlug + '-' + Date.now();

        const newProduct = new Product({
          name: name,
          slug: slug,
          description: name,
          category: 'All Categories',
          unit_price: price,
          selling_price: price,
          unit: 'piece',
          available_units: ['piece'],
          colors: [],
          image_url: imageUrl,
          cover_image: imageUrl,
          product_images: [imageUrl],
          stock_status: 'In stock',
          status: 'Publish',
          stock_qty: 100,
          brand: 'Mohona',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await newProduct.save();
        successCount++;
        console.log(`  -> Saved successfully: ${imageUrl}`);
      } catch (uploadErr) {
        console.error(`  -> Failed to upload or save ${file}:`, uploadErr);
      }
    }

    console.log(`\nSeed complete! Successfully added ${successCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seedProducts();
