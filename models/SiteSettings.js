import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'singleton' },
    storeName: { type: String, default: 'Mohona by CGFWA' },
    phone: { type: String, default: '01769-441085' },
    phoneAlt: { type: String, default: '+880 1769-441085' },
    email: { type: String, default: 'cgfwatreasurer@gmail.com' },
    address: { type: String, default: 'দোকান # ১,২ নেভী মার্কেট, খিলক্ষেত, ঢাকা-১২২৯, Dhaka, Bangladesh' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
