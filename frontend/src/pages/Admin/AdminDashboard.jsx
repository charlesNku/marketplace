import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ShoppingBag, ShoppingCart, Activity, TrendingUp,
  AlertCircle, CheckCircle2, Clock, Search, Settings, Bell,
  LogOut, ChevronRight, MoreVertical, BarChart3, Lock,
  Edit, Trash2, Plus, X, Save, Package, DollarSign, Tag, Eye, MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const AdminDashboard = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '', price: '', description: '', category: '', stock: '', image: ''
  });

  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/admin-login-99');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products?pageSize=100'),
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/auth/users').catch((err) => {
            if (err.response?.status === 401) throw err;
            return { data: [] };
          })
        ]);
        const allProducts = productsRes.data.products || [];
        const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || [];
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        
        // Fetch some reviews for all products
        const reviewsRes = await Promise.all(
          allProducts.slice(0, 5).map(p => api.get(`/reviews/${p._id}`).catch(() => ({ data: [] })))
        );
        const allReviews = reviewsRes.flatMap(r => r.data);

        const revenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setProducts(allProducts);
        setUsers(allUsers);
        setOrders(allOrders);
        setReviews(allReviews);
        setStats({ users: allUsers.length, products: allProducts.length, orders: allOrders.length, revenue });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          showNotif('Session expired. Please log in again.', 'error');
          setTimeout(() => {
            logout();
            navigate('/admin-login-99');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userInfo, logout, navigate]);



  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, products: prev.products - 1 }));
      showNotif('Product deleted successfully!');
    } catch (err) {
      showNotif('Failed to delete product.', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setActionLoading(true);
    try {
      const { data } = await api.put(`/products/${editingProduct._id}`, editingProduct);
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
      setShowEditModal(false);
      showNotif('Product updated successfully!');
    } catch (err) {
      showNotif('Failed to update product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddProduct = async () => {
    setActionLoading(true);
    try {
      const { data } = await api.post('/products', newProduct);
      setProducts(prev => [data, ...prev]);
      setStats(prev => ({ ...prev, products: prev.products + 1 }));
      setShowAddModal(false);
      setNewProduct({ title: '', price: '', description: '', category: '', stock: '', image: '' });
      showNotif('Product added successfully!');
    } catch (err) {
      showNotif('Failed to add product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login-99');
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading Admin Console...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center space-x-3 transition-all ${notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Edit Product</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              {[['Title', 'title', 'text'], ['Price', 'price', 'number'], ['Stock', 'stock', 'number'], ['Category', 'category', 'text'], ['Image URL', 'image', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                  <input type={type} value={editingProduct[key] || ''} onChange={e => setEditingProduct(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSaveEdit} disabled={actionLoading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                {actionLoading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <><Save size={18} /><span>Save Changes</span></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              {[['Title', 'title', 'text'], ['Price', 'price', 'number'], ['Stock', 'stock', 'number'], ['Category', 'category', 'text'], ['Image URL', 'image', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                  <input type={type} value={newProduct[key]} onChange={e => setNewProduct(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleAddProduct} disabled={actionLoading}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2">
                {actionLoading ? <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" /> : <><Plus size={18} /><span>Add Product</span></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">Admin Console</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Platform Control v2.4</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input type="text" placeholder="Quick search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setActiveTab('products'); }}
              className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-52 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Settings size={20} /></button>
          <div className="h-8 w-px bg-slate-200"></div>
          <button onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-bold">
            <LogOut size={16} /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-[1600px] mx-auto w-full">
        {/* Page Header + Tabs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h2>
            <p className="text-slate-500 mt-1 text-sm">Manage your entire marketplace platform from one place</p>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm overflow-x-auto">
            {[
              ['overview', BarChart3, 'Overview'], 
              ['products', Package, 'Products'], 
              ['orders', ShoppingCart, 'Orders'],
              ['users', Users, 'Users'],
              ['reviews', MessageSquare, 'Reviews']
            ].map(([tab, Icon, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Icon size={15} /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Users" value={stats.users} change="+12.5%" positive icon={<Users className="text-blue-600" size={22} />} bg="bg-blue-50" />
          <StatCard title="Total Products" value={stats.products} change="+4.2%" positive icon={<ShoppingBag className="text-emerald-600" size={22} />} bg="bg-emerald-50" />
          <StatCard title="Total Orders" value={stats.orders} change="+8.3%" positive icon={<ShoppingCart className="text-purple-600" size={22} />} bg="bg-purple-50" />
          <StatCard title="Revenue" value={`$${stats.revenue.toFixed(0)}`} change="+14%" positive icon={<DollarSign className="text-orange-600" size={22} />} bg="bg-orange-50" />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-900">Recent Activity Log</h3>
                  </div>
                  <button className="text-blue-600 text-sm font-bold hover:underline flex items-center">
                    View All <ChevronRight size={15} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { type: 'order', title: 'New Order Placed', desc: 'Order #4421 - $149.00', time: '5 mins ago', status: 'pending' },
                    { type: 'product', title: 'Product Listed', desc: 'Leather Shoes (Premium)', time: '1 hour ago', status: 'completed' },
                    { type: 'user', title: 'New User Registered', desc: 'customer@example.com', time: '3 hours ago', status: 'completed' },
                    { type: 'security', title: 'Admin Login', desc: 'admin@marketplace.com', time: 'Today', status: 'completed' },
                  ].map((item, i) => (
                    <ActivityItem key={i} {...item} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('products')} className="p-6 text-left bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-500"><Package size={64} className="text-blue-600" /></div>
                  <ShoppingBag className="text-blue-600 mb-3" size={28} />
                  <h3 className="font-bold text-slate-900">Manage Products</h3>
                  <p className="text-xs text-slate-500 mt-1">Edit, delete, or add new products to the marketplace.</p>
                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600 flex items-center">Go to Products <ChevronRight size={12} /></p>
                </button>
                <button className="p-6 text-left bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-500"><Users size={64} className="text-purple-600" /></div>
                  <Users className="text-purple-600 mb-3" size={28} />
                  <h3 className="font-bold text-slate-900">User Management</h3>
                  <p className="text-xs text-slate-500 mt-1">View and manage users, roles, and permissions.</p>
                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-purple-600 flex items-center">View Users <ChevronRight size={12} /></p>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <TrendingUp className="text-blue-400 mb-5" size={28} />
                <h4 className="text-lg font-bold mb-1">Revenue Velocity</h4>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">Platform earnings tracking 14% above quarterly baseline.</p>
                <div className="text-3xl font-black mb-1">$54,204</div>
                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest">+$4.2k this week</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-5">Platform Health</h4>
                <div className="space-y-5">
                  <HealthBar label="Database" value={98} />
                  <HealthBar label="API Gateway" value={100} />
                  <HealthBar label="Socket Server" value={92} />
                  <HealthBar label="CDN" value={87} />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-orange-600 mb-3">
                  <AlertCircle size={18} />
                  <span className="font-bold text-sm">Security Advisory</span>
                </div>
                <p className="text-orange-800 text-xs leading-relaxed">3 suspicious login attempts detected in the last hour from unknown IPs.</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">All Products</h3>
                <p className="text-sm text-slate-500">{filteredProducts.length} products found</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm">
                  <Plus size={18} /><span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <Package size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold">No products found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(product => (
                        <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img src={product.image || 'https://via.placeholder.com/40'} className="h-10 w-10 rounded-xl object-cover border border-slate-200" alt="" />
                              <p className="text-sm font-bold text-slate-900 max-w-[180px] truncate">{product.title}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700">
                              <Tag size={10} className="inline mr-1" />{product.category || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">${Number(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${product.stock > 5 ? 'bg-emerald-50 text-emerald-700' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center space-x-1 text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <button onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(product._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Order Management</h3>
                <p className="text-sm text-slate-500">{orders.length} total orders processed</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
               {orders.length === 0 ? (
                 <div className="p-16 text-center text-slate-400">
                   <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                   <p className="font-bold">No orders found.</p>
                 </div>
               ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-black text-indigo-600">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-black text-slate-900">${order.totalPrice?.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                              order.isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
               )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">User Management</h3>
                <p className="text-sm text-slate-500">{users.length} registered users found on the platform</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['User Info', 'Email Address', 'Platform Role', 'Account Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 italic">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                            user.role === 'trader' ? 'bg-orange-100 text-orange-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Active</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => navigate(`/chat/${user._id}`)}
                            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                          >
                            <MessageSquare size={14} />
                            <span>Start Chat</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Feedback & Reviews</h3>
                <p className="text-sm text-slate-500">Monitor customer satisfaction and feedback</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length === 0 ? (
                <div className="col-span-full p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold">No reviews found.</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.name}</p>
                          <div className="flex items-center space-x-0.5 text-amber-500">
                            {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= review.rating ? 'currentColor' : 'none'} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Moderation</span>
                       <div className="flex items-center space-x-2">
                         <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase">Approve</button>
                         <button className="text-[10px] font-black text-red-500 hover:underline uppercase">Hide</button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 px-8 flex justify-between items-center bg-white/50">
        <p className="text-xs text-slate-500 font-medium">© 2026 Marketplace Platform. Admin Console v2.4.0</p>
        <div className="flex items-center space-x-1.5">
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">All Systems Operational</span>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ title, value, change, positive, icon, bg }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 ${bg} rounded-xl`}>{icon}</div>
      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{change}</span>
    </div>
    <p className="text-2xl font-black text-slate-900">{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{title}</p>
  </div>
);

const HealthBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
      <span>{label}</span><span className={value > 90 ? 'text-emerald-500' : 'text-yellow-500'}>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${value > 90 ? 'bg-emerald-500' : 'bg-yellow-400'}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const ActivityItem = ({ type, title, desc, time, status }) => {
  const icons = { order: <ShoppingCart size={15} className="text-purple-500" />, product: <Package size={15} className="text-emerald-500" />, user: <Users size={15} className="text-blue-500" />, security: <Lock size={15} className="text-orange-500" /> };
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 p-2 bg-slate-50 rounded-xl border border-slate-100">{icons[type] || icons.product}</div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <span className="text-[10px] text-slate-400 flex items-center"><Clock size={10} className="mr-1" />{time}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className={`h-2 w-2 rounded-full mt-2 ${status === 'completed' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
    </div>
  );
};

export default AdminDashboard;
