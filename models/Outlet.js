import mongoose from 'mongoose';

const OutletSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide outlet name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    openingHours: {
      type: String,
      default: '',
    },
    googleMapUrl: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Outlet || mongoose.model('Outlet', OutletSchema);
