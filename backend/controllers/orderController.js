const supabase = require('../config/supabaseClient');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: req.user.id,
        total_price: totalPrice,
        tracking_number: `TRK-${Math.floor(Math.random() * 1000000)}`
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = products.map(p => ({
      order_id: order.id,
      product_id: p.productId,
      quantity: p.quantity,
      price: p.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Clear cart (Assuming we have a carts table)
    await supabase.from('carts').delete().eq('user_id', req.user.id);

    // 4. Create Notification
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .insert([{
        user_id: req.user.id,
        type: 'order',
        content: `Your premium order #${order.id.substring(0, 8).toUpperCase()} has been successfully placed!`
      }])
      .select()
      .single();

    const io = req.app.get('socketio');
    if (io && notification) {
      io.to(req.user.id).emit('new_notification', { ...notification, _id: notification.id });
    }

    res.status(201).json({ ...order, _id: order.id, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    let query = supabase.from('orders').select('*, order_items(*, products(*))');

    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    } else {
      query = query.select('*, users(name, email), order_items(*, products(*))');
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;

    // Map for frontend compatibility
    const mappedOrders = orders.map(o => ({
      ...o,
      _id: o.id,
      userId: o.users ? { _id: o.users.id, name: o.users.name, email: o.users.email } : o.user_id,
      products: o.order_items.map(item => ({
        productId: { ...item.products, _id: item.products.id },
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, users(name, email), order_items(*, products(*))')
      .eq('id', req.params.id)
      .single();
    
    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Map for frontend compatibility
    const mappedOrder = {
      ...order,
      _id: order.id,
      userId: { _id: order.users.id, name: order.users.name, email: order.users.email },
      products: order.order_items.map(item => ({
        productId: { ...item.products, _id: item.products.id },
        quantity: item.quantity,
        price: item.price
      }))
    };

    res.json(mappedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/delivery
const updateDeliveryStatus = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { deliveryStatus } = req.body;
    let updateData = { delivery_status: deliveryStatus };
    
    if (deliveryStatus === 'shipped') {
      updateData.order_status = 'confirmed';
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Notify Customer
    const { data: notification } = await supabase
      .from('notifications')
      .insert([{
        user_id: updatedOrder.user_id,
        type: 'order_update',
        content: `Order #${updatedOrder.id.substring(0, 8).toUpperCase()} status updated to ${deliveryStatus}.`
      }])
      .select()
      .single();

    const io = req.app.get('socketio');
    if (io && notification) {
      io.to(updatedOrder.user_id).emit('new_notification', { ...notification, _id: notification.id });
    }

    res.json({ ...updatedOrder, _id: updatedOrder.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateDeliveryStatus };
