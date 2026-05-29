import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck, ArrowRight, LogIn, Briefcase, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  
  const { register, userInfo, error, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = new URLSearchParams(location.search).get('redirect');

  useEffect(() => {
    if (userInfo) {
      if (redirect) {
        navigate(redirect);
      } else {
        if (userInfo.role === 'admin') navigate('/admin/dashboard');
        else if (userInfo.role === 'trader') navigate('/trader/dashboard');
        else navigate('/');
      }
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    register(name, email, password, role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 flex overflow-hidden relative z-10 border border-slate-100 min-h-[700px]">
        
        {/* Left Marketing Panel (Hidden on Mobile) */}
        <div className="hidden lg:flex w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-500/20 to-transparent"></div>
             <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800" alt="Shopping" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-orange-400 transition-colors">
              <ShoppingBag className="text-orange-500" size={28} />
              <span className="text-xl font-black tracking-tight">Rwanda Digital Market</span>
            </Link>
          </div>

          <div className="relative z-10 mt-auto mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
              <Sparkles className="text-amber-400" size={14} />
              <span className="text-xs font-bold text-white tracking-widest uppercase">Premium Experience</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
              Join the future <br/>of <span className="text-orange-500">shopping.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mb-10">
              Discover verified quality products, exclusive vendors, and experience a seamless, secure local checkout.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300">
                <CheckCircle2 size={18} className="text-orange-500" />
                <span className="text-sm font-semibold">Free shipping on premium orders</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <CheckCircle2 size={18} className="text-orange-500" />
                <span className="text-sm font-semibold">100% secure encrypted payments</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <CheckCircle2 size={18} className="text-orange-500" />
                <span className="text-sm font-semibold">Verified premium vendors only</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <CheckCircle2 size={18} className="text-orange-500" />
                <span className="text-sm font-semibold">Direct real-time chat with sellers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-7/12 p-8 sm:p-14 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">Create Account</h2>
              <p className="text-sm font-semibold text-slate-500">Join thousands of shoppers and sellers today.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-8 flex items-center text-sm font-bold shadow-sm">
                <ShieldCheck className="mr-3 flex-shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={submitHandler} className="space-y-6">
              
              {/* Floating Label Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    id="register-name"
                    className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all placeholder-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                  />
                  <label htmlFor="register-name" className="absolute left-5 -top-2.5 bg-white px-1 text-[10px] font-black uppercase tracking-widest text-orange-500 transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-orange-500 peer-focus:bg-white cursor-text">
                    Full Name
                  </label>
                  <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 peer-focus:text-orange-500 transition-colors pointer-events-none" size={18} />
                </div>

                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    id="register-email"
                    className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all placeholder-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                  />
                  <label htmlFor="register-email" className="absolute left-5 -top-2.5 bg-white px-1 text-[10px] font-black uppercase tracking-widest text-orange-500 transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-orange-500 peer-focus:bg-white cursor-text">
                    Email Address
                  </label>
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 peer-focus:text-orange-500 transition-colors pointer-events-none" size={18} />
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  required
                  id="register-password"
                  className="peer w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all placeholder-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <label htmlFor="register-password" className="absolute left-5 -top-2.5 bg-white px-1 text-[10px] font-black uppercase tracking-widest text-orange-500 transition-all peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-orange-500 peer-focus:bg-white cursor-text">
                  Secure Password
                </label>
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 peer-focus:text-orange-500 transition-colors pointer-events-none" size={18} />
              </div>

              <div className="pt-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Choose Your Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      role === 'customer' 
                        ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {role === 'customer' && <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>}
                    <div className={`p-3 rounded-full mb-3 relative z-10 transition-colors ${role === 'customer' ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                      <ShoppingBag size={22} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest relative z-10 ${role === 'customer' ? 'text-orange-600' : 'text-slate-600'}`}>Shopper</span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 relative z-10">Browse & Buy</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setRole('trader')}
                    className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      role === 'trader' 
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {role === 'trader' && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>}
                    <div className={`p-3 rounded-full mb-3 relative z-10 transition-colors ${role === 'trader' ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                      <Briefcase size={22} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest relative z-10 ${role === 'trader' ? 'text-indigo-600' : 'text-slate-600'}`}>Vendor</span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 relative z-10">List & Earn</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm group mt-4 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="font-black uppercase tracking-widest">Create Account</span>
                    <ArrowRight size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="font-black text-orange-500 hover:text-orange-600 transition-colors ml-1 inline-flex items-center">
                  Sign in <LogIn size={14} className="ml-1" />
                </Link>
              </p>
              {redirect && (
                <p className="mt-4">
                  <Link to={redirect} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors border-b border-slate-300 pb-0.5">
                    Cancel & Return to Product
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
