import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert('Thank you for your message! A support representative will reply shortly.');
      setMessage('');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-orange-500 p-4 text-white flex items-center justify-between">
            <div>
              <h3 className="font-black">Live Support</h3>
              <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">We reply instantly</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-orange-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 h-48 bg-slate-50 flex flex-col justify-end">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm font-semibold text-slate-700 max-w-[80%] self-start mb-2">
              Hello! 👋 How can we help you today?
            </div>
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button type="submit" disabled={!message.trim()} className="bg-orange-500 text-white p-2 rounded-xl disabled:opacity-50 hover:bg-orange-600 transition-colors">
              <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-xl shadow-orange-500/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        >
          <MessageCircle size={28} className="group-hover:animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
