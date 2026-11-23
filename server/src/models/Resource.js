const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Resource name is required'], trim: true },
    type: { type: String, enum: ['desk', 'room'], required: [true, 'Type is required'] },
    floor: { type: Number, required: [true, 'Floor is required'], min: 0 },
    capacity: { type: Number, required: [true, 'Capacity is required'], min: [1, 'Capacity must be at least 1'] },
    amenities: [{ type: String, trim: true }],
    location: { type: String, trim: true, default: '' },
    price: { type: Number, min: [0, 'Price cannot be negative'], default: 0 },
    image: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);