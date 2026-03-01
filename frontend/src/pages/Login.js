import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login(){
  const [form, setForm] = useState({ username:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      saveToken(res.data.token, res.data.user);
      
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
        toast.success('Welcome back, Admin!');
      } else {
        navigate('/my-bookings');
        toast.success('Login successful!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="premium-card p-8 glow-effect">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your account</p>
          </div>
          
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input 
                name="username" 
                placeholder="Enter your username"
                value={form.username}
                onChange={e=>setForm({...form,username:e.target.value})} 
                required 
                className="premium-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••"
                value={form.password}
                onChange={e=>setForm({...form,password:e.target.value})} 
                required 
                className="premium-input" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="premium-btn w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Create one
              </a>
            </p>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-500 text-center">
              Demo Admin: <span className="text-slate-400">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
