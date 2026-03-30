const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
