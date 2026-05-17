import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center justify-center bg-indigo-600/10 p-5 rounded-[2rem] mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
          <ShieldAlert className="text-indigo-400" size={48} />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Page Not Found</h2>
        
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>
        
        <Link 
          to="/" 
          className="btn-primary py-4 px-8 inline-flex items-center justify-center space-x-3 w-full sm:w-auto"
        >
          <ArrowLeft size={18} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
