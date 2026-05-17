import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Public/Home';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import ProductList from './pages/Public/ProductList';
import ProductDetails from './pages/Public/ProductDetails';
import Cart from './pages/Customer/Cart';
import Checkout from './pages/Customer/Checkout';
import OrderTracking from './pages/Customer/OrderTracking';
import OrderHistory from './pages/Customer/OrderHistory';
import Chat from './pages/Chat/Chat';
import ChatList from './pages/Chat/ChatList';
import Profile from './pages/Customer/Profile';
import TraderDashboard from './pages/Trader/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/chat/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking/:id" element={<OrderTracking />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trader/dashboard" element={<TraderDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/chat/:receiverId" element={<Chat />} />
        <Route path="/chat/:receiverId/:productId" element={<Chat />} />
        <Route path="/messages" element={<ChatList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
