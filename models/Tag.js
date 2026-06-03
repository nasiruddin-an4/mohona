import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
