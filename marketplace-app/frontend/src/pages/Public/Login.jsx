import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, userInfo, error, loading } = useAuthStore();
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
    login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[480px] w-full relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center justify-center bg-indigo-600/10 p-4 rounded-[1.5rem] mb-6 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
              <ShieldCheck className="text-indigo-400" size={32} />
           </div>
           <h1 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-3">Professional Secure Access</h1>
           <h2 className="text-4xl font-black text-white tracking-tight">Welcome Back</h2>
        </div>

        <div className="glass-card rounded-[3rem] p-10 lg:p-12 border-white/10 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in duration-1000">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 flex items-center text-xs font-black uppercase tracking-widest text-center justify-center">
               <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@enterprise.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Access Key</label>
                <Link to="#" className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm group"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Authenticate Session</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-xs font-medium text-slate-400">
              New to the platform circle? <br className="md:hidden" />
              <Link to="/register" className="inline-flex items-center space-x-2 font-black text-indigo-400 hover:text-indigo-300 transition-colors ml-2 uppercase tracking-widest text-[10px]">
                <span>Initiate Enrollment</span>
                <UserPlus size={14} />
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-12 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Secured by RSA-4096 & Quantum Shield Protocols
        </p>
      </div>
    </div>
  );
};

export default Login;
