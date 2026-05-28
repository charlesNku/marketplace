import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, User, LogOut, Menu, X, Search, 
  ShoppingCart, Heart, MessageSquare, ChevronDown,
  Phone, Globe, Smartphone, Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const handleTranslate = (langCode, langName) => {
    setCurrentLang(langName);
    setLangDropdown(false);
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    if (userInfo) fetchCart();
  }, [userInfo]);

  const cartCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  if (userInfo?.role === 'admin') {
    navLinks.push({ name: 'Admin Console', path: '/admin/dashboard' });
  } else if (userInfo?.role === 'trader') {
    navLinks.push({ name: 'Seller Hub', path: '/trader/dashboard' });
  }

  return (
    <div className="w-full z-50 fixed top-0 flex flex-col shadow-sm">
      {/* 🌟 Nihemart Top utility bar */}
      <div className="bg-orange-500 text-white text-xs py-2 px-4 sm:px-6 flex items-center justify-between w-full font-medium tracking-wide">
        <div className="flex items-center space-x-6">
          <a href="tel:0790087715" className="flex items-center space-x-1.5 hover:underline font-bold">
            <Phone size={13} />
            <span>HELPLINE: 0790087715</span>
          </a>
          <span className="hidden sm:inline text-white/50">|</span>
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Smartphone size={11} />
            <span>Get App (Save 15%)</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Custom Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center space-x-1.5 hover:text-white/80 focus:outline-none transition-colors"
            >
              <Globe size={13} />
              <span>{currentLang}</span>
              <ChevronDown size={11} />
            </button>
            
            <div className={`absolute right-0 mt-2 bg-white text-slate-800 rounded-xl shadow-2xl p-2 w-48 border border-slate-100 z-50 text-left font-semibold ${langDropdown ? 'block' : 'hidden'}`}>
              <button 
                onClick={() => handleTranslate('en', 'English')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-xs transition-colors"
              >
                English
              </button>
              <button 
                onClick={() => handleTranslate('fr', 'Français')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-xs transition-colors"
              >
                Français
              </button>
              <button 
                onClick={() => handleTranslate('sw', 'Kiswahili')}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-xs transition-colors"
              >
                Kiswahili
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-black">
                Any Language:
              </div>
              <div className="px-1 pb-1">
                 <div id="google_translate_element" className="w-full overflow-hidden rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 text-white/90">
            <a href="#" className="hover:text-white transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={14} /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube size={14} /></a>
          </div>
        </div>
      </div>

      {/* 🌟 Nihemart main sticky glass bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-3 px-4 sm:px-6 w-full flex items-center justify-between">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-orange-500 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-orange-500/20">
              <ShoppingBag className="text-white" size={22} />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              RWANDA <span className="text-orange-500 font-extrabold">DIGITAL MARKET</span>
            </span>
          </Link>

          {/* Desktop Links with animated underline */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`relative py-3 px-1 text-sm font-black uppercase tracking-wider group transition-colors ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'
                }`}
              >
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-orange-500 rounded-full transition-transform duration-300 origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-grow max-w-md mx-8">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (searchQuery.trim()) navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`); 
              }} 
              className="relative w-full group"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="What products are you looking for today?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="hidden sm:flex items-center space-x-4">
              <button className="text-slate-500 hover:text-orange-500 transition-colors relative p-2 hover:bg-slate-50 rounded-xl">
                <Heart size={20} />
              </button>
              
              <Link to="/cart" className="text-slate-500 hover:text-orange-500 transition-colors relative p-2 hover:bg-slate-50 rounded-xl">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              {userInfo && (
                <Link to="/messages" className="text-slate-500 hover:text-orange-500 transition-colors relative p-2 hover:bg-slate-50 rounded-xl">
                  <MessageSquare size={20} />
                </Link>
              )}
              {userInfo && <NotificationBell />}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {userInfo ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 group">
                  <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-black border-2 border-white shadow-md shadow-orange-500/20">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-black text-slate-700 hidden md:inline">{userInfo.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-slate-50 rounded-xl">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link to="/login" className="text-sm font-black uppercase tracking-wider text-slate-600 hover:text-orange-500">Log in</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30">Join Now</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2.5 rounded-2xl bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-500 hover:shadow-inner transition-all duration-300 border border-slate-100" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-300 z-50">
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-black uppercase tracking-wide text-slate-900 hover:text-orange-500"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-4">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-slate-600 font-bold hover:text-orange-500 transition-colors">
                <ShoppingCart size={20} /><span>My Cart ({cartCount})</span>
              </Link>
              
              {userInfo ? (
                <>
                  <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-slate-600 font-bold hover:text-orange-500 transition-colors">
                    <MessageSquare size={20} /><span>Messages</span>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-slate-600 font-bold hover:text-orange-500 transition-colors">
                    <User size={20} /><span>My Profile</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-2 text-red-500 font-bold hover:text-red-600 transition-colors w-full text-left">
                    <LogOut size={20} /><span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary w-full text-center py-3 font-bold uppercase tracking-wider">Log In</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full text-center py-3 font-bold uppercase tracking-wider">Join Rwanda Digital Market</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
