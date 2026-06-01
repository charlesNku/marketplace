import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Send, ArrowLeft, Check, CheckCheck, MoreHorizontal, 
  Info, ShieldCheck, Phone, Video, Star, Search, Clock, 
  MessageSquare, ShoppingBag
} from 'lucide-react';

import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const Messages = () => {
  const { receiverId, productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const endOfMessagesRef = useRef(null);

  // Normalize Supabase message fields
  const normalizeMessage = (m) => ({
    ...m,
    _id: m.id || m._id,
    senderId: m.sender_id || m.senderId,
    receiverId: m.receiver_id || m.receiverId,
    createdAt: m.created_at || m.createdAt,
    isRead: m.is_read ?? m.isRead,
  });

  // Fetch initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: convs } = await api.get('/chat/conversations');
        setConversations(convs);

        if (receiverId) {
          // Check if conversation exists
          const existingConv = convs.find(c => 
            c.participants.some(p => p._id === receiverId) && 
            (productId ? c.productId?._id === productId : true)
          );

          if (existingConv) {
            setActiveConversation(existingConv);
          } else {
            // New conversation placeholder
            // Fetch product info if it's a new product inquiry
            let prodInfo = null;
            if (productId) {
               try {
                 const { data: p } = await api.get(`/products/${productId}`);
                 prodInfo = p;
               } catch (e) {}
            }
            
            const newConv = {
              _id: 'new',
              participants: [
                 { _id: userInfo._id, name: userInfo.name },
                 { _id: receiverId, name: 'Trader' } // In a real app we'd fetch trader details here
              ],
              productId: prodInfo ? { _id: prodInfo._id, title: prodInfo.title, image: prodInfo.image } : null,
              isNew: true
            };
            setActiveConversation(newConv);
            setProduct(prodInfo);
          }
        }
      } catch (err) {
        console.error('Chat init error', err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      initialize();
    }
  }, [receiverId, productId, userInfo]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation && activeConversation._id !== 'new') {
        try {
          const { data: msgs } = await api.get(`/chat/messages/${activeConversation._id}`);
          setMessages(msgs.map(normalizeMessage));
          api.put(`/chat/read/${activeConversation._id}`).catch(() => {});
          
          if (activeConversation.productId && activeConversation.productId._id) {
             const { data: p } = await api.get(`/products/${activeConversation.productId._id}`);
             setProduct(p);
          } else {
             setProduct(null);
          }
        } catch (err) {
          console.error('Failed to fetch messages', err);
        }
      } else if (activeConversation && activeConversation._id === 'new') {
        setMessages([]);
      } else {
        setMessages([]);
        setProduct(null);
      }
    };
    
    fetchMessages();
  }, [activeConversation]);

  // Polling for new messages
  useEffect(() => {
    let pollInterval;
    if (activeConversation && activeConversation._id !== 'new') {
      pollInterval = setInterval(async () => {
        try {
          const { data: msgs } = await api.get(`/chat/messages/${activeConversation._id}`);
          setMessages(current => {
            if (msgs.length > current.length) {
              api.put(`/chat/read/${activeConversation._id}`).catch(() => {});
              return msgs.map(normalizeMessage);
            }
            return current;
          });
        } catch (err) {}
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
       endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSendError(null);
    setSending(true);
    const textToSend = newMessage;
    setNewMessage('');

    let targetReceiverId = receiverId;
    if (!targetReceiverId && activeConversation) {
       const otherUser = activeConversation.participants.find(p => p._id !== userInfo._id) || activeConversation.participants[0];
       targetReceiverId = otherUser._id;
    }

    try {
      const { data: sentMessage } = await api.post('/chat/message', {
        receiverId: targetReceiverId,
        productId: product?._id || activeConversation?.productId?._id,
        messageText: textToSend
      });

      const normalized = normalizeMessage(sentMessage);

      if (activeConversation && activeConversation._id === 'new') {
         // Re-fetch conversations to get the actual ID
         const { data: convs } = await api.get('/chat/conversations');
         setConversations(convs);
         const newConv = convs.find(c => c._id === normalized.conversationId || c.id === normalized.conversationId);
         if (newConv) setActiveConversation(newConv);
      }

      setMessages((prev) => [...prev, normalized]);
      
      // Update conversations list latest message
      setConversations(prev => prev.map(c => {
         if (c._id === (activeConversation?._id === 'new' ? normalized.conversationId : activeConversation?._id)) {
            return { ...c, updatedAt: new Date().toISOString() };
         }
         return c;
      }));

    } catch (err) {
      console.error('Failed to send message', err);
      setSendError(err.response?.data?.message || 'Failed to send. Please check your connection and try again.');
      setNewMessage(textToSend);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conv) => {
     if (!conv || !conv.participants) return { name: 'Unknown' };
     return conv.participants.find(p => p._id !== userInfo._id) || conv.participants[0];
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex justify-center items-center bg-slate-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredConversations = conversations.filter(c => {
     const otherUser = getOtherUser(c);
     return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (c.productId && c.productId.title && c.productId.title.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="flex bg-slate-50 h-[100dvh] pt-[104px] overflow-hidden max-w-[1600px] mx-auto w-full">
      {/* Sidebar: Conversations List */}
      <div className={`${activeConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[400px] border-r border-slate-200 bg-white h-full z-10`}>
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
             <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {conversations.length} Active
             </div>
          </div>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold w-full focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-2 lg:p-4 space-y-2">
           {filteredConversations.length === 0 ? (
             <div className="text-center p-8 text-slate-500 text-sm font-medium">No conversations found.</div>
           ) : (
             filteredConversations.map(conv => {
               const otherUser = getOtherUser(conv);
               const isActive = activeConversation?._id === conv._id;
               
               return (
                 <button 
                   key={conv._id} 
                   onClick={() => {
                      setActiveConversation(conv);
                      navigate(`/messages/${otherUser._id}${conv.productId ? '/' + conv.productId._id : ''}`, { replace: true });
                   }}
                   className={`w-full text-left flex items-center p-3 lg:p-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-50 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                 >
                   <div className="relative flex-shrink-0 mr-4">
                     <div className={`h-12 w-12 rounded-[1rem] flex items-center justify-center text-white font-black text-xl shadow-md ${isActive ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                       {otherUser.name.charAt(0).toUpperCase()}
                     </div>
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-[15px] font-black truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                          {otherUser.name}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </span>
                     </div>
                     <p className={`text-xs truncate font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                       {conv.productId ? `Re: ${conv.productId.title}` : 'Tap to view conversation'}
                     </p>
                   </div>
                 </button>
               );
             })
           )}
        </div>
      </div>

      {/* Main Area: Active Chat */}
      <div className={`${!activeConversation ? 'hidden lg:flex' : 'flex'} flex-1 flex-col h-full bg-[#F4F6F8] relative overflow-hidden`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 lg:p-6 flex items-center justify-between shadow-sm z-20 relative">
              <div className="flex items-center space-x-4">
                <button onClick={() => { setActiveConversation(null); navigate('/messages'); }} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition">
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="relative">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white font-black text-lg shadow-md">
                      {getOtherUser(activeConversation).name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-[3px] border-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h2 className="text-[15px] lg:text-lg font-black text-slate-900 tracking-tight">
                        {getOtherUser(activeConversation).name}
                      </h2>
                      <ShieldCheck size={14} className="text-indigo-500" />
                    </div>
                    <p className="text-[9px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 lg:space-x-2">
                 <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                    <Phone size={18} />
                 </button>
                 <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                    <Video size={18} />
                 </button>
                 <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                    <MoreHorizontal size={18} />
                 </button>
              </div>
            </div>

            {/* Product Banner Context */}
            {product && (
              <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between z-10 shadow-sm shrink-0">
                 <div className="flex items-center space-x-3 min-w-0">
                    <img src={product.image} className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg object-cover border border-slate-100 shadow-sm shrink-0" alt="" />
                    <div className="truncate">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inquiry Regarding</p>
                      <p className="text-xs lg:text-sm font-bold text-slate-900 truncate">{product.title}</p>
                    </div>
                 </div>
                 <Link to={`/product/${product._id}`} className="shrink-0 ml-3 text-[9px] lg:text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center hover:underline bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                   View <Info size={12} className="ml-1 hidden sm:block" />
                 </Link>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scrollbar-hide relative">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-100 max-w-sm">
                     <div className="bg-indigo-50 w-16 h-16 rounded-[1.2rem] flex items-center justify-center mx-auto mb-6">
                       <MessageSquare className="text-indigo-600" size={28} />
                     </div>
                     <h3 className="text-lg font-black text-slate-900 mb-2">Start a Professional Dialogue</h3>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                       End-to-end encrypted messaging. Say hello!
                     </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderId === userInfo._id;
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${isMe ? 'right' : 'left'}-2 duration-300`}>
                      <div className="flex flex-col max-w-[85%] lg:max-w-[70%]">
                        <div className={`rounded-2xl px-4 lg:px-5 py-2.5 lg:py-3 shadow-sm ${
                          isMe 
                            ? 'bg-[#dcf8c6] border border-[#cfebba] text-slate-800 rounded-tr-sm' 
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                        }`}>
                          <div className={`text-[10px] font-black mb-1 uppercase tracking-widest ${isMe ? 'text-emerald-700 text-right' : 'text-indigo-500 text-left'}`}>
                            {isMe 
                               ? `${userInfo?.role || 'Customer'} (You)` 
                               : activeConversation?.participants?.find(p => p._id === msg.senderId)?.role || 'Customer'
                            }
                          </div>
                          <p className="text-[14px] lg:text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                          <div className={`flex items-center space-x-1.5 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            {isMe && (
                              <span className="flex items-center ml-1">
                                <CheckCheck size={14} className={msg.isRead ? "text-blue-500" : "text-slate-400"} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Chat Input Area */}
            <div className="bg-white/90 backdrop-blur-md border-t border-slate-100 p-3 lg:p-4 z-20 flex flex-col shrink-0">
              {sendError && (
                <div className="mb-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg px-3 py-2 text-center shadow-sm">
                  ⚠️ {sendError}
                </div>
              )}
              {messages.length === 0 && activeConversation._id === 'new' && (
                <div className="flex space-x-2 mb-2 overflow-x-auto scrollbar-hide pb-1 px-1">
                   <button onClick={() => setNewMessage('Hello, is this still available?')} className="shrink-0 whitespace-nowrap text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 py-1.5 px-3 rounded-full transition-colors">"Is this available?"</button>
                   <button onClick={() => setNewMessage('Can you send more photos?')} className="shrink-0 whitespace-nowrap text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 py-1.5 px-3 rounded-full transition-colors">"More photos?"</button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="relative group w-full flex items-center">
                <input
                  type="text"
                  className="w-full bg-slate-100 border border-transparent rounded-[1.5rem] py-3 lg:py-3.5 pl-5 pr-14 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-inner"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); setSendError(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center"
                >
                  {sending 
                    ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send size={16} className="-translate-x-[1px] translate-y-[1px]" />
                  }
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex h-full flex-col items-center justify-center text-center">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-center max-w-md">
              <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MessageSquare className="text-indigo-300" size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">WhatsApp for Business</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Select a conversation from the left to start messaging, or browse products to inquire about them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
