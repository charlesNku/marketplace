import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, User, LogOut, Menu, X, Search, 
  ShoppingCart, Heart, MessageSquare, ChevronDown
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (userInfo) fetchCart();
    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            MARKET<span className="text-indigo-600">PRO</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-bold transition-colors ${
                location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-grow max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search premium products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 md:space-x-5">
          <div className="hidden sm:flex items-center space-x-4">
            <button className="text-slate-500 hover:text-indigo-600 transition-colors relative">
              <Heart size={20} />
            </button>
            <Link to="/cart" className="text-slate-500 hover:text-indigo-600 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {userInfo && <NotificationBell />}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {userInfo ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-colors group">
                <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden md:inline">{userInfo.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600">Log in</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm">Join Now</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-slate-900"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <Link to="/cart" className="flex items-center space-x-2 text-slate-600 font-bold">
                <ShoppingCart size={20} /><span>My Cart</span>
              </Link>
              {!userInfo && (
                <Link to="/register" className="btn-primary w-full text-center">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
