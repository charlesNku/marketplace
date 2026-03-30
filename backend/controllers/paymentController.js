const supabase = require('../config/supabaseClient');

// POST /api/payments/checkout
const checkout = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mock Stripe payment success
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        delivery_status: 'processing'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ message: 'Payment successful (Mock)', order: { ...updatedOrder, _id: updatedOrder.id } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkout };
