import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Facebook, Twitter, Instagram, 
  Linkedin, Youtube, Mail, MapPin, Phone, ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-20 pb-10 px-6 text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tight">
              MARKET<span className="text-indigo-400">PRO</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
            Elevating the marketplace experience with premium curation, secure transactions, and world-class support.
          </p>
          <div className="flex items-center space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all duration-300 text-slate-400 hover:text-white">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">Shop Selection</h3>
          <ul className="space-y-4">
            {['Latest Arrivals', 'Premium Electronics', 'Fashion Essentials', 'Artisan Groceries', 'Health & Beauty'].map(link => (
              <li key={link}>
                <Link to="/products" className="text-sm font-bold text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-8">Experience</h3>
          <ul className="space-y-4">
            {['Track Order', 'Premium Delivery', 'Return Policy', 'Gift Cards', 'Member Lounge'].map(link => (
              <li key={link}>
                <Link to="#" className="text-sm font-bold text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Join Our Newsletter</h3>
          <p className="text-sm font-medium text-slate-400">Subscribe to receive first access to limited editions and premium updates.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-8">
           {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
             <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
               {link}
             </a>
           ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          &copy; {new Date().getFullYear()} MARKETPRO GLOBAL. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
