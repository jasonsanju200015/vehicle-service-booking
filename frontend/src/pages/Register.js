import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register(){
  const [form, setForm] = useState({ username:'', password:'', name:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.post('/auth/register', form);
      saveToken(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      navigate('/my-bookings');
    } catch (err){ 
      toast.error(err.response?.data?.message || 'Registration failed'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="premium-card p-8 glow-effect">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400">Join us for premium vehicle services</p>
          </div>
          
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                placeholder="John Doe"
                value={form.name} 
                onChange={e=>setForm({...form,name:e.target.value})} 
                className="premium-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
              <input 
                placeholder="+1 234 567 8900"
                value={form.phone} 
                onChange={e=>setForm({...form,phone:e.target.value})} 
                className="premium-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input 
                placeholder="johndoe"
                value={form.username} 
                onChange={e=>setForm({...form,username:e.target.value})} 
                required 
                className="premium-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
