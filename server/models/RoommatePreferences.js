const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoommatePreferencesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  cleanlinessLevel: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  noiseLevel: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  hashedPreferences: {
    type: String
  },
  sleepSchedule: {
    type: String,
    enum: ['early_bird', 'night_owl', 'flexible'],
    required: true
  },
  dietPreferences: {
    type: String,
    enum: ['vegan', 'vegetarian', 'no_restrictions'],
    required: true
  },
  smokingPreferences: {
    type: String,
    enum: ['yes', 'no', 'outdoors_only'],
    required: true
  },
  petsPreferences: {
    type: String,
    enum: ['yes', 'no', 'depends'],
    required: true
  },
  guestPreferences: {
    type: String,
    enum: ['often', 'sometimes', 'rarely'],
    required: true
  },
  ageRangeMin: {
    type: Number,
    required: true,
    min: 18
  },
  ageRangeMax: {
    type: Number,
    required: true,
    min: 18
  },
  interests: {
    type: [String],
    default: []
  },
  additionalNotes: {
    type: String
  }
});

module.exports = mongoose.model('roommate_preferences', RoommatePreferencesSchema);
