const Order = require('../models/Order.js');

// POST /api/payments/checkout
const checkout = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mock Stripe payment success
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.deliveryStatus = 'processing';
    await order.save();

    res.json({ message: 'Payment successful (Mock)', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkout };
