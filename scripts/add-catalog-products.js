const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true },
  unit_price: { type: Number, required: true },
  selling_price: { type: Number, default: 0 },
  image_url: { type: String, default: '' },
  stock_status: { type: String, default: 'In stock' },
  status: { type: String, default: 'Publish' },
  discount_pct: { type: Number, default: null }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const newProducts = [
  // Saree
  { img: "100_Gypsum_Items.png", name: "Gypsum Items Saree", category: "Saree", price: 3500 }, 
  { img: "101_Glass_Art.png", name: "Glass Art Saree", category: "Saree", price: 4200, discount: 10 },
  { img: "102_Hand_Made_Candle.png", name: "Hand Made Candle Saree", category: "Saree", price: 2800 },
  { img: "103_Cane_Items.png", name: "Cane Items Saree", category: "Saree", price: 3200 },
  { img: "104_Shitolpati_Handicraft.png", name: "Shitolpati Saree", category: "Saree", price: 4800, discount: 15 },
  { img: "105_Macrame_Items.png", name: "Macrame Items Saree", category: "Saree", price: 2500 },
  
  // Home Decor
  { img: "89_Home_Decor_Section.png", name: "Assorted Home Decor", category: "Home Decor", price: 1200 },
  { img: "90_Buoy_Decor.png", name: "Buoy Decor", category: "Home Decor", price: 850 },
  { img: "91_Customized_Flower_Decor_1.png", name: "Customized Flower Decor", category: "Home Decor", price: 1600, discount: 5 },
  { img: "92_Customized_Flower_Decor_2.png", name: "Flower Decor Planter", category: "Home Decor", price: 950 },
  { img: "93_Wall_Hanging_Wooden_Decor.png", name: "Wall Hanging Wooden Decor", category: "Home Decor", price: 2200 },
  { img: "94_Elegant_Colorful_Table_Charm_Set_1.png", name: "Elegant Table Charm Set", category: "Home Decor", price: 3400, discount: 20 },
  
  // Clothing & Accessories
  { img: "113_Clutches.png", name: "Premium Clutches", category: "Clothing & Accessories", price: 1800 },
  { img: "114_Jewellery_Collection.png", name: "Jewellery Collection", category: "Clothing & Accessories", price: 4500, discount: 25 },
  { img: "115_Ladies_Accessories.png", name: "Ladies Accessories", category: "Clothing & Accessories", price: 900 },
  { img: "116_Salowar_Kamiz_1.png", name: "Salowar Kamiz", category: "Clothing & Accessories", price: 2600 },
  { img: "117_Salowar_Kamiz_2.png", name: "Salowar Kamiz Premium", category: "Clothing & Accessories", price: 3900, discount: 10 },
  { img: "118_Womens_Shawl.png", name: "Women's Shawl", category: "Clothing & Accessories", price: 1500 },

  // Handicrafts & Pottery
  { img: "95_Wooden_Craft_1.png", name: "Wooden Craft", category: "Handicrafts & Pottery", price: 750 },
  { img: "96_Wooden_Craft_2.png", name: "Painted Wooden Box", category: "Handicrafts & Pottery", price: 1200 },
  { img: "97_Painting_Items.png", name: "Painting Items", category: "Handicrafts & Pottery", price: 500 },
  { img: "98_Painted_Pottery_Item.png", name: "Painted Pottery Item", category: "Handicrafts & Pottery", price: 1400, discount: 10 },
  { img: "99_Unique_Handmade_Pottery_and_Decorative_Crafts.png", name: "Handmade Decorative Pottery", category: "Handicrafts & Pottery", price: 2800 },
  { img: "122_Nakshi_Khanta.png", name: "Nakshi Khanta", category: "Handicrafts & Pottery", price: 4500, discount: 15 },

  // Traditional Wear
  { img: "108_Saree_and_Womens_Accessories_Section.png", name: "Saree & Women's Accessories", category: "Traditional Wear", price: 5500 },
  { img: "109_Jamdani_Saree.png", name: "Jamdani Saree", category: "Traditional Wear", price: 8500, discount: 10 },
  { img: "110_Monipuri_Weaves_and_Katha_Stitch.png", name: "Monipuri Weaves", category: "Traditional Wear", price: 6200 },
  { img: "111_Moslin_Saree.png", name: "Moslin Saree", category: "Traditional Wear", price: 12000, discount: 20 },
  { img: "112_Tat_and_Batik_Saree.png", name: "Tat & Batik Saree", category: "Traditional Wear", price: 3200 },
  { img: "120_Traditional_Gents_Items.png", name: "Traditional Gents Items", category: "Traditional Wear", price: 2400 },

  // Lifestyle & Groceries
  { img: "87_Cover.png", name: "Premium Ghee & Honey", category: "Lifestyle & Groceries", price: 1100, discount: 5 },
  { img: "88_Index.png", name: "Spices & Mustard Oil", category: "Lifestyle & Groceries", price: 650 },
  { img: "106_Handwoven_Rug.png", name: "Handwoven Rug", category: "Lifestyle & Groceries", price: 3100 },
  { img: "121_Hand_Blocked_Bedsheet_Collection.png", name: "Bedsheet Collection", category: "Lifestyle & Groceries", price: 2900, discount: 15 },
  { img: "123_Indoor_Plants_Section.png", name: "Indoor Plants Combo", category: "Lifestyle & Groceries", price: 1300 },
  { img: "124_Indoor_Plants.png", name: "Indoor Plants Collection", category: "Lifestyle & Groceries", price: 850 },
];

async function insertProducts() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env");
    process.exit(1);
  }

  try {
    const opts = { dbName: process.env.MONGODB_DB || 'mohona_db' };
    await mongoose.connect(MONGODB_URI, opts);
    console.log("Connected to MongoDB database: " + opts.dbName);

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    for (let item of newProducts) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const newProduct = new Product({
        name: item.name,
        slug: slug,
        category: item.category,
        unit_price: item.price,
        selling_price: item.price,
        image_url: `/catelogImg/${item.img}`,
        cover_image: `/catelogImg/${item.img}`,
        product_images: [`/catelogImg/${item.img}`],
        status: 'Publish',
        stock_status: 'In stock',
        discount_pct: item.discount || null
      });
      await newProduct.save();
      console.log(`Inserted ${item.name} with price ${item.price}`);
    }

    console.log(`Inserted all ${newProducts.length} balanced products.`);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting products:", err);
    process.exit(1);
  }
}

insertProducts();
