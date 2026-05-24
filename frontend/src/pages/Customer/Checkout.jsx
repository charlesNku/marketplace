import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';

const Checkout = () => {
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
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
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Final Step</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-4 rounded-2xl mb-8 font-semibold text-xs uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <form onSubmit={submitHandler} className="space-y-8">
              
              {/* Shipping Details Sheet */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm">
                
                {/* 🌟 Nihemart Secured Local Checkout warning shield banner */}
                <div className="bg-blue-50 border border-blue-500/10 rounded-2xl p-4 flex items-start space-x-3 text-blue-800 mb-8">
                  <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold">
                    <p className="font-bold uppercase tracking-wider">Secured Local Checkout Protocols Active</p>
                    <p className="mt-0.5 text-blue-700/80">Your billing credentials will be secured with local encryption pipelines before bank simulations.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                    <MapPin size={22} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Shipping Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Street Address</label>
                    <input 
                      type="text" required 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 MarketPro Avenue"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">City</label>
                      <input 
                        type="text" required 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        value={city} onChange={(e) => setCity(e.target.value)}
                        placeholder="Kigali"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Postal Code</label>
                      <input 
                        type="text" required 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Country</label>
                      <input 
                        type="text" required 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        value={country} onChange={(e) => setCountry(e.target.value)}
                        placeholder="Rwanda"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Processing Sheet */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                    <CreditCard size={22} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Payment Procedure</h2>
                </div>

                <div className="space-y-4 mb-8">
                  {['Credit Card', 'Mobile Money', 'Cash on Delivery'].map((method) => (
                    <label key={method} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={paymentMethod === method} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        className="mr-4 text-orange-500 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-bold text-slate-800">{method}</span>
                    </label>
                  ))}
                </div>

                {/* Conditional Payment Interface */}
                <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                  {paymentMethod === 'Credit Card' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                          <input type="text" placeholder="123" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Mobile Money' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex gap-4 mb-4">
                        <label className="flex-1 text-center cursor-pointer">
                          <input type="radio" name="momo_provider" className="peer sr-only" defaultChecked />
                          <div className="py-2 px-4 rounded-xl border-2 border-transparent peer-checked:border-yellow-400 peer-checked:bg-yellow-50 bg-white font-black text-[#000066] text-xs transition-all shadow-sm">MTN MoMo</div>
                        </label>
                        <label className="flex-1 text-center cursor-pointer">
                          <input type="radio" name="momo_provider" className="peer sr-only" />
                          <div className="py-2 px-4 rounded-xl border-2 border-transparent peer-checked:border-red-500 peer-checked:bg-red-50 bg-white font-black text-red-600 text-xs transition-all shadow-sm">Airtel Money</div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                        <input type="tel" placeholder="07XX XXX XXX" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all" />
                        <p className="text-[10px] text-slate-400 font-semibold mt-2">A prompt will be sent to your phone to confirm the payment.</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="text-center py-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">Pay at your doorstep</h4>
                      <p className="text-xs text-slate-500 font-semibold">Please have the exact amount in cash when our courier arrives.</p>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-xs font-black uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Purchase</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center space-x-3 mb-8 relative z-10">
                <ShoppingBag size={20} className="text-orange-400" />
                <h2 className="text-lg font-black">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10 max-h-[30vh] overflow-y-auto scrollbar-hide pr-2">
                {cart.products.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 overflow-hidden flex-shrink-0 border border-white/5">
                         <img src={item.productId?.image} alt={item.productId?.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold truncate w-24 sm:w-32">{item.productId?.title}</p>
                        <p className="text-[9px] text-orange-300 font-black uppercase mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs">RWF {((item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 relative z-10 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                  <span>Subtotal</span>
                  <span className="text-white">RWF {calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-xs font-bold pb-4 border-b border-white/10">
                  <span>Shipping</span>
                  <span className="text-emerald-400 uppercase text-[10px] tracking-wider font-black">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="block text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Total To Pay</span>
                    <span className="text-2xl font-black tracking-tight">RWF {calculateTotal().toLocaleString()}</span>
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
