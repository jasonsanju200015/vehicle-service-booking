import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyBookings(){
  const { token, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get('/bookings/my');
        setBookings(res.data);
      } catch (e){ console.error(e); }
    };
    if(token) load();
  }, [token]);

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.toLowerCase()}`;
    return <span className={statusClass}>{status}</span>;
  };

  if(!token) return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
      <div className="premium-card p-12 text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Login Required</h2>
        <p className="text-slate-400 mb-6">Please login or register to view your bookings.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="premium-btn">Login</Link>
          <Link to="/register" className="premium-btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">My Bookings</h2>
          <p className="text-slate-400">Manage your service appointments</p>
        </div>
        <Link to="/" className="premium-btn flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </Link>
      </div>
      
      {bookings.length === 0 ? (
        <div className="premium-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 mb-4">No bookings yet</p>
          <Link to="/" className="premium-btn">Book Your First Service</Link>
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b=> (
                <tr key={b._id}>
                  <td className="font-medium">{b.serviceType}</td>
                  <td>
                    <div className="text-white font-medium">{b.vehicleNumber}</div>
                    <div className="text-slate-500 text-sm">{b.customerName} • {b.phone}</div>
                  </td>
                  <td>
                    <div className="text-white">{b.date}</div>
                    <div className="text-slate-500 text-sm">{b.time}</div>
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    <Link 
                      to={`/booking/${b._id}`} 
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
