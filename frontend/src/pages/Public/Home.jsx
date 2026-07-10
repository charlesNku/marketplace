import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShoppingBag, Star, Zap, ShieldCheck,
  Truck, ArrowUpRight, Smartphone, Shirt, Home as HomeIcon,
  ShoppingBasket, Sparkles, Heart, ChevronLeft, ChevronRight,
  Store, DollarSign, Users, Package, TrendingUp, User,
  Car, Book, Dumbbell, Gamepad2, Monitor,
  Palette, Gem, Music, Baby, Leaf, Briefcase, Wrench, Sofa, Luggage, Camera,
  Watch, PawPrint, Factory, Scissors, Cpu, Gift, Coffee, Pill
} from 'lucide-react';
import api from '../../services/api';

const Home = () => {
  const [sections, setSections] = useState({
    highest: [],
    lowest: [],
    top: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [highestRes, lowestRes, topRes] = await Promise.all([
          api.get('/products?sortBy=price_desc&pageSize=5'),
          api.get('/products?sortBy=price_asc&pageSize=5'),
          api.get('/products?sortBy=rating_desc&pageSize=5')
        ]);

        setSections({
          highest: highestRes.data.products || [],
          lowest: lowestRes.data.products || [],
          top: topRes.data.products || [],
        });
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', desc: 'Premium Tech' },
    { name: 'Fashion', icon: Shirt, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', desc: 'Latest Trends' },
    { name: 'Home & Kitchen', icon: HomeIcon, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', desc: 'Living Better' },
    { name: 'Groceries', icon: ShoppingBasket, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', desc: 'Daily Fresh' },
    { name: 'Health & Beauty', icon: Sparkles, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', desc: 'Care & Glow' },
    { name: 'Automotive', icon: Car, color: 'bg-red-500/10 text-red-500 border-red-500/20', desc: 'Car Parts & Acc.' },
    { name: 'Books & Media', icon: Book, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', desc: 'Read & Enjoy' },
    { name: 'Sports', icon: Dumbbell, color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', desc: 'Active Life' },
    { name: 'Toys & Games', icon: Gamepad2, color: 'bg-pink-500/10 text-pink-500 border-pink-500/20', desc: 'Fun for All' },
    { name: 'Computers & IT', icon: Monitor, color: 'bg-blue-600/10 text-blue-600 border-blue-600/20', desc: 'Laptops & PCs' },
    { name: 'Art & Crafts', icon: Palette, color: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20', desc: 'Creative Tools' },
    { name: 'Jewelry', icon: Gem, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', desc: 'Luxury Acc.' },
    { name: 'Music', icon: Music, color: 'bg-violet-500/10 text-violet-500 border-violet-500/20', desc: 'Instruments' },
    { name: 'Baby Products', icon: Baby, color: 'bg-sky-500/10 text-sky-500 border-sky-500/20', desc: 'Kids & More' },
    { name: 'Outdoors', icon: Leaf, color: 'bg-lime-500/10 text-lime-500 border-lime-500/20', desc: 'Garden Life' },
    { name: 'Office', icon: Briefcase, color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', desc: 'Work Supplies' },
    { name: 'Hardware', icon: Wrench, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', desc: 'Tools & Fix' },
    { name: 'Furniture', icon: Sofa, color: 'bg-amber-600/10 text-amber-600 border-amber-600/20', desc: 'Home Setup' },
    { name: 'Travel', icon: Luggage, color: 'bg-blue-400/10 text-blue-400 border-blue-400/20', desc: 'Luggage Bags' },
    { name: 'Photography', icon: Camera, color: 'bg-stone-500/10 text-stone-500 border-stone-500/20', desc: 'Cameras & Lenses' },
    { name: 'Pet Supplies', icon: PawPrint, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', desc: 'For Pets' },
    { name: 'Industrial', icon: Factory, color: 'bg-slate-400/10 text-slate-400 border-slate-400/20', desc: 'B2B & Heavy' },
    { name: 'Watches', icon: Watch, color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20', desc: 'Timepieces' },
    { name: 'Salon & Spa', icon: Scissors, color: 'bg-pink-400/10 text-pink-400 border-pink-400/20', desc: 'Beauty Pro' },
    { name: 'Components', icon: Cpu, color: 'bg-teal-400/10 text-teal-400 border-teal-400/20', desc: 'PC Parts' },
    { name: 'Gifts', icon: Gift, color: 'bg-rose-400/10 text-rose-400 border-rose-400/20', desc: 'Presents' },
    { name: 'Cafe & Tea', icon: Coffee, color: 'bg-amber-700/10 text-amber-700 border-amber-700/20', desc: 'Hot Drinks' },
    { name: 'Pharmacy', icon: Pill, color: 'bg-red-400/10 text-red-400 border-red-400/20', desc: 'Medicines' },
  ];

  const ProductCard = ({ p, badge, color }) => (
    <div key={p._id} className="group bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 hover:shadow-2xl hover:border-orange-500/10 transition-all duration-500 flex flex-col relative overflow-hidden h-full">
      {/* 🌟 Nihemart Top-Left Price Overlay badge */}
      <div className="absolute top-0 left-0 bg-orange-500 text-white px-4 py-1.5 rounded-br-2xl text-[10px] font-black uppercase tracking-wider z-20 shadow-md">
        RWF {p.price.toLocaleString()}
      </div>

      {/* 🌟 Nihemart Top-Right Wishlist badge */}
      <button className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-full text-slate-400 hover:text-rose-500 shadow-md transition-colors z-20">
        <Heart size={15} fill="none" />
      </button>

      <Link to={`/product/${p._id}`} className="block relative rounded-2xl overflow-hidden aspect-square mb-4 bg-slate-50 border border-slate-100">
        <img
          src={p.image || `https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(p.category || 'Product')}`}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(p.category || 'Product')}`;
          }}
        />
      </Link>

      <div className="px-1 flex flex-col flex-grow justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{p.category}</span>
            <div className="flex items-center space-x-0.5 text-amber-500">
              <Star size={11} fill="currentColor" />
              <span className="text-[11px] font-black text-slate-900">{p.averageRating}</span>
            </div>
          </div>
          <Link to={`/product/${p._id}`}>
            <h4 className="font-bold text-slate-800 hover:text-orange-500 transition-colors text-xs sm:text-sm line-clamp-2 leading-snug">{p.title}</h4>
          </Link>
        </div>

        <div className="pt-4 mt-auto">
          <Link to={`/product/${p._id}`} className="block text-center w-full py-2.5 bg-slate-50 hover:bg-orange-500 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-slate-100 hover:border-transparent text-slate-600">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, subtitle, products, badge, color }) => (
    <section className="py-20 bg-slate-50 even:bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.25em] mb-2">{subtitle}</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h3>
          </div>
          <Link to="/products" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 flex items-center transition-colors">
            <span>View All Products</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100"></div>
            ))
          ) : (
            products.map((p) => <ProductCard key={p._id} p={p} badge={badge} color={color} />)
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex flex-col pt-16">
      {/* 🌟 Immersive Nihemart Hero carousel banner */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-900 pb-12 pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 flex flex-col items-center justify-center">
          <div className="space-y-8 text-center w-full max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 bg-orange-500/5 border border-orange-500/10 px-3 py-1.5 rounded-full">
              <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em]">Platform Live Seeding v2.4</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              One Marketplace. <br />
              Endless <span className="text-orange-500">Possibilities.</span>
            </h1>

            <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed mx-auto">
              From fashion and electronics to home essentials and more, find everything you need in one trusted destination. Shop smarter and discover incredible value every day.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/products" className="btn-primary py-3 px-6 text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center space-x-2">
                <span>Start Shopping</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/register?redirect=/trader/dashboard&role=trader" className="py-3 px-6 text-xs font-bold uppercase tracking-wider border border-white/20 text-white rounded-2xl hover:bg-white/5 backdrop-blur-md transition-all flex items-center space-x-2 group">
                <Store size={14} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Become a Vendor</span>
              </Link>
            </div>

            {/* Categories horizontal slider moved inside Hero */}
            <div className="w-full pt-16 pb-4">
              <div className="flex overflow-x-auto gap-2 md:gap-2.5 pb-4 scrollbar-hide scroll-smooth justify-start w-full px-2">
                {categories.map((cat, i) => (
                  <Link
                    key={i}
                    to={`/products?category=${cat.name}`}
                    className="flex-shrink-0 w-20 sm:w-24 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 hover:bg-slate-800 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group relative shadow-sm"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-500 border ${cat.color}`}>
                      <cat.icon size={18} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-[9px] sm:text-[10px] font-black text-white leading-tight tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{cat.name}</h4>
                    <p className="text-[7px] sm:text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{cat.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <Section
        title="Customer Favorites"
        subtitle="Highly Rated Selection"
        products={sections.top}
        badge="Top Rated"
        color="bg-orange-500"
      />

      {/* Premium Products Section */}
      <Section
        title="Premium Collection"
        subtitle="Exclusive Quality Essentials"
        products={sections.highest}
        badge="Premium"
        color="bg-orange-500"
      />

      {/* Budget Selection Section */}
      <Section
        title="Best Value Picks"
        subtitle="Best Price Opportunities"
        products={sections.lowest}
        badge="Best Value"
        color="bg-orange-500"
      />

      {/* 🌟 Start Selling CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <Store size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Become a Seller</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Turn Your Products Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Profit Today.</span>
              </h2>

              <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed font-semibold mx-auto lg:mx-0">
                Join hundreds of successful vendors on Rwanda Digital Market. List your products, reach thousands of buyers, and grow your business — all with zero upfront costs.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Zero Fees</p>
                    <p className="text-[10px] font-semibold text-slate-500">Free to list</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">1000+ Buyers</p>
                    <p className="text-[10px] font-semibold text-slate-500">Active daily</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Easy Listing</p>
                    <p className="text-[10px] font-semibold text-slate-500">In minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Grow Fast</p>
                    <p className="text-[10px] font-semibold text-slate-500">Analytics built-in</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register?redirect=/trader/dashboard&role=trader" className="py-4 px-8 text-sm font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center space-x-2 group">
                  <Store size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Start Selling Now</span>
                  <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right — Steps */}
            <div className="space-y-6">
              {[
                { step: '01', title: 'Create Your Account', desc: 'Sign up for free as a vendor in under 2 minutes.', icon: User, color: 'emerald' },
                { step: '02', title: 'List Your Products', desc: 'Add product images, descriptions, pricing, and stock levels.', icon: Package, color: 'teal' },
                { step: '03', title: 'Start Earning', desc: 'Receive orders, chat with buyers, and get paid via Mobile Money.', icon: DollarSign, color: 'emerald' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className={`flex-shrink-0 w-14 h-14 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-[10px] font-black text-${item.color}-400 uppercase tracking-widest bg-${item.color}-500/10 px-3 py-1 rounded-full`}>Step {item.step}</span>
                    </div>
                    <h4 className="text-base font-black text-white mb-1">{item.title}</h4>
                    <p className="text-sm font-medium text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-6 text-slate-900 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500"><Truck size={28} /></div>
            <div>
              <h4 className="font-black text-base">Reliable Delivery</h4>
              <p className="text-xs font-semibold text-slate-500">Free local delivery on orders above RWF 150,000</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-slate-900 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><ShieldCheck size={28} /></div>
            <div>
              <h4 className="font-black text-base">100% Secure Checkout</h4>
              <p className="text-xs font-semibold text-slate-500">Fast local bank transfer and wallet payments</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-slate-900 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500"><Zap size={28} /></div>
            <div>
              <h4 className="font-black text-base">Professional Support</h4>
              <p className="text-xs font-semibold text-slate-500">Direct dialing helpline assistance anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
