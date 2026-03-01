const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingCtrl = require('../controllers/bookingController');

router.post('/', bookingCtrl.createBooking);
router.get('/', auth, bookingCtrl.getBookings);
router.get('/stats', auth, bookingCtrl.getStats);
router.get('/daily', auth, bookingCtrl.getDailyStats);
router.get('/my', auth, bookingCtrl.getMyBookings);
router.get('/:id', auth, bookingCtrl.getBookingById);
router.put('/:id', auth, bookingCtrl.updateBooking);
router.put('/:id/status', auth, bookingCtrl.updateStatus);
router.delete('/:id', auth, bookingCtrl.deleteBooking);

module.exports = router;
