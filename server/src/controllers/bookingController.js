const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

const errMsg = (err) =>
  err.errors ? Object.values(err.errors)[0].message : err.message;

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { resource, startTime, endTime } = req.body;

    if (!resource || !startTime || !endTime) {
      return res.status(400).json({ message: 'Resource, start and end time are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date or time' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot book a time in the past' });
    }

    const space = await Resource.findById(resource);
    if (!space || !space.isActive) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Overlap check: double booking rokna
    const conflict = await Booking.findOne({
      resource,
      status: 'confirmed',
      startTime: { $lt: end },
      endTime: { $gt: start },
    });
    if (conflict) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      resource,
      startTime: start,
      endTime: end,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: errMsg(err) });
  }
};

// GET /api/bookings/me
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('resource', 'name type floor')
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/resource/:id?date=2026-11-20 (us din ki booked slots)
exports.getResourceBookings = async (req, res) => {
  try {
    const filter = { resource: req.params.id, status: 'confirmed' };

    if (req.query.date) {
      const dayStart = new Date(`${req.query.date}T00:00:00`);
      const dayEnd = new Date(`${req.query.date}T23:59:59`);
      filter.startTime = { $lt: dayEnd };
      filter.endTime = { $gt: dayStart };
    }

    const bookings = await Booking.find(filter)
      .select('startTime endTime')
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ message: 'Invalid request' });
  }
};

// DELETE /api/bookings/:id (cancel)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid booking id' });
  }
};

// GET /api/bookings (admin: sab bookings)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('resource', 'name type floor')
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};