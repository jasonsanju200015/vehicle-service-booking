import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function BookingForm() {
  const [form, setForm] = useState({ customerName:'', phone:'', vehicleNumber:'', serviceType:'', date:'', time:'' });
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(()=>{ 
    api.get('/services').then(r=>setServices(r.data)).catch(()=>{}); 
  },[]);

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value});
  
  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/bookings', form);
      setMessage('✓ Booking submitted successfully — we will contact you soon!');
      toast.success('Booking submitted successfully!');
      setForm({ customerName:'', phone:'', vehicleNumber:'', serviceType:'', date:'', time:'' });
    } catch (err) { 
      setMessage('✗ Submission failed — please try again.');
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="premium-card p-8 glow-effect">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Book Your Service</h3>
          <p className="text-slate-400">Fill in the details below</p>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.includes('✓') ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
          <p className={message.includes('✓') ? 'text-emerald-400' : 'text-red-400'}>{message}</p>
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input 
              name="customerName" 
              placeholder="John Doe"
              value={form.customerName} 
              onChange={handle} 
              required 
              className="premium-input" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <input 
              name="phone" 
              placeholder="+1 234 567 8900"
              value={form.phone} 
              onChange={handle} 
              required 
              className="premium-input" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Number</label>
          <input 
            name="vehicleNumber" 
            placeholder="ABC-1234"
            value={form.vehicleNumber} 
            onChange={handle} 
            required 
            className="premium-input" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Service</label>
          <select 
            name="serviceType" 
            value={form.serviceType} 
            onChange={handle} 
            required 
            className="premium-select"
          >
            <option value="">Choose a service</option>
            {services.map(s=> <option key={s._id} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Date</label>
            <input 
              type="date" 
              name="date" 
              value={form.date} 
              onChange={handle} 
              required 
              className="premium-input" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Time</label>
            <input 
              type="time" 
              name="time" 
              value={form.time} 
              onChange={handle} 
              required 
              className="premium-input" 
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="premium-btn w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Submit Booking
              </>
            )}
          </button>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-4">
          By booking, you agree to our terms of service
        </p>
      </form>
    </div>
  );
}
