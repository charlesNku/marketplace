import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, CreditCard } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!cart.products) return 0;
    return cart.products.reduce((acc, item) => acc + item.quantity * (item.productId?.price || 0), 0).toFixed(2);
  };

  const isCartEmpty = !cart.products || cart.products.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Your Selection</h1>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Shopping Bag</h2>
          </div>
          {!isCartEmpty && (
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              {cart.products.length} Items Reserved
            </p>
          )}
        </div>
        
        {isCartEmpty ? (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-20 text-center shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={48} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">Your bag is empty</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Looks like you haven't added any premium goods to your collection yet.</p>
            <Link to="/products" className="btn-primary inline-flex py-4 px-10">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.products.map(item => (
                <div key={item._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <div className="relative w-32 h-32 flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img 
                      src={item.productId?.image || 'https://via.placeholder.com/150'} 
                      alt={item.productId?.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.productId?.category}</span>
                    </div>
                    <Link to={`/product/${item.productId?._id}`} className="text-xl font-black text-slate-900 hover:text-indigo-600 transition-colors">
                      {item.productId?.title || 'Unknown Product'}
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start space-x-6 mt-4">
                       <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                         <span>Quantity</span>
                         <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg font-black">{item.quantity}</span>
                       </div>
                       <div className="h-4 w-px bg-slate-100"></div>
                       <p className="text-lg font-black text-indigo-600">${item.productId?.price?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto justify-center">
                    <div className="text-2xl font-black text-slate-900 w-28 text-right">
                      ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId?._id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      title="Remove item"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Truck size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-900 uppercase">Fast Delivery</p>
                     <p className="text-[10px] font-bold text-slate-400 italic">2-3 Business Days</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-900 uppercase">Purchase Protection</p>
                     <p className="text-[10px] font-bold text-slate-400 italic">100% Secure Checkout</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><CreditCard size={24} /></div>
                   <div>
                     <p className="text-xs font-black text-slate-900 uppercase">Flexible Payments</p>
                     <p className="text-[10px] font-bold text-slate-400 italic">All Cards Accepted</p>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-28 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
                
                <h2 className="text-2xl font-black mb-8 relative z-10">Order Summary</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center text-slate-400 font-bold">
                    <span>Subtotal</span>
                    <span className="text-white">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 font-bold border-b border-white/10 pb-6">
                    <span>Shipping</span>
                    <span className="text-emerald-400 uppercase text-xs tracking-widest font-black">Complementary</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Total Amount</span>
                      <span className="text-4xl font-black tracking-tight">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-10 btn-primary py-5 text-lg group bg-white text-slate-900 hover:bg-slate-100 border-none"
                >
                  <span>Complete Checkout</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </button>

                <p className="mt-8 text-[10px] text-center font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Secure encrypted transaction 
                </p>
              </div>
              
              <Link to="/products" className="flex items-center justify-center space-x-2 mt-8 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-colors">
                <ArrowRight size={16} className="rotate-180" />
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
