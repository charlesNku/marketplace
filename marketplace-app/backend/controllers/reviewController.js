const supabase = require('../config/supabaseClient');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user has purchased the product (verified purchase)
    const { data: purchase } = await supabase
      .from('orders')
      .select('id, order_items(product_id)')
      .eq('user_id', req.user.id)
      .eq('order_status', 'confirmed')
      .eq('order_items.product_id', productId)
      .limit(1);

    const isVerified = purchase && purchase.length > 0;

    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        user_id: req.user.id,
        product_id: productId,
        rating: Number(rating),
        comment,
        is_verified: isVerified
      }])
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Update product average rating and review count
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    const reviewCount = allReviews.length;
    const averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount;
    
    await supabase
      .from('products')
      .update({
        review_count: reviewCount,
        average_rating: averageRating
      })
      .eq('id', productId);

    res.status(201).json({ ...review, _id: review.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, users(name, profile_image)')
      .eq('product_id', req.params.productId);

    if (error) throw error;

    // Map for frontend compatibility
    const mappedReviews = reviews.map(r => ({
      ...r,
      _id: r.id,
      userId: { 
        _id: r.user_id, 
        name: r.users.name, 
        profileImage: r.users.profile_image 
      }
    }));

    res.json(mappedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getProductReviews };
