import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard(){
  const [bookings, setBookings] = useState([]);
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{ if(!token){ navigate('/login'); } else { load(); loadStats(); loadDailyStats(); } }, [token]);
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  
  const load = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await api.get('/bookings', { params });
      setBookings(res.data);
    } catch(err){ console.error(err); }
  };

  const updateStatus = async (id, status) => { 
    try{ 
      await api.put(`/bookings/${id}/status`, { status }); 
      toast.success(`Booking ${status.toLowerCase()}`); 
      load(); 
      loadStats(); 
      loadDailyStats();
    } catch(e){ toast.error('Update failed'); } 
  };
  
  const remove = async (id) => { 
    if(window.confirm('Delete this booking?')){ 
      try{ 
        await api.delete(`/bookings/${id}`); 
        toast.success('Booking deleted'); 
        load(); 
        loadStats(); 
        loadDailyStats();
      } catch(e){ toast.error('Delete failed'); } 
    } 
  };

  const [stats, setStats] = useState({ total:0, pending:0, approved:0, completed:0, rejected:0 });
  const loadStats = async () => {
    try {
      const res = await api.get('/bookings/stats', { params: { startDate: filters.startDate, endDate: filters.endDate } });
      setStats(res.data);
    } catch (e) { console.error(e); }
  };

  const [dailyStats, setDailyStats] = useState([]);
  const loadDailyStats = async () => {
    try {
      const res = await api.get('/bookings/daily', { params: { days: 7 } });
      const data = res.data.map(item => ({
        date: item._id,
        total: item.count,
        pending: item.pending,
        approved: item.approved,
        completed: item.completed
      }));
      setDailyStats(data);
    } catch (e) { console.error(e); }
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.toLowerCase()}`;
    return <span className={statusClass}>{status}</span>;
  };

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-slate-400">Welcome back, {user?.name || user?.username}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/services" className="premium-btn-secondary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Manage Services
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})} className="premium-select w-auto min-w-[150px]">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input type="date" value={filters.startDate} onChange={e=>setFilters({...filters,startDate:e.target.value})} className="premium-input w-auto" />
        <input type="date" value={filters.endDate} onChange={e=>setFilters({...filters,endDate:e.target.value})} className="premium-input w-auto" />
        <button onClick={()=>{ load(); loadStats(); loadDailyStats(); }} className="premium-btn">Apply Filters</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="premium-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Total Bookings</div>
              <div className="text-2xl font-bold text-white">{stats.total || bookings.length}</div>
            </div>
          </div>
        </div>
        <div className="premium-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Pending</div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
            </div>
          </div>
        </div>
        <div className="premium-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Approved</div>
              <div className="text-2xl font-bold text-white">{stats.approved}</div>
            </div>
          </div>
        </div>
        <div className="premium-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Completed</div>
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
            </div>
          </div>
        </div>
      </div>

      {dailyStats.length > 0 && (
        <div className="premium-card p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Bookings (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="total" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="premium-card overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle / Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b=> (
              <tr key={b._id}>
                <td className="font-medium">{b.customerName}</td>
                <td>
                  <div className="text-white font-medium">{b.vehicleNumber}</div>
                  <div className="text-slate-500 text-sm">{b.phone}</div>
                </td>
                <td>{b.serviceType}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{getStatusBadge(b.status)}</td>
                <td>
                  <div className="flex gap-2 flex-wrap">
                    <Link 
                      to={`/booking/${b._id}`}
                      className="px-3 py-1.5 bg-slate-600/50 text-slate-400 rounded-lg hover:bg-slate-600/70 text-xs font-medium transition-colors inline-block"
                    >
                      View
                    </Link>
                    <button onClick={()=>updateStatus(b._id,'Approved')} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-xs font-medium transition-colors">Approve</button>
                    <button onClick={()=>updateStatus(b._id,'Completed')} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-xs font-medium transition-colors">Complete</button>
                    <button onClick={()=>updateStatus(b._id,'Rejected')} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-xs font-medium transition-colors">Reject</button>
                    <button onClick={()=>remove(b._id)} className="px-3 py-1.5 bg-slate-600/50 text-slate-400 rounded-lg hover:bg-slate-600/70 text-xs font-medium transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
