import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck, ArrowRight, LogIn, Briefcase, ShoppingBag } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  
  const { register, userInfo, error, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') navigate('/admin/dashboard');
      else if (userInfo.role === 'trader') navigate('/trader/dashboard');
      else navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    register(name, email, password, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden px-6 py-20">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[10%] w-[20%] h-[20%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[540px] w-full relative z-10">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center bg-emerald-600/10 p-4 rounded-[1.5rem] mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
              <UserPlus className="text-emerald-400" size={32} />
           </div>
           <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-3">New Account</p>
           <h1 className="text-4xl font-black text-white tracking-tight">Create Account</h1>
           <p className="text-slate-400 text-sm mt-2 font-medium">Join thousands of shoppers on MarketPro</p>
        </div>

        <div className="glass-card rounded-[3.5rem] p-10 lg:p-14 border-white/10 shadow-2xl backdrop-blur-3xl">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 flex items-center text-sm font-bold text-center justify-center">
               <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    id="register-name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    id="register-email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  id="register-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">I want to</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  id="register-role-customer"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all duration-300 ${
                    role === 'customer' 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <ShoppingBag size={24} className={role === 'customer' ? 'text-indigo-400' : 'text-slate-500'} />
                  <span className="text-xs font-black uppercase tracking-widest mt-3">Shop</span>
                  <span className={`text-[9px] font-medium mt-1 ${role === 'customer' ? 'text-indigo-300' : 'text-slate-600'}`}>Browse & Buy</span>
                </button>
                <button 
                  type="button"
                  id="register-role-trader"
                  onClick={() => setRole('trader')}
                  className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all duration-300 ${
                    role === 'trader' 
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Briefcase size={24} className={role === 'trader' ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="text-xs font-black uppercase tracking-widest mt-3">Sell</span>
                  <span className={`text-[9px] font-medium mt-1 ${role === 'trader' ? 'text-emerald-300' : 'text-slate-600'}`}>List & Earn</span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              id="register-submit"
              disabled={loading}
              className="w-full btn-emerald py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm group mt-4 shadow-xl shadow-emerald-500/10"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in <LogIn size={14} className="inline" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
