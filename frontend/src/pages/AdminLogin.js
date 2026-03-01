import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminLogin(){
  const [form, setForm] = useState({ username:'', password:'' });
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      saveToken(res.data.token);
      navigate('/admin/dashboard');
      toast.success('Logged in');
    } catch (err) { alert('Login failed'); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
        <p className="text-sm text-slate-500 mb-6">Sign in to manage bookings and services.</p>
        <form onSubmit={submit} className="space-y-4">
          <input name="username" placeholder="Username" onChange={e=>setForm({...form,username:e.target.value})} required className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-accent" />
          <input name="password" type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})} required className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-accent" />
          <button type="submit" className="w-full bg-gradient-to-r from-slate-800 to-slate-600 text-white px-4 py-3 rounded-md">Sign in</button>
        </form>
      </div>
    </div>
  );
}
