import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, ChevronRight, MessageSquare, Clock } from 'lucide-react';
import api from '../../services/api';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/chat/conversations');
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const userId = JSON.parse(localStorage.getItem('userInfo'))?._id;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Secure Messaging</h1>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Conversations</h2>
            <p className="text-slate-500 mt-2 font-medium italic">Communicate directly with verified traders and clients.</p>
          </div>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-6 text-xs font-bold w-full md:w-64 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
        
        {conversations.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-[3rem] p-24 text-center border-slate-100 shadow-xl animate-in fade-in zoom-in duration-700">
            <div className="bg-slate-50 w-24 h-24 rounded-[1.5rem] flex items-center justify-center mb-8">
              <MessageSquare size={48} className="text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">No dialogues yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Your professional interactions and product inquiries will be organized here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map(conv => {
              const otherUser = conv.participants.find(p => p._id !== userId) || conv.participants[0];
              const isActive = true; // Mocking activity status
              
              return (
                <Link 
                  key={conv._id} 
                  to={`/chat/${otherUser._id}/${conv.productId?._id || ''}`} 
                  className="group flex items-center p-6 bg-white border border-slate-50 rounded-[2rem] hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 transform hover:-translate-y-1"
                >
                  <div className="relative flex-shrink-0 mr-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-105 transition-transform">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                       <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                         {otherUser.name}
                       </h3>
                       <div className="flex items-center space-x-2 text-slate-400">
                         <Clock size={12} />
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                         </span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <p className="text-sm font-medium text-slate-500 truncate flex-1 leading-relaxed">
                         {conv.lastMessage || 'Begin your professional conversation...'}
                       </p>
                       {conv.unreadCount > 0 && (
                         <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-indigo-200">
                           {conv.unreadCount}
                         </span>
                       )}
                    </div>
                    {conv.productId && (
                      <div className="mt-3 flex items-center space-x-2">
                         <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                           Re: {conv.productId.title}
                         </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 p-2 bg-slate-50 text-slate-300 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                     <ChevronRight size={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
