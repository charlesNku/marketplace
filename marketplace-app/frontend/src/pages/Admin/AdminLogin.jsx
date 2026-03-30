import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, userInfo, error, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // If logged in as non-admin, they shouldn't be here
        // But for now just let the store handle it or logout
      }
    }
  }, [userInfo, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40 mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Access Secure Vault</h1>
          <p className="text-slate-400 mt-2">Administrative Control Environment</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            {userInfo && userInfo.role !== 'admin' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                Unauthorized access. Only admins can enter here.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@marketplace.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Secure Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          System version 2.4.0 • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

