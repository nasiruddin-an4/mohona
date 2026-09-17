import mongoose from 'mongoose';

/**
 * OutletProduct — outlet-specific override of a MasterProduct.
 * Each outlet can have its own price, stock, availability, and category.
 *
 * The unique compound index on [outletId + productId] ensures a master product
 * can only be listed once per outlet.
 */
const OutletProductSchema = new mongoose.Schema(
  {
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      required: [true, 'Outlet is required'],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterProduct',
      required: [true, 'Master product reference is required'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    discount_pct: {
      type: Number,
      default: null,
    },
    stock_qty: {
      type: Number,
      default: 0,
    },
    stock_status: {
      type: String,
      enum: ['In stock', 'Out of stock', 'Limited'],
      default: 'In stock',
    },
    available: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Publish', 'Draft'],
      default: 'Publish',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    discounts: [
      {
        title: String,
        price: String,
        duration: String,
      },
    ],
  },
  { timestamps: true }
);

// Ensure a master product only appears once per outlet
OutletProductSchema.index({ outletId: 1, productId: 1 }, { unique: true });

export default mongoose.models.OutletProduct || mongoose.model('OutletProduct', OutletProductSchema);
