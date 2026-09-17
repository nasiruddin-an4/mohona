import mongoose from 'mongoose';

/**
 * MasterProduct — shared/global product data.
 * A master product can be linked to multiple outlets via OutletProduct.
 */
const MasterProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      default: '',
    },
    sku: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    cover_image: {
      type: String,
      default: '',
    },
    product_images: {
      type: [String],
      default: [],
    },
    video_url: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    product_type: {
      type: String,
      default: '',
    },
    fabric: {
      type: String,
      default: '',
    },
    wash_care: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '',
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
    variants: [
      {
        sku: String,
        variant_id: String,
        image: String,
        color: String,
        size: String,
        visible: String,
        status: { type: String, default: 'Active' },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.MasterProduct || mongoose.model('MasterProduct', MasterProductSchema);
