import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CustomerBooking from './pages/CustomerBooking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ServiceCategories from './pages/ServiceCategories';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import { AuthContext } from './context/AuthContext';

function Logout() {
  const { logout, user } = useContext(AuthContext);
  return (
    <button 
      onClick={() => { logout(); window.location.href = '/'; }} 
      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all text-sm font-medium"
    >
      Logout
    </button>
  );
}

export default function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="premium-header sticky top-0 z-50">
        <div className="app-container flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="premium-logo">VSB</div>
            <h1 className="text-xl font-semibold text-white hidden sm:block">Vehicle Service Booking</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Link to="/" className="premium-link">Book Service</Link>
            {!user && (
              <>
                <Link to="/login" className="premium-link">Login</Link>
                <Link to="/register" className="premium-link">Register</Link>
              </>
            )}
            {user && user.role !== 'admin' && (
              <>
                <Link to="/my-bookings" className="premium-link">My Bookings</Link>
                <Link to="/profile" className="premium-link">Profile</Link>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="premium-link">Dashboard</Link>
                <Link to="/admin/services" className="premium-link">Services</Link>
              </>
            )}
            {user && <Logout />}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="app-container hero-gradient min-h-[calc(100vh-180px)]">
          <Routes>
            <Route path="/" element={<CustomerBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<ServiceCategories />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-slate-900/80 border-t border-slate-700/50">
        <div className="app-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Vehicle Service Booking. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm">Premium Vehicle Care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
