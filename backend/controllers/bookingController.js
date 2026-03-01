const Booking = require('../models/Booking');

const jwt = require('jsonwebtoken');

exports.createBooking = async (req, res) => {
  try {
    const data = { ...req.body };
    // attach user if Authorization header present
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) data.user = decoded.id;
      } catch (e) {
        // ignore invalid token, allow anonymous booking
      }
    }
    const booking = new Booking(data);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const { page = 1, limit = 100 } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    // allow only owner or admin to view
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(403).json({ message: 'Forbidden' });
    try {
      const token = authHeader.split(' ')[1];
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
      const User = require('../models/User');
      const requester = await User.findById(decoded.id);
      if (!requester) return res.status(403).json({ message: 'Forbidden' });
      if (requester.role === 'admin' || (booking.user && String(booking.user) === String(requester._id))) {
        return res.json(booking);
      }
      return res.status(403).json({ message: 'Forbidden' });
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    // only owner (customer) can update their booking and only when status is Pending
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const requesterId = req.user.id;
    const User = require('../models/User');
    const requester = await User.findById(requesterId);
    if (!requester) return res.status(403).json({ message: 'Forbidden' });

    // Admins may edit any booking fields at any status. Customers may only edit their own pending bookings.
    if (requester.role === 'admin') {
      const allowed = ['customerName','phone','vehicleNumber','serviceType','date','time','status'];
      allowed.forEach(field => { if (req.body[field] !== undefined) booking[field] = req.body[field]; });
      await booking.save();
      return res.json(booking);
    }

    // customer case
    if (!booking.user || String(booking.user) !== String(requesterId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (booking.status !== 'Pending') return res.status(400).json({ message: 'Only pending bookings can be edited' });

    const allowed = ['customerName','phone','vehicleNumber','serviceType','date','time'];
    allowed.forEach(field => { if (req.body[field] !== undefined) booking[field] = req.body[field]; });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    const total = await Booking.countDocuments(match);
    const pending = await Booking.countDocuments({ ...match, status: 'Pending' });
    const approved = await Booking.countDocuments({ ...match, status: 'Approved' });
    const completed = await Booking.countDocuments({ ...match, status: 'Completed' });
    const rejected = await Booking.countDocuments({ ...match, status: 'Rejected' });
    res.json({ total, pending, approved, completed, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const stats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
