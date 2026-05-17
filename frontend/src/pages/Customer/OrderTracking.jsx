import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, Clock, ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import api from '../../services/api';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-8 py-6 rounded-[2rem] max-w-md text-center">
          <h2 className="text-xl font-black mb-2">Order Not Found</h2>
          <p className="font-medium text-sm">{error}</p>
          <Link to="/history" className="btn-primary mt-6 inline-flex">Return to History</Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const steps = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  const currentStepIndex = steps.indexOf(order.deliveryStatus);

  const getStatusIcon = (step) => {
    switch(step) {
      case 'pending': return <Clock size={20} />;
      case 'processing': return <Package size={20} />;
      case 'shipped': return <Truck size={20} />;
      case 'out_for_delivery': return <MapPin size={20} />;
      case 'delivered': return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStepName = (step) => {
     return step.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div>
            <Link to="/history" className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-4">
              <ArrowLeft size={14} className="mr-2" /> Back to History
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Tracking</h1>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">ID: #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
          </div>
          <div className="text-left sm:text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
             <p className="text-xl font-black text-emerald-600 tracking-tight">3-5 Business Days</p>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="mb-12 relative z-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tracking Number</h3>
            <div className="flex items-center space-x-3">
              <p className="text-3xl font-black text-slate-900">{order.trackingNumber}</p>
              <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition-colors">
                 <ExternalLink size={20} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-4 pb-8 z-10">
            <div className="absolute top-9 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
            <div 
              className="absolute top-9 left-0 h-1 bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step} className="flex flex-col items-center w-20 sm:w-24">
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                      isCompleted 
                        ? 'bg-indigo-600 text-white shadow-indigo-500/20' 
                        : 'bg-white text-slate-300 border-2 border-slate-100 shadow-slate-200/20'
                    } ${isCurrent ? 'scale-110 ring-4 ring-indigo-100' : ''}`}>
                      {getStatusIcon(step)}
                    </div>
                    <div className={`text-[10px] sm:text-xs mt-4 font-black uppercase tracking-wider text-center ${
                      isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {getStepName(step)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between text-white gap-4">
            <h2 className="text-lg font-black tracking-wide">Items in this shipment</h2>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Paid</span>
              <span className="text-xl font-black text-indigo-400">RWF {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100/50">
            {order.products.map((item, index) => (
              <div key={index} className="p-8 flex flex-col sm:flex-row items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                   <img src={item.productId?.image || 'https://via.placeholder.com/80'} alt={item.productId?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.productId?._id}`} className="text-lg font-black text-slate-900 hover:text-indigo-600 transition">
                    {item.productId?.title || 'Unknown Product'}
                  </Link>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">RWF {(item.price || 0).toLocaleString()} each</span>
                  </div>
                </div>
                
                <div className="text-xl font-black text-slate-900 sm:text-right">
                  RWF {((item.quantity * item.price) || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
