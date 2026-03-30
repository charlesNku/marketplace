import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, ShoppingBag, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, fetchNotifications, markAsRead, loading } = useNotificationStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag size={14} className="text-indigo-600" />;
      case 'order_update': return <Info size={14} className="text-emerald-600" />;
      case 'chat': return <MessageSquare size={14} className="text-blue-600" />;
      default: return <Bell size={14} className="text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all duration-300"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-4 ring-white shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-[380px] origin-top-right rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 backdrop-blur-md flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Notifications</h3>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Real-time alerts</p>
            </div>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[450px] overflow-y-auto scrollbar-hide py-2">
            {loading && notifications.length === 0 ? (
               <div className="flex flex-col items-center py-12">
                 <div className="h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
               </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-16 px-8 text-center">
                 <div className="bg-slate-50 p-6 rounded-3xl mb-4">
                 <Bell size={32} className="text-slate-200" />
                 </div>
                 <h4 className="text-sm font-black text-slate-900 mb-1">Stay updated with alerts</h4>
                 <p className="text-[11px] font-medium text-slate-400">We'll notify you about orders and messages here.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                  className={`p-5 hover:bg-slate-50 cursor-pointer transition-colors relative flex items-start space-x-4 ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                >
                   <div className={`p-3 rounded-2xl ${notification.isRead ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                      {getIcon(notification.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className={`text-[13px] leading-relaxed mb-1 ${!notification.isRead ? 'font-black text-slate-900' : 'text-slate-500 font-medium'}`}>
                        {notification.message}
                      </p>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System Alert
                      </span>
                   </div>
                   {!notification.isRead && (
                     <div className="h-2 w-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                   )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors flex items-center justify-center w-full group">
               View Full Activity <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default NotificationBell;
