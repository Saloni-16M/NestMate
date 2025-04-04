const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  userId1: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  userId2: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  compatibilityScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  dateMatched: {
    type: Date,
    default: Date.now
  }
});

// Ensure that a match between the same two users can't be created twice
MatchSchema.index(
  { 
    userId1: 1, 
    userId2: 1 
  }, 
  { 
    unique: true 
  }
);

module.exports = mongoose.model('match', MatchSchema);
