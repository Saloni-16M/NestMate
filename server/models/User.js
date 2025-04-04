const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['renter', 'landlord', 'both'],
    default: 'renter'
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
