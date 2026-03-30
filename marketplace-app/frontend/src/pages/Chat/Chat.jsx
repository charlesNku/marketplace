import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Send, ArrowLeft, Check, CheckCheck, MoreHorizontal, 
  Info, ShoppingBag, ShieldCheck, Phone, Video
} from 'lucide-react';

import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const Chat = () => {
  const { receiverId, productId } = useParams();
  const { userInfo } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  
  const socketRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`http://${window.location.hostname}:5000`);

    const initializeChat = async () => {
      try {
        if (productId) {
          try {
            const { data: prodData } = await api.get(`/products/${productId}`);
            setProduct(prodData);
          } catch (err) {
            console.error('Failed to fetch product for chat', err);
          }
        }

        let targetConvId = null;
        const { data: convs } = await api.get('/chat/conversations');
        
        const existingConv = convs.find(c => 
          c.participants.some(p => p._id === receiverId) && 
          (productId ? c.productId?._id === productId : true)
        );

        if (existingConv) {
           targetConvId = existingConv._id;
           setConversationId(targetConvId);
           const { data: msgs } = await api.get(`/chat/messages/${targetConvId}`);
           setMessages(msgs);
           
           api.put(`/chat/read/${targetConvId}`);
           socketRef.current.emit('messages_read', { conversationId: targetConvId, readerId: userInfo._id });
        }

        if (targetConvId) {
          socketRef.current.emit('join_conversation', targetConvId);
        }

      } catch (err) {
        console.error('Chat init error', err);
      } finally {
        setLoading(false);
      }
    };


    if (userInfo) {
      initializeChat();
    }

    socketRef.current.on('receive_message', (messageData) => {
      if (messageData.conversationId === conversationId || 
         (messageData.senderId === receiverId && messageData.receiverId === userInfo._id)) {
        setMessages((prev) => [...prev, messageData]);
        
        if (conversationId && messageData.senderId === receiverId) {
          api.put(`/chat/read/${conversationId}`);
          socketRef.current.emit('messages_read', { conversationId, readerId: userInfo._id });
        }
      }
    });

    socketRef.current.on('messages_read', (data) => {
      if (data.conversationId === conversationId && data.readerId !== userInfo._id) {
        setMessages((prev) => prev.map(m => ({ ...m, isRead: true })));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [receiverId, productId, userInfo, conversationId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
       endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: sentMessage } = await api.post('/chat/message', {
        receiverId,
        productId,
        messageText: newMessage
      });

      if (!conversationId) {
        setConversationId(sentMessage.conversationId);
        socketRef.current.emit('join_conversation', sentMessage.conversationId);
      }

      socketRef.current.emit('send_message', sentMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');

    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-slate-50 h-[calc(100vh-130px)] lg:h-[calc(100vh-160px)] relative overflow-hidden">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 lg:p-6 flex items-center justify-between shadow-sm z-20 relative">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button onClick={() => window.history.back()} className="p-3 hover:bg-slate-50 rounded-2xl transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 lg:h-14 lg:w-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-lg">
                {(product?.traderId?.name || 'U')[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                  {product?.traderId?.name || 'Verified Trader'}
                </h2>
                <ShieldCheck size={16} className="text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center">
                <span className="h-1 w-1 bg-indigo-500 rounded-full mr-2"></span>
                Active Now • Secure Channel
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
           <button className="hidden md:flex p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition">
              <Phone size={20} />
           </button>
           <button className="hidden md:flex p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition">
              <Video size={20} />
           </button>
           <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition">
              <MoreHorizontal size={20} />
           </button>
        </div>
      </div>

      {/* Product Highlight Banner */}
      {product && (
        <div className="bg-white/40 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between z-10">
           <div className="flex items-center space-x-4">
              <img src={product.image} className="h-10 w-10 rounded-xl object-cover border border-white shadow-sm" alt="" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Regarding</p>
                <p className="text-sm font-black text-slate-900">{product.title}</p>
              </div>
           </div>
           <Link to={`/product/${product._id}`} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center hover:underline">
             View Product <Info size={14} className="ml-1" />
           </Link>
        </div>
      )}


      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-700">
               <div className="bg-indigo-50 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
                 <ShoppingBag className="text-indigo-600" size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Start a Professional Dialogue</h3>
               <p className="text-sm text-slate-500 max-w-xs font-medium leading-relaxed">
                 Reach out to the trader regarding your interest in this premium selection.
               </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === userInfo._id;
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-500`}>
                <div className="flex flex-col space-y-2 max-w-[80%] lg:max-w-[65%]">
                  <div className={`rounded-[2rem] px-6 py-4 shadow-xl ${
                    isMe 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <p className="text-[15px] font-medium leading-relaxed">{msg.message}</p>
                  </div>
                  <div className={`flex items-center space-x-2 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {isMe && (
                      <span className="flex items-center space-x-1">
                        {msg.isRead ? (
                          <CheckCheck size={14} className="text-indigo-500" />
                        ) : (
                          <Check size={14} className="text-slate-300" />
                        )}
                        <span className={`text-[9px] font-black uppercase ${msg.isRead ? 'text-indigo-500' : 'text-slate-300'}`}>
                          {msg.isRead ? 'Delivered' : 'Sent'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Premium Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 lg:p-8 z-20">
        <form onSubmit={handleSendMessage} className="max-w-[1000px] mx-auto relative group">
          <input
            type="text"
            className="w-full bg-slate-50 border-none rounded-[2rem] py-5 pl-8 pr-20 text-[15px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner outline-none placeholder:text-slate-400"
            placeholder="Compose your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3.5 rounded-[1.2rem] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-90"
          >
            <Send size={20} className="translate-x-[-1px] translate-y-[1px]" />
          </button>
        </form>
        <p className="text-center mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          End-to-End Encryption Enabled
        </p>
      </div>
    </div>
  );
};

export default Chat;
