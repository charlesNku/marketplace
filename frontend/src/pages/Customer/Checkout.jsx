import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateTotal = () => {
    if (!cart.products) return 0;
    return cart.products.reduce((acc, item) => acc + item.quantity * (item.productId?.price || 0), 0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: order } = await api.post('/orders', {
        products: cart.products.map(p => ({
          productId: p.productId._id,
          quantity: p.quantity,
          price: p.productId.price
        })),
        totalPrice: calculateTotal()
      });

      await api.post('/payments/checkout', { orderId: order._id });

      await fetchCart();

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
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Final Step</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-4 rounded-2xl mb-8 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <form onSubmit={submitHandler} className="space-y-8">
              <div className="glass-card rounded-[2.5rem] p-8 sm:p-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Shipping Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Street Address</label>
                    <input 
                      type="text" required 
                      className="premium-input"
                      value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 MarketPro Avenue"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City</label>
                      <input 
                        type="text" required 
                        className="premium-input"
                        value={city} onChange={(e) => setCity(e.target.value)}
                        placeholder="Kigali"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Postal Code</label>
                      <input 
                        type="text" required 
                        className="premium-input"
                        value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Country</label>
                      <input 
                        type="text" required 
                        className="premium-input"
                        value={country} onChange={(e) => setCountry(e.target.value)}
                        placeholder="Rwanda"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-8 sm:p-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Payment Processing</h2>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                     <ShieldCheck className="text-emerald-500" size={32} />
                     <div>
                       <p className="font-bold text-slate-900">Secure Payment Simulation</p>
                       <p className="text-sm text-slate-500">Your order will be processed instantly.</p>
                     </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-5 text-lg group flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Order</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
              
              <div className="flex items-center space-x-3 mb-8 relative z-10">
                <ShoppingBag size={24} className="text-indigo-400" />
                <h2 className="text-xl font-black">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10 max-h-[40vh] overflow-y-auto scrollbar-hide pr-2">
                {cart.products.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                         <img src={item.productId?.image} alt={item.productId?.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate w-32">{item.productId?.title}</p>
                        <p className="text-[10px] text-indigo-300 font-bold uppercase">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">RWF {((item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 relative z-10 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-slate-400 text-sm font-bold">
                  <span>Subtotal</span>
                  <span className="text-white">RWF {calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-sm font-bold pb-4 border-b border-white/10">
                  <span>Shipping</span>
                  <span className="text-emerald-400 uppercase text-xs tracking-widest font-black">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total To Pay</span>
                    <span className="text-3xl font-black tracking-tight">RWF {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
