const supabase = require('../config/supabaseClient');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('carts')
      .select('*, products(*)')
      .eq('user_id', req.user.id);
    
    if (error) throw error;

    // Map to match frontend expected structure
    const cart = {
      _id: req.user.id, // For parity with frontend logic
      userId: req.user.id,
      products: cartItems.map(item => ({
        productId: { ...item.products, _id: item.products.id },
        quantity: item.quantity
      }))
    };

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if product already in cart
    const { data: existingItem } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      await supabase
        .from('carts')
        .update({ quantity: existingItem.quantity + Number(quantity) })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('carts')
        .insert([{ user_id: req.user.id, product_id: productId, quantity: Number(quantity) }]);
    }

    // Return populated cart
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cart/remove
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    await supabase
      .from('carts')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);

    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
