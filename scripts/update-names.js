// Using Node's native --env-file flag
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'mohonaEcommerceDB';

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function cleanName(name) {
  // Remove numbers (English and Bengali), hyphens, and words like 'tk', 'টাকা', 'পিচ', 'PICS'
  // 1. Remove specific words
  let cleaned = name.replace(/(tk|টাকা|পিচ|pics|TK)/gi, '');
  // 2. Remove all numbers (both Bengali and English) and dashes
  cleaned = cleaned.replace(/[0-9০-৯-]+/g, '');
  // 3. Clean up extra spaces
  return cleaned.trim().replace(/\s+/g, ' ');
}

async function updateNames() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    let count = 0;
    
    for (let product of products) {
      if (product.name) {
        const newName = cleanName(product.name);
        if (newName !== product.name) {
          await Product.updateOne({ _id: product._id }, { $set: { name: newName } });
          count++;
          console.log(`Updated: "${product.name}" -> "${newName}"`);
        }
      }
    }
    
    console.log(`Successfully updated ${count} product names.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateNames();
