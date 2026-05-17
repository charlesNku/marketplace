import React, { useEffect, useState } from 'react';
import { 
  Package, DollarSign, List, Edit, Trash2, 
  TrendingUp, Users, ShoppingBag, Plus, MoreVertical,
  Search, ExternalLink, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const TraderDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', image: '', stock: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTraderProducts();
  }, [userInfo]);

  const fetchTraderProducts = async () => {
    if (!userInfo) return;
    try {
      const { data } = await api.get('/products');
      const myProducts = data.products.filter(p => p.traderId === userInfo._id || p.traderId?._id === userInfo._id);
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirm product removal from your collection?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: '', category: '', image: '', stock: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ title: '', description: '', price: '', category: '', image: '', stock: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      await fetchTraderProducts();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Inventory', value: products.length, icon: Package, color: 'indigo', trend: '+12%' },
    { title: 'Store Revenue', value: 'RWF 8,432,000', icon: DollarSign, color: 'emerald', trend: '+18%' },
    { title: 'Orders Today', value: '12', icon: ShoppingBag, color: 'amber', trend: '+5%' },
    { title: 'Profile Visits', value: '1.2k', icon: Users, color: 'slate', trend: '+24%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Merchant Console</h1>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Business Overview</h2>
            <p className="text-slate-500 mt-2 font-medium italic">Welcome back, {userInfo?.name?.split(' ')[0]}. Here's your store's performance at a glance.</p>
          </div>
          <div className="flex items-center space-x-4">
             <button onClick={() => handleOpenModal()} className="btn-primary py-4 px-8 inline-flex items-center space-x-2">
                <Plus size={18} />
                <span>List New Product</span>
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] border-slate-100 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-[1.5rem] group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-${stat.color === 'emerald' ? 'emerald' : 'indigo'}-500 bg-${stat.color === 'emerald' ? 'emerald' : 'indigo'}-50 px-3 py-1 rounded-full`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Product Management */}
        <div className="glass-card rounded-[3rem] border-slate-100 overflow-hidden shadow-xl">
          <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Inventory Management</h3>
              <p className="text-sm font-medium text-slate-400">Manage and track your listed products</p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search collection..." 
                className="bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-6 text-xs font-bold w-full md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-medium italic">Your inventory is currently empty.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.image || 'https://via.placeholder.com/80'} alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 line-clamp-1">{product.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                               <TrendingUp size={12} className="text-emerald-500" />
                               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Top Performing</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-black text-slate-900">RWF {product.price.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-tight mt-0.5">MSRP RWF {(product.price * 1.2).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block w-fit ${
                             product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                           }`}>
                             {product.stock > 10 ? 'High Stock' : product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 mt-1 ml-1">{product.stock} Units Remaining</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-end space-x-3">
                           <Link to={`/product/${product._id}`} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                              <ExternalLink size={18} />
                           </Link>
                           <button onClick={() => handleOpenModal(product)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                              <Edit size={18} />
                           </button>
                           <button onClick={() => handleDelete(product._id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">{editingProduct ? 'Edit Product' : 'List New Product'}</h3>
                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Title</label>
                    <input 
                      type="text" required 
                      className="premium-input"
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Premium Wireless Headphones"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      required 
                      className="premium-input"
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Home">Home</option>
                      <option value="Beauty">Beauty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price (RWF)</label>
                    <input 
                      type="number" required min="0" step="1"
                      className="premium-input"
                      value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Stock</label>
                    <input 
                      type="number" required min="0" step="1"
                      className="premium-input"
                      value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input 
                    type="url" required 
                    className="premium-input"
                    value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required rows="4"
                    className="premium-input resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your product in detail..."
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-4">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary py-3 px-6">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TraderDashboard;
