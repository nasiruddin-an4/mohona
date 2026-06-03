import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify product category'],
    },
    unit_price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    unit: {
      type: String,
      default: 'piece',
    },
    available_units: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    image_url: {
      type: String,
      required: [true, 'Please provide a product image'],
    },
    stock_status: {
      type: String,
      enum: ['In stock', 'Out of stock', 'Limited'],
      default: 'In stock',
    },
    stock_qty: {
      type: Number,
      required: [true, 'Please provide product stock quantity'],
      default: 0,
    },
    discount_pct: {
      type: Number,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    variants: [{
      sku: String,
      variant_id: String,
      image: String,
      color: String,
      size: String,
      visible: String,
      status: { type: String, default: 'Active' }
    }],
    discounts: [{
      title: String,
      price: String,
      duration: String
    }],
    cover_image: String,
    product_images: [String],
    video_url: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
