import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ServiceCategories(){
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name:'', description:'' });
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token || user?.role !== 'admin'){ navigate('/login'); return; }
  }, [token, user]);

  const load = async ()=>{ const res = await api.get('/services'); setServices(res.data); };
  useEffect(()=>{ load(); }, []);
  
  const submit = async (e)=>{
    e.preventDefault();
    if(!form.name) { toast.error('Name is required'); return; }
    try{ 
      await api.post('/services', form); 
      setForm({name:'',description:''}); 
      load(); 
      toast.success('Service added!'); 
    } catch(e){ toast.error('Failed to add service'); }
  };

  const remove = async (id) => {
    if(!window.confirm('Delete this service?')) return;
    try{ 
      await api.delete(`/services/${id}`); 
      toast.success('Service deleted'); 
      load(); 
    } catch(e){ toast.error('Delete failed'); }
  };

  const edit = async (id) => {
    const name = prompt('New name'); 
    if(!name) return; 
    const description = prompt('New description') || '';
    try{ 
      await api.put(`/services/${id}`, { name, description }); 
      toast.success('Service updated'); 
      load(); 
    } catch(e){ toast.error('Update failed'); }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Service Categories</h2>
          <p className="text-slate-400">Manage your service offerings</p>
        </div>
      </div>

      <div className="premium-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Service</h3>
        <form onSubmit={submit} className="flex flex-col md:flex-row gap-4">
          <input 
            placeholder="Service name"
            value={form.name} 
            onChange={e=>setForm({...form,name:e.target.value})} 
            required 
            className="premium-input flex-1" 
          />
          <input 
            placeholder="Description (optional)"
            value={form.description} 
            onChange={e=>setForm({...form,description:e.target.value})} 
            className="premium-input flex-1" 
          />
          <button type="submit" className="premium-btn whitespace-nowrap">
            Add Service
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {services.map(s=> (
          <div key={s._id} className="service-card flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg text-white">{s.name}</div>
              <div className="text-slate-400">{s.description}</div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={()=>edit(s._id)} 
                className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button 
                onClick={()=>remove(s._id)} 
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
