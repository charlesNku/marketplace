import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MessageCircle, ShoppingCart, ArrowLeft, 
  ShieldCheck, Truck, RefreshCw, Heart, Share2, Plus, Minus,
  AlertCircle, X
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
  const [activeImage, setActiveImage] = useState('');
  const [selectedPaymentInfo, setSelectedPaymentInfo] = useState(null);
  
  const { addToCart, loading: cartLoading } = useCartStore();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
       try {
         const { data: productData } = await api.get(`/products/${id}`);
         setProduct(productData);
         setActiveImage(productData.image);
         
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <Link to="/products" className="inline-flex items-center space-x-2 text-slate-500 hover:text-orange-500 font-bold mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to products</span>
        </Link>

        {/* ðŸŒŸ Nihemart split-row product card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Media Gallery */}
            <div className="p-6 md:p-10 border-r border-slate-100 flex flex-col justify-between">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-white flex items-center justify-center group">
                <img 
                  src={activeImage || product.image || `https://placehold.co/800x800/ffffff/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/800x800/ffffff/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`;
                  }}
                />
                <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-md border border-slate-100">
                  <Heart size={18} />
                </button>
              </div>                {/* Thumbnail Previews with dynamic orange outline on active */}
              {product.image && product.image.split(',').length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                   {product.image.split(',').map((imgUrl, i) => (
                     <div 
                       key={i} 
                       onClick={() => setActiveImage(imgUrl.trim())}
                       className={`relative flex-shrink-0 w-20 h-20 rounded-xl bg-white overflow-hidden border cursor-pointer transition-all ${
                         activeImage === imgUrl.trim() ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 hover:border-slate-300'
                       }`}
                     >
                       <img
                         src={imgUrl.trim() || `https://placehold.co/200x200/f8fafc/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`}
                         alt={`View ${i + 1}`}
                         className="w-full h-full object-contain p-1 bg-white"
                         onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = `https://placehold.co/200x200/f8fafc/94a3b8?text=${encodeURIComponent(product.category || 'Product')}`;
                         }}
                       />
                       <div className={`absolute top-1 left-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          activeImage === imgUrl.trim() ? 'bg-orange-500 text-white' : 'bg-slate-900/50 text-white backdrop-blur-sm'
                       }`}>
                          {i + 1}
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
            
            {/* Right Details Panel */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-black text-slate-900">{(product.averageRating || 0).toFixed(1)}</span>
                    <span className="text-xs font-bold text-slate-400">({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                  {product.title}
                </h1>
                
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-orange-500/20">
                    {product.traderId?.name?.charAt(0) || 'S'}
                  </div>
                  <span className="text-sm font-bold text-slate-500">
                    Curated by <span className="text-slate-900 underline decoration-orange-500 decoration-2 underline-offset-4 cursor-pointer">{product.traderId?.name || 'Exclusive Seller'}</span>
                  </span>
                </div>

                <div className="py-6 border-y border-slate-100 space-y-4 mb-8">
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    {product.description}
                  </p>
                  
                  {/* Delivery notification notice bar */}
                  <div className="bg-orange-50 border border-orange-500/10 rounded-2xl p-4 flex items-start space-x-3 text-orange-800">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <div className="text-xs font-semibold">
                      <p className="font-bold uppercase tracking-wider">Fast Local Courier Shipping</p>
                      <p className="mt-0.5 text-orange-700/80">Typically dispatched within 24 hours inside Kigali City.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-baseline space-x-3 mb-10">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">RWF {product.price.toLocaleString()}</span>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg uppercase tracking-wider border border-amber-100">Only {product.stock} items left</span>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center space-x-6">
                  {/* Inline Quantity Picker */}
                  <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 active:scale-95 shadow-sm"><Minus size={15} /></button>
                    <span className="w-12 text-center font-black text-sm text-slate-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 active:scale-95 shadow-sm"><Plus size={15} /></button>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {product.stock > 10 ? <span className="text-emerald-600">● In Stock</span> : <span className="text-amber-500">● Low stock limit</span>}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Solid Orange Add to Cart Button */}
                  {userInfo ? (
                    <button 
                      id="add-to-cart-btn"
                      disabled={product.stock === 0 || cartLoading}
                      onClick={() => addToCart(product._id, quantity)}
                      className="flex-1 btn-primary py-4 text-xs font-black uppercase tracking-wider space-x-2 shadow-lg shadow-orange-500/20 flex items-center justify-center hover:scale-[1.02] transition-transform"
                    >
                      {cartLoading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <><ShoppingCart size={18} /><span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span></>}
                    </button>
                  ) : (
                    <Link 
                      to={`/register?redirect=/product/${product._id}`}
                      className="flex-1 btn-primary py-4 text-xs font-black uppercase tracking-wider space-x-2 shadow-lg shadow-orange-500/20 flex items-center justify-center hover:scale-[1.02] transition-transform"
                    >
                      <ShoppingCart size={18} /><span>Sign in to Buy</span>
                    </Link>
                  )}
                  
                  {userInfo ? (
                    <Link to={`/chat/${product.traderId?._id}/${product._id}`} className="flex-1 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl py-4 px-4 text-xs font-black uppercase tracking-wider group flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                      <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                      <span>Chat with Seller</span>
                    </Link>
                  ) : (
                    <Link to={`/register?redirect=/product/${product._id}`} className="flex-1 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl py-4 px-4 text-xs font-black uppercase tracking-wider group flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]">
                      <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                      <span>Chat with Seller</span>
                    </Link>
                  )}
                </div>

                {/* Secure Payment Procedures & Guarantees */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Accepted Payment Procedures</p>
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <button onClick={() => setSelectedPaymentInfo('VISA')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center space-x-1 shadow-sm hover:shadow-md transition-shadow hover:scale-105">
                      <span className="text-sm font-black text-blue-900 italic tracking-tighter">VISA</span>
                    </button>
                    <button onClick={() => setSelectedPaymentInfo('Mastercard')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center space-x-1 shadow-sm hover:shadow-md transition-shadow hover:scale-105">
                      <div className="flex -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-red-500 mix-blend-multiply"></div>
                        <div className="w-4 h-4 rounded-full bg-amber-500 mix-blend-multiply"></div>
                      </div>
                      <span className="text-xs font-black text-slate-800 ml-1.5">Mastercard</span>
                    </button>
                    <button onClick={() => setSelectedPaymentInfo('MTN MoMo')} className="px-4 py-2 bg-[#ffcc00] border border-[#e6b800] rounded-xl flex items-center shadow-sm hover:shadow-md transition-shadow hover:scale-105">
                      <span className="text-xs font-black text-[#000066] tracking-tight">MTN MoMo</span>
                    </button>
                    <button onClick={() => setSelectedPaymentInfo('Airtel Money')} className="px-4 py-2 bg-[#ff0000] border border-[#cc0000] rounded-xl flex items-center shadow-sm hover:shadow-md transition-shadow hover:scale-105">
                      <span className="text-xs font-black text-white tracking-tight">Airtel Money</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex items-center space-x-3 p-3.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <ShieldCheck size={20} className="flex-shrink-0" />
                        <span className="text-xs font-bold leading-tight">100% Secure & Encrypted</span>
                     </div>
                     <div className="flex items-center space-x-3 p-3.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <RefreshCw size={20} className="flex-shrink-0" />
                        <span className="text-xs font-bold leading-tight">Easy Local Returns</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Sections */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
               <p className="text-xs font-black text-orange-500 uppercase tracking-widest mt-1">{reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}</p>
            </div>
            {userInfo && (
              <button 
                id="write-review-btn"
                onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-emerald py-3 px-6 text-xs font-black uppercase tracking-wider"
              >
                Write a Review
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {reviews.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                  <Star size={48} className="mx-auto mb-6 text-slate-100" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-400 font-semibold max-w-sm mx-auto">This product hasn't been reviewed yet. Be the first to start the conversation.</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg">
                          {review.userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                             <p className="text-sm font-bold text-slate-800">{review.userId.name}</p>
                             {review.isVerified && (
                               <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
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
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-orange-100 pl-6 group-hover:border-orange-500 transition-colors">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit Review Card */}
            <div className="lg:col-span-1">
              <div id="review-form" className="sticky top-32 bg-white border border-slate-100 p-10 rounded-3xl shadow-2xl backdrop-blur-3xl">
                <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Submit Feedback</h3>
                
                {!userInfo ? (
                  <div className="text-center py-8">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                       Please <Link to="/login" className="text-orange-500 hover:underline">Log In</Link> to share <br/> your professional opinion.
                     </p>
                  </div>
                ) : (
                  <ReviewForm productId={id} onReviewAdded={(newReview) => setReviews([newReview, ...reviews])} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Payment Procedure Info Modal */}
        {selectedPaymentInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Procedure</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedPaymentInfo}</p>
                </div>
                <button 
                  onClick={() => setSelectedPaymentInfo(null)}
                  className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                {(selectedPaymentInfo === 'VISA' || selectedPaymentInfo === 'Mastercard') && (
                  <div className="space-y-4">
                     <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                       To complete your purchase with your {selectedPaymentInfo} card, please add the item to your cart and proceed to checkout.
                     </p>
                     <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3 text-blue-800">
                        <ShieldCheck size={20} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">Bank-Grade Encryption</p>
                          <p className="text-xs font-medium text-blue-700/80 mt-1">Your card details are fully encrypted and never stored on our servers.</p>
                        </div>
                     </div>
                  </div>
                )}
                
                {(selectedPaymentInfo === 'MTN MoMo' || selectedPaymentInfo === 'Airtel Money') && (
                  <div className="space-y-4">
                     <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                       To complete your purchase via Mobile Money, please follow these steps to send the money:
                     </p>
                     <ol className="list-decimal list-inside space-y-3 text-sm font-bold text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                       <li>Dial <span className="text-orange-500 font-black">*182#</span> on your mobile phone</li>
                       <li>Select <span className="text-orange-500 font-black">1</span> (Send Money)</li>
                       <li>Select <span className="text-orange-500 font-black">1</span> (To MTN number)</li>
                       <li>Enter our payment number: <span className="text-orange-500 font-black">0790087715</span></li>
                       <li>Enter the total amount for your order</li>
                       <li>Confirm the payment with your Mobile Money PIN</li>
                       <li>Keep your transaction message and click <span className="text-orange-500">Add to Cart</span> to checkout</li>
                     </ol>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedPaymentInfo(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

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
          className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-xs font-semibold focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
          placeholder="Share your experience with the craftsmanship and utility..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <button 
        type="submit" 
        id="submit-review-btn"
        disabled={submitting}
        className="w-full btn-primary py-4 rounded-xl flex items-center justify-center space-x-3 text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-orange-500/10"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ProductDetails;

