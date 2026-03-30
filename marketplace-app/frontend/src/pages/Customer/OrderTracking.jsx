import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, Clock } from 'lucide-react';
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

  if (loading) return <div className="flex-grow flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="flex-grow text-center text-red-600 p-8">{error}</div>;
  if (!order) return null;

  const steps = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  const currentStepIndex = steps.indexOf(order.deliveryStatus);

  const getStatusIcon = (step) => {
    switch(step) {
      case 'pending': return <Clock size={24} />;
      case 'processing': return <Package size={24} />;
      case 'shipped': return <Truck size={24} />;
      case 'out_for_delivery': return <Truck size={24} />;
      case 'delivered': return <CheckCircle size={24} />;
      default: return <Clock size={24} />;
    }
  };

  const getStepName = (step) => {
     return step.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="flex-grow max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Track Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h1>
        <Link to="/history" className="text-blue-600 font-medium hover:underline">View All Orders</Link>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Tracking Number</h3>
            <p className="text-2xl font-bold text-gray-900">{order.trackingNumber}</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Estimated Delivery</h3>
            <p className="text-xl font-bold text-green-600">3-5 Business Days</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-8 pb-12">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
          </div>
          <div className="flex justify-between w-full absolute top-5 px-2">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-4 border-white shadow-sm ${index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {getStatusIcon(step)}
                </div>
                <div className={`text-xs mt-2 font-bold ${index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                  {getStepName(step)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
          <span className="font-medium text-gray-600">Total: <span className="text-gray-900 font-bold">${order.totalPrice.toFixed(2)}</span></span>
        </div>
        <div className="divide-y divide-gray-200">
          {order.products.map((item, index) => (
            <div key={index} className="p-6 flex items-center">
              <img src={item.productId?.image || 'https://via.placeholder.com/80'} alt={item.productId?.title} className="w-16 h-16 object-cover rounded shadow-sm mr-4" />
              <div className="flex-1">
                <Link to={`/product/${item.productId?._id}`} className="font-bold text-gray-900 hover:text-blue-600 transition">{item.productId?.title || 'Unknown Product'}</Link>
                <div className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
              </div>
              <div className="font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
