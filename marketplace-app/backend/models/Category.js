const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String }, // Lucide icon name or URL
  image: { type: String }, // Category banner/thumbnail
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
