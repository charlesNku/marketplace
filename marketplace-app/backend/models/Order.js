const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    deliveryStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'], default: 'pending' },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
