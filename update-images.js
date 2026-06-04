require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Assuming you have MONGODB_URI in your .env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// Define minimal schema to update fields
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      let needsUpdate = false;
      const updates = {};

      if (product.cover_image && !product.cover_image.startsWith('/')) {
        updates.cover_image = `/productImg/${product.cover_image}`;
        needsUpdate = true;
      }

      if (product.product_images && Array.isArray(product.product_images)) {
        const newImages = product.product_images.map(img => 
          (img && !img.startsWith('/')) ? `/productImg/${img}` : img
        );
        
        // check if changed
        if (JSON.stringify(newImages) !== JSON.stringify(product.product_images)) {
          updates.product_images = newImages;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await Product.updateOne({ _id: product._id }, { $set: updates });
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating images:", err);
    process.exit(1);
  }
}

updateImages();
