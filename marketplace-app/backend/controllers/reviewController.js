const Review = require('../models/Review.js');
const Product = require('../models/Product.js');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({ userId: req.user._id, productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user has purchased the product
    const Order = require('../models/Order');
    const hasPurchased = await Order.findOne({ 
      userId: req.user._id, 
      "products.productId": productId,
      orderStatus: 'confirmed'
    });

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating: Number(rating),
      comment,
      isVerified: !!hasPurchased
    });

    // Update product average rating
    const reviews = await Review.find({ productId });
    const productUpdates = {
      reviewCount: reviews.length,
      averageRating: reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    };
    
    await Product.findByIdAndUpdate(productId, productUpdates);

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name profileImage');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getProductReviews };
