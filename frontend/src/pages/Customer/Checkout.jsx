import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';

const Checkout = () => {
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateTotal = () => {
    if (!cart.products) return 0;
    return cart.products.reduce((acc, item) => acc + item.quantity * (item.productId?.price || 0), 0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Order
      const { data: order } = await api.post('/orders', {
        products: cart.products.map(p => ({
          productId: p.productId._id,
          quantity: p.quantity,
          price: p.productId.price
        })),
        totalPrice: calculateTotal()
      });

      // 2. Process Mock Payment
      await api.post('/payments/checkout', { orderId: order._id });

      // Refresh cart (should be empty now)
      await fetchCart();

      // Redirect to success/tracking page
      navigate(`/tracking/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  if (!cart.products || cart.products.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="flex-grow max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
      
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Shipping Information</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text" required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={city} onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input 
                type="text" required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                type="text" required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={country} onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
              Total to pay: <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
              <p className="mt-1 text-xs opacity-80">(Note: This is a simulated checkout using mock payment processing)</p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing Payment...' : 'Pay Now & Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
