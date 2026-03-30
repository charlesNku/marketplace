import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShoppingBag, Star, Zap, ShieldCheck, 
  Truck, ArrowUpRight, Smartphone, Shirt, Home as HomeIcon, 
  ShoppingBasket, Sparkles 
} from 'lucide-react';
import api from '../../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?pageSize=8');
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'bg-blue-500', count: '1.2k+ Products' },
    { name: 'Fashion', icon: Shirt, color: 'bg-rose-500', count: '850+ Products' },
    { name: 'Home & Kitchen', icon: HomeIcon, color: 'bg-amber-500', count: '640+ Products' },
    { name: 'Groceries', icon: ShoppingBasket, color: 'bg-emerald-500', count: '2.1k+ Products' },
    { name: 'Health & Beauty', icon: Sparkles, color: 'bg-purple-500', count: '420+ Products' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
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
              Elevate Your <br />
              <span className="text-gradient">Lifestyle</span> With <br />
              Premium Goods.
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
              Discover a curated collection of world-class products. From cutting-edge electronics to artisan groceries, we bring quality to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products" className="btn-primary py-4 px-8 text-lg">
                <span>Shop Collection</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn-secondary py-4 px-8 text-lg bg-transparent text-white border-white/20 hover:bg-white/10">
                <span>Join Marketplace</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-black text-white">50k+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Users</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div>
                <p className="text-2xl font-black text-white">120+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Premium Brands</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Expert Support</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-float">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000" alt="Hero" className="w-full object-cover aspect-[4/5]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 p-6 glass-card rounded-3xl border-white/20 max-w-xs">
                <div className="flex items-center space-x-1 text-amber-500 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug italic">
                  "The quality of products and the seamless experience is truly world-class. Highly recommended!"
                </p>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-4">Sarah Jenkins — Platinum Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Browse Collection</h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Curated Categories</h3>
            </div>
            <Link to="/products" className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center group">
              View All Categories <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to={`/products?category=${cat.name}`} className="group relative bg-slate-50 rounded-[2rem] p-8 overflow-hidden hover:bg-slate-900 transition-all duration-500">
                <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                  <cat.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{cat.name}</h4>
                <p className="text-sm font-medium text-slate-500 group-hover:text-slate-400 mt-2 transition-colors">{cat.count}</p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900">
                     <ArrowRight size={18} />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Don't Miss Out</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">Trending Now</h3>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Discover our most popular products this week. From top tech to essentials, find what everyone's talking about.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-slate-100"></div>
              ))
            ) : (
              products.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
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
                    <p className="text-2xl font-black text-slate-900 tracking-tight">${p.price.toFixed(2)}</p>
                    <div className="pt-4 mt-auto">
                      <button className="w-full py-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

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
