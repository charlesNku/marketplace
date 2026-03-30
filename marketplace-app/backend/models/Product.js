const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    traderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    averageRating: { type: Number, required: true, default: 0 },
    reviewCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
