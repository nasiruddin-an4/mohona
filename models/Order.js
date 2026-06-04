import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    order_number: { type: String, unique: true, sparse: true },
    customer_name: { type: String, required: true },
    email: { type: String, required: true },
    contact_number: { type: String, required: true },
    address: { type: String, required: true },
    payment_method: { type: String, required: true, enum: ['Cash On Delivery', 'Bkash', 'Other'] },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping_cost: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    payment_status: { 
      type: String, 
      enum: ['Unpaid', 'Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    transaction_id: { type: String, default: null },
    status: { 
      type: String, 
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
      default: 'Pending'
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
