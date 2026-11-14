const express = require('express');
const {
  createBooking,
  getMyBookings,
  getResourceBookings,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/resource/:id', protect, getResourceBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;