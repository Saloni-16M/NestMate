const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  areaSqFt: {
    type: Number,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  interestedUsers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['interested', 'viewed', 'applied', 'approved', 'rejected'],
        default: 'interested'
      }
    }
  ]
});

module.exports = mongoose.model('property', PropertySchema);
