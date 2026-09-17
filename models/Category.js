import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    description: { type: String },
    subcategories: [SubcategorySchema],
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      default: null, // null = global/unassigned (legacy records)
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
