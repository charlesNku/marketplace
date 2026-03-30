const Cart = require('../models/Cart.js');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }

    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += Number(quantity);
    } else {
      cart.products.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    
    // Return populated cart
    cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cart/remove
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (cart) {
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
      await cart.save();
      cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
