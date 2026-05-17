import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, CreditCard, AlertCircle } from 'lucide-react';
import useCartStore from '../../store/cartStore';

const Cart = () => {
  const { cart, loading, fetchCart, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && (!cart.products || cart.products.length === 0)) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!cart.products) return 0;
    return cart.products.reduce((acc, item) => acc + item.quantity * (item.productId?.price || 0), 0);
  };

  const isCartEmpty = !cart.products || cart.products.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Your Selection</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          </div>
          {!isCartEmpty && (
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">
              {cart.products.length} {cart.products.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {/* 🌟 Nihemart Helpline & Shipping Top Banner Notice */}
        {!isCartEmpty && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/10">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3.5 rounded-2xl flex-shrink-0 text-white"><Truck size={24} /></div>
              <div>
                <h4 className="font-black text-sm md:text-base leading-tight">Assisted Local Checkout Helpline</h4>
                <p className="text-xs font-semibold text-orange-50/95 mt-0.5">Need help submitting payment or choosing delivery methods? Reach out to support directly.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <a href="tel:+250788000000" className="w-full md:w-auto text-center text-xs font-black uppercase tracking-wider bg-white/20 hover:bg-white text-white hover:text-orange-600 px-6 py-3 rounded-xl transition-all">
                Call Support: +250 788 300 000
              </a>
            </div>
          </div>
        )}
        
        {isCartEmpty ? (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-20 text-center shadow-xl">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={48} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">You haven't added any items yet. Start shopping to fill it up!</p>
            <Link to="/products" className="btn-primary inline-flex py-4 px-10">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.products.map(item => (
                <div key={item._id} className="group bg-white border border-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center transition-all duration-500 hover:shadow-2xl hover:border-orange-500/10">
                  <div className="relative w-28 h-28 flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img 
                      src={item.productId?.image || 'https://via.placeholder.com/150'} 
                      alt={item.productId?.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.productId?.category}</span>
                    </div>
                    <Link to={`/product/${item.productId?._id}`} className="text-lg font-bold text-slate-800 hover:text-orange-500 transition-colors line-clamp-1 leading-snug">
                      {item.productId?.title || 'Unknown Product'}
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start space-x-6 mt-4">
                       <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                         <span>Qty</span>
                         <span className="bg-slate-50 text-slate-800 px-3 py-1 rounded-lg font-black border border-slate-100">{item.quantity}</span>
                       </div>
                       <div className="h-4 w-px bg-slate-100"></div>
                       <p className="text-sm font-black text-orange-500">RWF {(item.productId?.price || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto justify-center">
                    <div className="text-lg font-black text-slate-900 w-36 text-right">
                      RWF {((item.productId?.price || 0) * item.quantity).toLocaleString()}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId?._id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><Truck size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-800 uppercase">Fast Delivery</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kigali Express</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><ShieldCheck size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-800 uppercase">Secure Checkout</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100% Protected</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><CreditCard size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-800 uppercase">Local Payments</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Wallet & Bank</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900 text-white rounded-3xl p-10 shadow-2xl sticky top-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
                
                <h2 className="text-xl font-black mb-8 relative z-10">Order Summary</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center text-slate-400 font-bold text-xs">
                    <span>Subtotal ({cart.products.length} items)</span>
                    <span className="text-white">RWF {calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 font-bold border-b border-white/10 pb-6 text-xs">
                    <span>Shipping</span>
                    <span className="text-emerald-400 uppercase text-xs tracking-wider font-black">Free</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="block text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Order Total</span>
                      <span className="text-3xl font-black tracking-tight">RWF {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  id="checkout-btn"
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-10 py-4 text-xs font-black uppercase tracking-wider rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <p className="mt-6 text-[9px] text-center font-bold text-slate-500 uppercase tracking-widest">
                  Secure local payment protocol active
                </p>
              </div>
              
              <Link to="/products" className="flex items-center justify-center space-x-2 mt-8 text-slate-400 hover:text-orange-500 font-black text-xs uppercase tracking-widest transition-colors">
                <ArrowRight size={14} className="rotate-180" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
