import mongoose from 'mongoose';

/**
 * AuditLog tracks every write action taken by any admin user.
 * Super Admin can view all logs; Outlet Manager sees own outlet's logs.
 */
const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      default: '',
    },
    userRole: {
      type: String,
      default: '',
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      default: null,
    },
    action: {
      type: String,
      required: true,
      // e.g. CREATE_PRODUCT, UPDATE_PRICE, DELETE_CATEGORY, UPDATE_STOCK
    },
    entity: {
      type: String,
      required: true,
      // e.g. 'Product', 'Category', 'OutletProduct', 'Order', 'User'
    },
    entityId: {
      type: String,
      default: null,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ip: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
