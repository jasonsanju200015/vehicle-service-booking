import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function BookingDetails() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadBooking();
  }, [id, token]);

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.toLowerCase()}`;
    return <span className={statusClass}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="premium-card p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/my-bookings'} className="premium-btn">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <Link 
        to={user?.role === 'admin' ? '/admin/dashboard' : '/my-bookings'} 
        className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {user?.role === 'admin' ? 'Dashboard' : 'My Bookings'}
      </Link>

      <div className="premium-card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Booking Confirmation</h2>
              <p className="text-blue-200">#{booking._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(booking.status)}
              <p className="text-blue-200 text-sm mt-1">
                {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Customer Name</p>
              <p className="text-white text-lg font-medium">{booking.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Phone Number</p>
              <p className="text-white text-lg font-medium">{booking.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Vehicle Number</p>
              <p className="text-white text-lg font-medium">{booking.vehicleNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Service Type</p>
              <p className="text-white text-lg font-medium">{booking.serviceType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Preferred Date</p>
              <p className="text-white text-lg font-medium">{booking.date}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm uppercase tracking-wide">Preferred Time</p>
              <p className="text-white text-lg font-medium">{booking.time}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 p-6 bg-slate-800/50">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="text-slate-400 text-sm">
              Booking ID: <span className="text-slate-300 font-mono">{booking._id}</span>
            </div>
            <div className="flex gap-3">
              {user?.role === 'admin' && booking.status === 'Pending' && (
                <>
                  <button 
                    onClick={async () => {
                      await api.put(`/bookings/${booking._id}/status`, { status: 'Approved' });
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 font-medium"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={async () => {
                      await api.put(`/bookings/${booking._id}/status`, { status: 'Rejected' });
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 font-medium"
                  >
                    Reject
                  </button>
                </>
              )}
              {user?.role === 'admin' && booking.status === 'Approved' && (
                <button 
                  onClick={async () => {
                    await api.put(`/bookings/${booking._id}/status`, { status: 'Completed' });
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 font-medium"
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm">
          Thank you for choosing our service!
        </p>
      </div>
    </div>
  );
}
