import mongoose from 'mongoose';

/**
 * DB-driven admin User model.
 * role:
 *   SUPER_ADMIN  → outletId = null (access to everything)
 *   OUTLET_MANAGER → outletId = <Outlet._id>
 *   OUTLET_STAFF   → outletId = <Outlet._id>
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      select: false, // never return password in queries by default
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'OUTLET_MANAGER', 'OUTLET_STAFF'],
      default: 'OUTLET_STAFF',
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    lastActive: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
