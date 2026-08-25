// Using Node's native --env-file flag
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'mohonaEcommerceDB';

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function categorize(name) {
  const Saree = ["শাড়ি"];
  const Clothing = ["পাঞ্জাবি", "লুঙ্গী", "থ্রি", "টু"];
  const HomeDecor = ["Painting", "টব", "রানার", "কভার", "বেড সিট", "শতরঞ্জি", "শীতলপাটি"];
  const Handicrafts = ["বক্স", "বেতের", "রিকশা", "লন্ডি ঝুড়ি", "মেকরাম", "টিস্যু"];
  
  for (let s of Saree) if (name.includes(s)) return "শাড়ি (Saree)";
  for (let c of Clothing) if (name.includes(c)) return "পোশাক (Clothing)";
  for (let h of HomeDecor) if (name.includes(h)) return "হোম ডেকোর (Home Decor)";
  for (let c of Handicrafts) if (name.includes(c)) return "হস্তশিল্প (Handicrafts)";
  
  return "অন্যান্য (Others)";
}

async function updateCategories() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log("Connected to MongoDB.");

    const products = await Product.find({});
    let count = 0;
    
    for (let product of products) {
      if (product.name) {
        const newCat = categorize(product.name);
        if (newCat !== product.category) {
          await Product.updateOne({ _id: product._id }, { $set: { category: newCat } });
          count++;
          console.log(`Updated: "${product.name}" -> Category: "${newCat}"`);
        }
      }
    }
    
    console.log(`Successfully categorized ${count} products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateCategories();
