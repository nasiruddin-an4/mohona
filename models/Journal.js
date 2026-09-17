import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the journal'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the journal'],
  },
  author: {
    type: String,
    default: 'Admin',
  },
  image_url: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Draft', 'Publish'],
    default: 'Draft',
  },
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Avoid OverwriteModelError in Next.js development
const Journal = mongoose.models.Journal || mongoose.model('Journal', journalSchema);

export default Journal;
