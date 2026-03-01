import React from 'react';
export default function BookingList({ bookings }){
  return (
    <ul>
      {bookings.map(b => <li key={b._id}>{b.customerName} - {b.serviceType} - {b.status}</li>)}
    </ul>
  );
}
