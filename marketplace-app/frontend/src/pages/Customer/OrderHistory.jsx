import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Clock, ChevronRight, MapPin, CreditCard } from 'lucide-react';
import api from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Past Purchases</h1>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Order History</h2>
            <p className="text-slate-500 mt-2 font-medium italic">Review and track your premium acquisitions.</p>
          </div>
          <Link to="/products" className="btn-primary py-4 px-8 inline-flex items-center space-x-3">
             <ShoppingBag size={18} />
             <span>Buy Something New</span>
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="glass-card rounded-[3rem] p-24 text-center border-slate-100 shadow-xl animate-in fade-in zoom-in duration-700">
            <div className="bg-slate-50 w-24 h-24 rounded-[1.5rem] flex items-center justify-center mb-8 mx-auto">
              <Package size={48} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">No orders yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium mb-10 leading-relaxed">Your journey with us begins with your first selection. Explore our curated collections.</p>
            <Link to="/products" className="btn-primary py-4 px-10">Start Exploring</Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map(order => (
              <div key={order._id} className="glass-card rounded-[2.5rem] border-slate-100 overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-indigo-500/5 group">
                <div className="bg-slate-900 px-10 py-8 flex flex-wrap justify-between items-center text-white gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex gap-12 relative z-10">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Order Authenticated</span>
                      <span className="text-sm font-black tracking-tight">{new Date(order.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Investment</span>
                      <span className="text-sm font-black tracking-tight text-indigo-400">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Reference ID</span>
                    <span className="text-xs font-black tracking-[0.2em]">#PRO-{order._id.substring(18).toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-6">
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                        <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                        <p className="text-xs font-bold text-slate-400 flex items-center">
                          <Clock size={14} className="mr-2" />
                          Estimated delivery: Within 48 hours
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="group/item relative flex-shrink-0">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm transition-transform duration-500 group-hover/item:scale-105">
                              <img 
                                src={item.productId?.image || 'https://via.placeholder.com/200'} 
                                alt={item.productId?.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-lg font-black shadow-lg border-2 border-white">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:w-72 space-y-4">
                       <Link to={`/tracking/${order._id}`} className="w-full btn-primary py-4 px-6 inline-flex items-center justify-center space-x-3 group-hover:bg-indigo-700 transition-colors">
                          <MapPin size={18} />
                          <span>Track Logistics</span>
                       </Link>
                       <button className="w-full py-4 px-6 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100 inline-flex items-center justify-center space-x-3">
                          <CreditCard size={18} />
                          <span>Invoice Details</span>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
