import React, { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Profile(){
  const { user, token, saveToken } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', phone:'', password:'' });
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if(user){ setForm({ name: user.name || '', phone: user.phone || '', password: '' }); } }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      await api.put('/auth/me', form);
      toast.success('Profile updated successfully!');
    } catch (err){ toast.error('Update failed'); } finally {
      setLoading(false);
    }
  };

  if(!token) return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
      <div className="premium-card p-12 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Login Required</h2>
        <p className="text-slate-400">Please login to view your profile.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="premium-card p-8 glow-effect">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
            <p className="text-slate-400">Manage your account details</p>
          </div>
          
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input 
                value={user?.username || ''} 
                disabled 
                className="premium-input bg-slate-800/50 cursor-not-allowed opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input 
                placeholder="Enter your name"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <input 
                type="password" 
                placeholder="Leave blank to keep current"
                value={form.password} 
                onChange={e=>setForm({...form,password:e.target.value})} 
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
