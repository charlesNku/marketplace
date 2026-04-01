import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShoppingBag, Star, Zap, ShieldCheck, 
  Truck, ArrowUpRight, Smartphone, Shirt, Home as HomeIcon, 
  ShoppingBasket, Sparkles 
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
          api.get('/products?sortBy=price_desc&pageSize=4'),
          api.get('/products?sortBy=price_asc&pageSize=4'),
          api.get('/products?sortBy=rating_desc&pageSize=4')
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
    { name: 'Electronics', icon: Smartphone, color: 'bg-indigo-500', count: 'Premium Tech' },
    { name: 'Fashion', icon: Shirt, color: 'bg-rose-500', count: 'Latest Trends' },
    { name: 'Home & Kitchen', icon: HomeIcon, color: 'bg-amber-500', count: 'Living Better' },
    { name: 'Groceries', icon: ShoppingBasket, color: 'bg-emerald-500', count: 'Daily Fresh' },
    { name: 'Health & Beauty', icon: Sparkles, color: 'bg-purple-500', count: 'Care & Glow' },
  ];

  const ProductCard = ({ p, badge, color }) => (
    <Link key={p._id} to={`/product/${p._id}`} className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden">
      {badge && (
        <div className={`absolute top-0 left-0 ${color} text-white px-6 py-1 rounded-br-2xl text-[10px] font-black uppercase tracking-widest z-20`}>
          {badge}
        </div>
      )}
      <div className="relative rounded-[2rem] overflow-hidden aspect-square mb-6">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
          {p.category}
        </div>
      </div>
      <div className="px-2 pb-2 space-y-2 flex-grow">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-slate-900 hover:text-indigo-600 transition-colors truncate pr-2">{p.title}</h4>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-black text-slate-900">{p.averageRating}</span>
          </div>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight">RWF {p.price.toLocaleString()}</p>
        <div className="pt-4 mt-auto">
          <button className="w-full py-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );

  const Section = ({ title, subtitle, products, badge, color }) => (
    <section className="py-24 bg-slate-50 even:bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{subtitle}</h2>
          <h3 className="text-5xl font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-slate-100"></div>
            ))
          ) : (
            products.map((p) => <ProductCard key={p._id} p={p} badge={badge} color={color} />)
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">New Collection 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Premium <br />
              <span className="text-gradient">Marketplace</span> For <br />
              Smart Shoppers.
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
              Discover a curated collection of world-class products. From luxury tech to daily essentials, we bring premium quality to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products" className="btn-primary py-4 px-8 text-lg">
                <span>Explore Store</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000" alt="Hero" className="w-full object-cover aspect-[4/5] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">World Class Selection</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">Curated Categories</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.name}`} className="group relative bg-slate-50 rounded-[2.5rem] p-8 overflow-hidden hover:bg-slate-900 transition-all duration-500 text-center flex flex-col items-center">
                <div className={`${cat.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                  <cat.icon size={36} />
                </div>
                <h4 className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{cat.name}</h4>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 mt-2 transition-colors">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <Section 
        title="Top Rated Products" 
        subtitle="Customer Favorites" 
        products={sections.top} 
        badge="Top Rated" 
        color="bg-amber-500"
      />

      {/* Premium Products Section */}
      <Section 
        title="Premium Collection" 
        subtitle="Luxury & Performance" 
        products={sections.highest} 
        badge="Premium" 
        color="bg-indigo-600"
      />

      {/* Budget Selection Section */}
      <Section 
        title="Best Value Picks" 
        subtitle="Quality Essentials" 
        products={sections.lowest} 
        badge="Best Value" 
        color="bg-emerald-500"
      />

      {/* Trust Badges */}
      <section className="py-16 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center space-x-6 text-slate-900">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Truck size={32} /></div>
            <div>
              <h4 className="font-black text-lg">Worldwide Delivery</h4>
              <p className="text-sm font-medium text-slate-500">Free shipping on orders over $150</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-slate-900">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><ShieldCheck size={32} /></div>
            <div>
              <h4 className="font-black text-lg">Secure Payment</h4>
              <p className="text-sm font-medium text-slate-500">100% secure payment gateway</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-slate-900">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600"><Zap size={32} /></div>
            <div>
              <h4 className="font-black text-lg">Instant Support</h4>
              <p className="text-sm font-medium text-slate-500">Dedicated 24/7 expert assistance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
