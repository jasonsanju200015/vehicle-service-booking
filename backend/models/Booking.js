const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  customerName: String,
  phone: String,
  vehicleNumber: String,
  serviceType: String,
  date: String,
  time: String,
  status: { type: String, enum: ['Pending','Approved','Completed','Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', BookingSchema);

