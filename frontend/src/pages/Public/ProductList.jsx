import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Star, ChevronRight, LayoutGrid, 
  List, SlidersHorizontal, PackageX, ArrowUpDown, Heart
} from 'lucide-react';
import api from '../../services/api';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = [
    'Electronics', 'Fashion', 'Home & Kitchen', 
    'Groceries', 'Health & Beauty'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchParams);
      if (sortBy) queryParams.set('sortBy', sortBy);

      const { data } = await api.get(`/products?${queryParams.toString()}`);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (keyword) newParams.set('keyword', keyword);
    else newParams.delete('keyword');
    setSearchParams(newParams);
  };

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === cat) {
      newParams.delete('category');
      setCategory('');
    } else {
      newParams.set('category', cat);
      setCategory(cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <SlidersHorizontal size={15} className="mr-2 text-orange-500" />
                  Filters
                </h3>
                <button 
                  onClick={() => {
                    setSearchParams({});
                    setCategory('');
                    setKeyword('');
                  }}
                  className="text-[10px] font-black text-orange-500 uppercase hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Search Within */}
              <div className="mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search keyword</label>
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="Find premium goods..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-4 pr-10 text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors">
                    <Search size={16} />
                  </button>
                </form>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Categories</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group ${
                        category === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 border-transparent' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span>{cat}</span>
                      <ChevronRight size={14} className={`transition-transform ${category === cat ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {category || 'Collections'}
                </h1>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {products.length} products found
                </p>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Top Rated</option>
                  </select>
                </div>
                <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                   <button className="p-1.5 text-orange-600 bg-orange-50 rounded-lg"><LayoutGrid size={18} /></button>
                   <button className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors rounded-lg"><List size={18} /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-64 sm:h-[28rem] animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 glass-card rounded-[3rem] border-slate-100 max-w-2xl mx-auto bg-white">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                  <PackageX size={48} className="text-slate-200" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">No products found</h2>
                <p className="text-slate-500 font-semibold mb-10 px-8">We couldn't find any products matching your specific search query. Try resetting filters.</p>
                <button 
                  onClick={() => {
                    setSearchParams({});
                    setCategory('');
                    setKeyword('');
                  }}
                  className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/20"
                >
                  Explore Global Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                {products.map(product => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
                      <img 
                        src={product.image || `https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`;
                        }}
                      />
                      
                      {/* Wishlist badge */}
                      <button 
                        onClick={(e) => { e.preventDefault(); /* wishlist logic */ }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-400 hover:text-rose-500 shadow-sm transition-colors z-20"
                      >
                        <Heart size={16} fill="none" />
                      </button>

                      {/* Stock Status */}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="bg-white/90 text-slate-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-orange-500 transition-colors text-xs sm:text-sm line-clamp-2 mb-1">{product.title}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star size={12} className="text-amber-500" fill="currentColor" />
                          <span className="text-xs font-medium text-slate-500">{(product.averageRating || 0).toFixed(1)}</span>
                          <span className="text-xs text-slate-300 px-1">•</span>
                          <span className="text-xs text-slate-500">{product.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-2 pt-2 border-t border-slate-50">
                        <p className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">RWF {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProductList;
