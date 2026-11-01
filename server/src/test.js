require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');

(async () => {
  await connectDB();
await User.deleteMany({});
await Resource.deleteMany({});
await Booking.deleteMany({});
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
  });

  const resource = await Resource.create({
    name: 'Meeting Room A',
    type: 'room',
    floor: 2,
    capacity: 8,
    amenities: ['projector', 'whiteboard'],
  });

  const booking = await Booking.create({
    user: user._id,
    resource: resource._id,
    startTime: new Date('2026-11-05T10:00:00'),
    endTime: new Date('2026-11-05T11:00:00'),
  });
  console.log('Booking saved:', booking._id);

  // Validation test: galat time
  try {
    await Booking.create({
      user: user._id,
      resource: resource._id,
      startTime: new Date('2026-11-05T12:00:00'),
      endTime: new Date('2026-11-05T11:00:00'),
    });
  } catch (err) {
    console.log('Validation worked:', err.errors.endTime.message);
  }

  process.exit(0);
})();