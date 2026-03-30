import React from 'react';
import { User, Mail, Shield, ShoppingBag, MessageSquare, Settings, CreditCard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { userInfo, logout } = useAuthStore();

  if (!userInfo) return null;

  const actions = [
    { label: 'Order History', icon: ShoppingBag, link: '/history', color: 'indigo' },
    { label: 'My Messages', icon: MessageSquare, link: '/messages', color: 'indigo' },
    { label: 'Payment Methods', icon: CreditCard, link: '#', color: 'indigo' },
    { label: 'Account Settings', icon: Settings, link: '#', color: 'indigo' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-12">
           <h1 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Personal Space</h1>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Profile</h2>
        </div>

        <div className="glass-card rounded-[3rem] border-slate-100 overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-indigo-500/10 mb-12">
          {/* Cover Area */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-indigo-800 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="px-10 pb-12 relative">
            <div className="-mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="relative group">
                <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-[2.5rem] border-8 border-white bg-slate-900 flex items-center justify-center text-5xl font-black text-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  {userInfo.name?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white h-7 w-7 rounded-full shadow-lg"></div>
              </div>
              
              <div className="flex-1 md:ml-8">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">{userInfo.name}</h2>
                 <p className="text-sm font-bold text-slate-400 mt-1 flex items-center">
                    <Mail size={14} className="mr-2" />
                    {userInfo.email}
                 </p>
              </div>

              <div className="flex bg-indigo-50 px-6 py-2 rounded-2xl">
                 <Shield size={16} className="text-indigo-600 mr-2" />
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                   Verified {userInfo.role}
                 </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
              {/* Account Overview */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Account Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-2xl shadow-inner">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Full Identity</p>
                       <p className="text-sm font-black text-slate-900">{userInfo.name}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl shadow-inner">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Email Communication</p>
                       <p className="text-sm font-black text-slate-900">{userInfo.email}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl shadow-inner">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Membership Authority</p>
                       <p className="text-sm font-black text-slate-900 capitalize">{userInfo.role} privileges</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl shadow-inner">
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Loyalty Tier</p>
                       <p className="text-sm font-black text-slate-900">Premium Elite</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar Actions */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Navigation</h3>
                <div className="space-y-3">
                  {actions.map((action, i) => (
                    <Link 
                      key={i} 
                      to={action.link} 
                      className="flex items-center group p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:border-indigo-100 mb-3 transition-all duration-300"
                    >
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                        <action.icon size={18} />
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{action.label}</span>
                    </Link>
                  ))}
                  
                  {userInfo.role === 'trader' && (
                    <Link to="/trader/dashboard" className="flex items-center group p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all">
                       <Shield size={18} className="mr-4" />
                       <span className="text-xs font-black uppercase tracking-widest">Merchant Control</span>
                    </Link>
                  )}
                  {userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard" className="flex items-center group p-4 bg-slate-900 text-white rounded-2xl shadow-lg transition-all">
                       <Shield size={18} className="mr-4 text-indigo-400" />
                       <span className="text-xs font-black uppercase tracking-widest">System Administration</span>
                    </Link>
                  )}

                  <button 
                    onClick={logout}
                    className="w-full flex items-center group p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all mt-6"
                  >
                     <LogOut size={18} className="mr-4" />
                     <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
