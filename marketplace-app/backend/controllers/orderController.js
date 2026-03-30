const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      userId: req.user._id,
      products,
      totalPrice,
      trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`
    });

    const createdOrder = await order.save();
    
    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] });

    // Create Notification for Admin (optional) or just rely on Seller/Trader alerts if we knew who they are
    // For now, let's notify the user their order was placed
    const Notification = require('../models/Notification');
    const userNotification = await Notification.create({
      userId: req.user._id,
      type: 'order',
      message: `Your premium order #${createdOrder._id.substring(18).toUpperCase()} has been successfully placed!`
    });

    const io = req.app.get('socketio');
    if (io) {
      io.to(req.user._id.toString()).emit('new_notification', userNotification);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const orders = await Order.find({}).populate('userId', 'name email');
      return res.json(orders);
    }
    
    const orders = await Order.find({ userId: req.user._id }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/delivery
const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Ensure only trader or admin
    if (req.user.role === 'customer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const oldStatus = order.deliveryStatus;
    order.deliveryStatus = req.body.deliveryStatus || order.deliveryStatus;
    if (order.deliveryStatus === 'shipped') {
      order.orderStatus = 'confirmed';
    }
    const updatedOrder = await order.save();

    // Notify Customer of status update
    const Notification = require('../models/Notification');
    const customerNotification = await Notification.create({
      userId: order.userId,
      type: 'order_update',
      message: `Order #${order._id.substring(18).toUpperCase()} status updated to ${order.deliveryStatus}.`
    });

    const io = req.app.get('socketio');
    if (io) {
      io.to(order.userId.toString()).emit('new_notification', customerNotification);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateDeliveryStatus };
