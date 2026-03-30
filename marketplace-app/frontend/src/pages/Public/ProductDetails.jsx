import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MessageCircle, ShoppingCart, ArrowLeft, 
  ShieldCheck, Truck, RefreshCw, Heart, Share2, Plus, Minus
} from 'lucide-react';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, loading: cartLoading } = useCartStore();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
       try {
         const { data: productData } = await api.get(`/products/${id}`);
         setProduct(productData);
         
         const { data: reviewsData } = await api.get(`/reviews/${id}`);
         setReviews(reviewsData);
       } catch (err) {
         setError('Failed to load product details');
       } finally {
         setLoading(false);
       }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6 text-center">
      <div className="bg-red-50 p-4 rounded-full text-red-600 mb-4"><ShieldCheck size={48} /></div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-500 mb-6">{error}</p>
      <Link to="/products" className="btn-primary">Back to Shopping</Link>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        <Link to="/products" className="inline-flex items-center space-x-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to products</span>
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery Mockup */}
            <div className="p-4 lg:p-8">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-slate-50 border border-slate-100 group">
                <img 
                  src={product.image || 'https://via.placeholder.com/800'} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-rose-500 transition-colors shadow-lg">
                  <Heart size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
            </div>
            
            {/* Details Content */}
            <div className="p-8 lg:p-16 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-black text-slate-900">{product.averageRating.toFixed(1)}</span>
                    <span className="text-xs font-bold text-slate-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                  {product.title}
                </h1>
                
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                    {product.traderId?.name?.charAt(0) || 'S'}
                  </div>
                  <span className="text-sm font-bold text-slate-500">
                    Curated by <span className="text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4 cursor-pointer">{product.traderId?.name || 'Exclusive Seller'}</span>
                  </span>
                </div>

                <div className="py-6 border-y border-slate-100 space-y-4 mb-8">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center space-x-2"><ShieldCheck size={16} className="text-indigo-500" /><span>2 Year Warranty</span></div>
                    <div className="flex items-center space-x-2"><Truck size={16} className="text-indigo-500" /><span>Free Shipping</span></div>
                  </div>
                </div>
                
                <div className="flex items-baseline space-x-3 mb-10">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">${product.price.toFixed(2)}</span>
                  <span className="text-lg text-slate-400 font-bold line-through">${(product.price * 1.2).toFixed(2)}</span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Save 20%</span>
                </div>
              </div>

              <div className="space-y-6 pt-8">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-600 active:scale-95"><Minus size={18} /></button>
                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-600 active:scale-95"><Plus size={18} /></button>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {product.stock > 10 ? <span className="text-emerald-600">● In Stock</span> : <span className="text-amber-500">● Only {product.stock} left in stock</span>}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    disabled={product.stock === 0 || cartLoading || !userInfo}
                    onClick={() => addToCart(product._id, quantity)}
                    className="flex-1 btn-primary py-4 text-base space-x-3"
                  >
                    {cartLoading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <><ShoppingCart size={22} /><span>Add to Experience</span></>}
                  </button>
                  
                  {userInfo && (
                    <Link to={`/chat/${product.traderId?._id}/${product._id}`} className="btn-secondary py-4 px-8 text-base group">
                      <MessageCircle size={22} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
                      <span>Inquire Now</span>
                    </Link>
                  )}
                </div>

                {!userInfo && (
                  <p className="text-xs text-center font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link> to unlock premium purchasing
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Sections */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Feedback</h2>
               <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-1">Insights from our elite circle</p>
            </div>
            {userInfo && (
              <button 
                onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-emerald py-3 px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10"
              >
                Share Your Experience
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {reviews.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                  <Star size={48} className="mx-auto mb-6 text-slate-100" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">Pristine Reputation</h3>
                  <p className="text-slate-400 font-medium max-w-sm mx-auto">This product hasn't been reviewed yet. Be the first to start the conversation.</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg">
                          {review.userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                             <p className="text-[13px] font-black text-slate-900">{review.userId.name}</p>
                             {review.isVerified && (
                               <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                 <ShieldCheck size={10} />
                                 <span>Verified</span>
                               </span>
                             )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500 bg-amber-50 px-3 py-1 rounded-xl">
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= review.rating ? "currentColor" : "none"} className="mr-0.5" />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-6 group-hover:border-indigo-500 transition-colors">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Card */}
            <div className="lg:col-span-1">
              <div id="review-form" className="sticky top-32 glass-card p-10 rounded-[3rem] border-white/50 shadow-2xl backdrop-blur-3xl">
                <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Submit Feedback</h3>
                
                {!userInfo ? (
                  <div className="text-center py-8">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                       Please <Link to="/login" className="text-indigo-600 hover:underline">Log In</Link> to share <br/> your professional opinion.
                     </p>
                  </div>
                ) : (
                  <ReviewForm productId={id} onReviewAdded={(newReview) => setReviews([newReview, ...reviews])} />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post('/reviews', { productId, rating, comment });
      onReviewAdded(data);
      setComment('');
      setRating(5);
      // Success feedback could be shown here
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-rose-50 text-rose-500 text-[10px] font-black uppercase rounded-xl border border-rose-100 text-center">{error}</div>}
      
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quality Rating</label>
        <div className="flex space-x-3">
          {[1,2,3,4,5].map(i => (
            <button 
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`p-2 rounded-xl transition-all duration-300 ${i <= rating ? 'bg-amber-100 text-amber-600 scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
            >
              <Star size={24} fill={i <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detailed Insights</label>
        <textarea 
          required
          rows="4"
          className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
          placeholder="Share your experience with the craftsmanship and utility..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={submitting}
        className="w-full btn-indigo py-4 rounded-2xl flex items-center justify-center space-x-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/10 active:scale-95 transition-all"
      >
        {submitting ? 'Authenticating...' : 'Publish Insight'}
      </button>
    </form>
  );
};

export default ProductDetails;
