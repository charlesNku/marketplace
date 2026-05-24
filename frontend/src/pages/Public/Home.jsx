import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShoppingBag, Star, Zap, ShieldCheck, 
  Truck, ArrowUpRight, Smartphone, Shirt, Home as HomeIcon, 
  ShoppingBasket, Sparkles, Heart, ChevronLeft, ChevronRight
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
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-slate-900 pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Platform Live Seeding v2.4</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
              A Smarter Way <br />
              To Buy <span className="text-orange-500">Premium</span> <br />
              Products Online.
            </h1>
            
            <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed font-semibold mx-auto lg:mx-0">
              Discover verified quality products shipped directly to your home. Explore exclusive vendor collections and enjoy secure local payment protocols.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link to="/products" className="btn-primary py-4 px-8 text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center space-x-2">
                <span>Shop Catalog</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-800/20 p-2">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000" 
                alt="Nihemart Showcase" 
                className="w-full object-cover aspect-[4/3] rounded-[2rem]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Nihemart horizontal category slider */}
      <section className="py-16 bg-white border-b border-slate-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.25em] mb-2">Explore Selection</h2>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Browse by Category</h3>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide scroll-smooth">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                to={`/products?category=${cat.name}`} 
                className="flex-shrink-0 w-44 bg-white border border-slate-100 rounded-3xl p-5 hover:border-orange-500/30 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group relative shadow-sm"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 border ${cat.color}`}>
                  <cat.icon size={26} />
                </div>
                <h4 className="text-sm font-black text-slate-800 leading-tight tracking-tight">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{cat.desc}</p>
              </Link>
            ))}
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
