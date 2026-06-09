import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send, ArrowLeft, Check, CheckCheck, MoreHorizontal,
  Info, ShieldCheck, Phone, Video, Star, Search, Clock,
  MessageSquare, ShoppingBag, Smile, Plus, Mic, Paperclip, X
} from 'lucide-react';
import { io } from 'socket.io-client';

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
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [traders, setTraders] = useState([]);
  const typingTimeoutRef = useRef(null);

  const [replyTo, setReplyTo] = useState(null);
  const endOfMessagesRef = useRef(null);
  const socketRef = useRef(null);

  // Normalize Supabase message fields
  const normalizeMessage = (m) => ({
    ...m,
    _id: m.id || m._id,
    senderId: m.sender_id || m.senderId,
    receiverId: m.receiver_id || m.receiverId,
    createdAt: m.created_at || m.createdAt,
    isRead: m.is_read ?? m.isRead,
  });

  // Socket.io initialization
  useEffect(() => {
    if (userInfo?._id) {
      socketRef.current = io(`http://${window.location.hostname}:5000`);
      socketRef.current.emit('join_user', userInfo._id);

      socketRef.current.on('receive_message', (msg) => {
        const normalized = normalizeMessage(msg);

        // Play notification sound
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => { });
        } catch (e) { }

        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some(m => m._id === normalized._id)) return prev;
          return [...prev, normalized];
        });

        // Update conversation list
        setConversations(prev => {
          const updated = prev.map(c => {
            if (c._id === normalized.conversationId) {
              return { ...c, updated_at: normalized.createdAt };
            }
            return c;
          });
          // Sort by latest
          return updated.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });
      });

      socketRef.current.on('user_typing', (data) => {
        if (activeConversation && data.conversationId === activeConversation._id && data.userId !== userInfo._id) {
          setIsTyping(true);
        }
      });

      socketRef.current.on('user_stop_typing', (data) => {
        if (activeConversation && data.conversationId === activeConversation._id) {
          setIsTyping(false);
        }
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [userInfo]);

  // Join conversation room when active chat changes
  useEffect(() => {
    if (socketRef.current && activeConversation && activeConversation._id !== 'new') {
      socketRef.current.emit('join_conversation', activeConversation._id);
    }
  }, [activeConversation]);

  // Fetch initial data
  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: convs } = await api.get('/chat/conversations');
        setConversations(convs);

        if (receiverId) {
          const existingConv = convs.find(c =>
            c.participants.some(p => p._id === receiverId) &&
            (productId ? c.productId?._id === productId : true)
          );

          if (existingConv) {
            setActiveConversation(existingConv);
          } else {
            let prodInfo = null;
            if (productId) {
              try {
                const { data: p } = await api.get(`/products/${productId}`);
                prodInfo = p;
              } catch (e) { }
            }

            const newConv = {
              _id: 'new',
              participants: [
                { _id: userInfo._id, name: userInfo.name },
                { _id: receiverId, name: 'Trader' }
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
          api.put(`/chat/read/${activeConversation._id}`).catch(() => { });

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
      await api.post('/chat/message', {
        receiverId: targetReceiverId,
        productId: product?._id || activeConversation?.productId?._id,
        messageText: textToSend,
        parentMessageId: replyTo?._id
      });

      setReplyTo(null);

      if (activeConversation && activeConversation._id === 'new') {
        const { data: convs } = await api.get('/chat/conversations');
        setConversations(convs);
        const foundConv = convs.find(c =>
          c.participants.some(p => p._id === targetReceiverId)
        );
        if (foundConv) setActiveConversation(foundConv);
      }

    } catch (err) {
      console.error('Failed to send message', err);
      setSendError(err.response?.data?.message || 'Failed to send.');
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
    <div className="flex bg-[#f0f2f5] h-[100dvh] pt-[104px] overflow-hidden max-w-[1600px] mx-auto w-full">
      {/* Sidebar: Conversations List */}
      <div className={`${activeConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[450px] border-r border-slate-200 bg-white h-full z-10 shadow-lg`}>
        <div className="p-6 bg-white flex items-center justify-between border-b border-slate-50">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center space-x-1 mt-1">
              <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              <span>{conversations.length} Active</span>
            </div>
          </div>
          <button
            onClick={async () => {
              setShowNewChatModal(true);
              const { data } = await api.get('/auth/traders');
              setTraders(data);
            }}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="p-4 bg-white">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold w-full focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <MessageSquare className="text-slate-200" size={32} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">No chats yet</h4>
              <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                Select a product and click "Chat with Seller" to start a conversation.
              </p>
            </div>
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
                  className={`w-full text-left flex items-center px-4 py-3 border-b border-slate-50 transition-colors ${isActive ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'}`}
                >
                  <div className="relative flex-shrink-0 mr-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-indigo-500 shadow-sm">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[15px] font-medium text-slate-800 truncate">
                        {otherUser.name}
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[13px] truncate text-slate-500 mt-0.5">
                      {conv.productId ? `Re: ${conv.productId.title}` : 'Tap to message'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area: Active Chat */}
      <div className={`${!activeConversation ? 'hidden lg:flex' : 'flex'} flex-1 flex-col h-full bg-[#efeae2] relative overflow-hidden`}>
        {/* Chat Wallpaper Pattern */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        {activeConversation ? (
          <>
            {/* WhatsApp Styled Header */}
            <div className="bg-[#f0f2f5] border-b border-slate-200 p-3 lg:px-4 flex items-center justify-between z-20 relative">
              <div className="flex items-center space-x-3">
                <button onClick={() => { setActiveConversation(null); navigate('/messages'); }} className="lg:hidden p-1 hover:bg-slate-200 rounded-full transition">
                  <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {getOtherUser(activeConversation).name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-[15px] font-medium text-slate-900 leading-tight">
                      {getOtherUser(activeConversation).name}
                    </h2>
                    <p className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                      {isTyping ? (
                        <span className="text-emerald-500 font-bold animate-pulse">typing...</span>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                          <span className="italic">Online</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-slate-500">
                <Search size={20} className="cursor-pointer hover:text-slate-700" />
                <MoreHorizontal size={20} className="cursor-pointer hover:text-slate-700" />
              </div>
            </div>

            {/* Product context info */}
            {product && (
              <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2 flex items-center justify-between z-10 shadow-sm shrink-0">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={product.image} className="h-10 w-10 rounded-md object-cover border border-slate-100" alt="" />
                  <div className="truncate">
                    <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">PRODUCT INQUIRY</p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">{product.title}</p>
                  </div>
                </div>
                <Link to={`/product/${product._id}`} className="shrink-0 ml-4 text-[11px] font-bold text-indigo-600 hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  VIEW ITEM
                </Link>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:px-12 lg:py-6 space-y-2 z-10 scrollbar-hide relative">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50 max-w-xs">
                    <p className="text-[12px] text-slate-500 font-medium">
                      Messages are end-to-end encrypted. No one outside of this chat can read them.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderId === userInfo._id;
                  const showTail = index === 0 || messages[index - 1].senderId !== msg.senderId;

                  return (
                    <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-[2px] ${showTail ? 'mt-2' : ''} group`}>
                      <div className={`relative px-3 py-1.5 min-w-[80px] max-w-[85%] lg:max-w-[65%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] ${isMe
                        ? `bg-[#dcf8c6] ${showTail ? 'rounded-l-lg rounded-br-lg rounded-tr-none' : 'rounded-lg'} ml-12`
                        : `bg-white ${showTail ? 'rounded-r-lg rounded-bl-lg rounded-tl-none' : 'rounded-lg'} mr-12`
                        }`}>

                        {/* Authentic WhatsApp Tail SVG */}
                        {showTail && (
                          <div className={`absolute top-0 ${isMe ? '-right-[8px]' : '-left-[8px]'}`}>
                            <svg width="8" height="13" viewBox="0 0 8 13">
                              <path
                                d={isMe ? "M0 0v13l8-13H0z" : "M8 0v13l-8-13h8z"}
                                fill={isMe ? "#dcf8c6" : "white"}
                              />
                            </svg>
                          </div>
                        )}

                        {/* Quoted Message Display */}
                        {msg.parentMessage && (
                          <div className={`mb-2 p-2 rounded-lg border-l-4 text-[13px] ${isMe ? 'bg-[#cfe9ba] border-emerald-500' : 'bg-[#f0f2f5] border-indigo-500'}`}>
                            <p className="font-bold text-[11px] mb-0.5">
                              {msg.parentMessage.senderId === userInfo._id ? 'You' : getOtherUser(activeConversation).name}
                            </p>
                            <p className="truncate text-slate-600 italic line-clamp-1">{msg.parentMessage.message}</p>
                          </div>
                        )}

                        <p className="text-[14.2px] text-[#111b21] leading-[19px] whitespace-pre-wrap break-words pr-12">{msg.message}</p>
                        <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                          <span className="text-[10px] text-[#667781] leading-none">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            <CheckCheck size={14} className={msg.isRead ? "text-[#53bdeb]" : "text-[#78909c]"} />
                          )}
                        </div>
                        {/* Reply Button on Bubble */}
                        <button
                          onClick={() => setReplyTo(msg)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus size={14} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Chat Input Area - WhatsApp Style */}
            <div className="bg-[#f0f2f5] p-2 lg:px-4 z-20 flex flex-col shrink-0">
              {/* Reply Preview */}
              {replyTo && (
                <div className="bg-white/80 backdrop-blur-sm border-l-4 border-emerald-500 p-2 mb-2 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2">
                  <div className="truncate px-2">
                    <p className="text-[11px] font-bold text-emerald-600">Replying to {replyTo.senderId === userInfo._id ? 'yourself' : getOtherUser(activeConversation).name}</p>
                    <p className="text-[12px] text-slate-500 truncate italic">{replyTo.message}</p>
                  </div>
                  <button onClick={() => setReplyTo(null)} className="p-1 text-slate-400 hover:text-rose-500">
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3 w-full">
                <div className="flex items-center space-x-4 text-slate-500 mx-2">
                  <Smile size={24} className="cursor-pointer hover:text-slate-700" />
                  <Plus size={24} className="cursor-pointer hover:text-slate-700" />
                </div>

                <div className="flex-1">
                  <form onSubmit={handleSendMessage} className="relative">
                    <input
                      type="text"
                      className="w-full bg-white border-none rounded-lg py-2.5 px-4 text-[14px] focus:ring-0 outline-none placeholder:text-slate-500 shadow-sm"
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        setSendError(null);

                        // Typing indicator logic
                        if (socketRef.current && activeConversation) {
                          socketRef.current.emit('typing', {
                            conversationId: activeConversation._id,
                            userId: userInfo._id
                          });

                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = setTimeout(() => {
                            socketRef.current.emit('stop_typing', {
                              conversationId: activeConversation._id,
                              userId: userInfo._id
                            });
                          }, 2000);
                        }
                      }}
                    />
                  </form>
                </div>

                <div className="flex items-center justify-center h-10 w-10">
                  {newMessage.trim() ? (
                    <button
                      onClick={handleSendMessage}
                      disabled={sending}
                      className="text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      <Send size={24} />
                    </button>
                  ) : (
                    <Mic size={24} className="text-slate-500 cursor-pointer hover:text-slate-700" />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden lg:flex h-full flex-col items-center justify-center text-center p-20 z-10 bg-[#f0f2f5]">
            <div className="max-w-md">
              <div className="relative mb-8">
                <div className="bg-white p-10 rounded-full inline-block shadow-sm">
                  <MessageSquare className="text-[#adb5bd]" size={80} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#25d366] p-4 rounded-full text-white shadow-lg">
                  <ShieldCheck size={24} />
                </div>
              </div>
              <h2 className="text-3xl font-light text-[#41525d] mb-4">WhatsApp for Business</h2>
              <p className="text-[14px] text-[#667781] leading-relaxed mb-10">
                Send and receive messages without keeping your phone online.<br />
                Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
              </p>
              <div className="space-y-4">
                <button
                  onClick={async () => {
                    setShowNewChatModal(true);
                    const { data } = await api.get('/auth/traders');
                    setTraders(data);
                  }}
                  className="bg-[#00a884] text-white px-8 py-2.5 rounded-full font-medium text-[14px] hover:bg-[#008f72] shadow-sm transition-all flex items-center space-x-2 mx-auto"
                >
                  <Plus size={18} />
                  <span>Start a conversation</span>
                </button>
              </div>
              <div className="mt-20 flex items-center justify-center space-x-2 text-[#8696a0]">
                <Clock size={12} />
                <span className="text-[12px]">Your personal messages are end-to-end encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">New Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Select a Trader to chat with</p>
              {traders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic">Loading traders...</div>
              ) : (
                traders.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveConversation({
                        _id: 'new',
                        participants: [{ _id: userInfo._id, name: userInfo.name }, { _id: t.id, name: t.name }],
                        isNew: true
                      });
                      setShowNewChatModal(false);
                      navigate(`/messages/${t.id}`, { replace: true });
                    }}
                    className="w-full flex items-center space-x-4 p-4 hover:bg-indigo-50 rounded-2xl transition-all group border-b border-slate-50 last:border-0"
                  >
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-900">{t.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
