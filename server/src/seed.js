require('dotenv').config();
const connectDB = require('./config/db');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');

const A = 'Gulberg Branch';
const B = 'DHA Branch';

const data = [
  { name: 'Desk A1', type: 'desk', floor: 1, capacity: 1, location: A, price: 300, amenities: ['monitor', 'power outlet'] },
  { name: 'Desk A2', type: 'desk', floor: 1, capacity: 1, location: A, price: 300, amenities: ['monitor'] },
  { name: 'Desk B1', type: 'desk', floor: 2, capacity: 1, location: B, price: 400, amenities: ['standing desk', 'monitor'] },
  { name: 'Desk B2', type: 'desk', floor: 2, capacity: 1, location: B, price: 350, amenities: ['window view'] },
  { name: 'Meeting Room Alpha', type: 'room', floor: 1, capacity: 6, location: A, price: 1200, amenities: ['projector', 'whiteboard'] },
  { name: 'Meeting Room Beta', type: 'room', floor: 2, capacity: 10, location: B, price: 2000, amenities: ['projector', 'video call', 'whiteboard'] },
  { name: 'Boardroom', type: 'room', floor: 3, capacity: 16, location: B, price: 3500, amenities: ['projector', 'video call', 'coffee'] },
  { name: 'Huddle Room', type: 'room', floor: 3, capacity: 4, location: A, price: 800, amenities: ['TV screen'] },
];

(async () => {
  await connectDB();
  await Booking.deleteMany({});
  await Resource.deleteMany({});
  await Resource.insertMany(data);
  console.log('Seeded', data.length, 'resources');
  process.exit(0);
})();