const { validationResult } = require('express-validator');
const RoommatePreferences = require('../models/RoommatePreferences');
const User = require('../models/User');
const Match = require('../models/Match');

// @route   POST api/roommate-preferences
// @desc    Create or update roommate preferences
// @access  Private
exports.createPreferences = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if preferences already exist
    let preferences = await RoommatePreferences.findOne({ userId: req.user.id });

    const {
      cleanlinessLevel,
      noiseLevel,
      sleepSchedule,
      dietPreferences,
      smokingPreferences,
      petsPreferences,
      guestPreferences,
      ageRangeMin,
      ageRangeMax,
      interests,
      additionalNotes
    } = req.body;

    // Create preferences object
    const preferencesFields = {
      userId: req.user.id,
      cleanlinessLevel,
      noiseLevel,
      sleepSchedule,
      dietPreferences,
      smokingPreferences,
      petsPreferences,
      guestPreferences,
      ageRangeMin,
      ageRangeMax,
      interests: Array.isArray(interests) ? interests : [],
      additionalNotes
    };

    // Generate a hashed preferences string for quick matching
    preferencesFields.hashedPreferences = generateHashedPreferences(preferencesFields);

    if (preferences) {
      // Update
      preferences = await RoommatePreferences.findOneAndUpdate(
        { userId: req.user.id },
        { $set: preferencesFields },
        { new: true }
      );
    } else {
      // Create
      preferences = new RoommatePreferences(preferencesFields);
      await preferences.save();
    }

    res.json(preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/roommate-preferences
// @desc    Get current user's roommate preferences
// @access  Private
exports.getPreferences = async (req, res) => {
  try {
    const preferences = await RoommatePreferences.findOne({ userId: req.user.id });

    if (!preferences) {
      return res.status(404).json({ message: 'Roommate preferences not found' });
    }

    res.json(preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/roommates
// @desc    Get potential roommates based on preferences
// @access  Private
exports.getPotentialRoommates = async (req, res) => {
  try {
    // Get current user's preferences
    const userPreferences = await RoommatePreferences.findOne({ userId: req.user.id });
    
    if (!userPreferences) {
      return res.status(400).json({ message: 'Please set your roommate preferences first' });
    }

    // Find all other users with preferences
    const allPreferences = await RoommatePreferences.find({ userId: { $ne: req.user.id } });

    // Calculate compatibility scores
    const potentialRoommates = [];

    for (const pref of allPreferences) {
      // Skip users who don't meet basic criteria
      if (!isBasicCompatible(userPreferences, pref)) {
        continue;
      }

      // Calculate compatibility score
      const compatibilityScore = calculateCompatibilityScore(userPreferences, pref);

      // Get user details
      const user = await User.findById(pref.userId).select('-password');

      // Add to potential roommates if score is above threshold
      if (compatibilityScore >= 50) {
        potentialRoommates.push({
          user,
          preferences: pref,
          compatibility: compatibilityScore
        });
      }
    }

    // Sort by compatibility score (highest first)
    potentialRoommates.sort((a, b) => b.compatibility - a.compatibility);

    res.json(potentialRoommates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/roommates/match/:userId
// @desc    Create a new match
// @access  Private
exports.createMatch = async (req, res) => {
  try {
    const { userId } = req.params;
    const { compatibilityScore } = req.body;

    // Check if the other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if match already exists
    const existingMatch = await Match.findOne({
      $or: [
        { userId1: req.user.id, userId2: userId },
        { userId1: userId, userId2: req.user.id }
      ]
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    // Create new match
    const newMatch = new Match({
      userId1: req.user.id,
      userId2: userId,
      compatibilityScore: compatibilityScore || 50,
      status: 'pending',
      dateMatched: Date.now()
    });

    const match = await newMatch.save();
    res.json(match);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/roommates/matches
// @desc    Get all matches for the user
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    // Find all matches where user is either userId1 or userId2
    const matches = await Match.find({
      $or: [
        { userId1: req.user.id },
        { userId2: req.user.id }
      ]
    }).sort({ dateMatched: -1 });

    // Add user details to matches
    const matchesWithDetails = await Promise.all(
      matches.map(async match => {
        // Determine which user is the other user
        const otherUserId = match.userId1.toString() === req.user.id 
          ? match.userId2 
          : match.userId1;
        
        // Get other user details
        const otherUser = await User.findById(otherUserId).select('-password');
        
        return {
          ...match.toObject(),
          otherUser
        };
      })
    );

    res.json(matchesWithDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/roommates/matches/:id/status
// @desc    Update match status
// @access  Private
exports.updateMatchStatus = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user is part of the match
    if (match.userId1.toString() !== req.user.id && 
        match.userId2.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this match' });
    }

    // Update status
    match.status = req.body.status;
    await match.save();

    res.json(match);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(500).send('Server error');
  }
};

// Helper functions
function generateHashedPreferences(preferences) {
  // Create a simple hash of key preferences for quick matching
  return `${preferences.cleanlinessLevel}-${preferences.noiseLevel}-${preferences.sleepSchedule}-${preferences.smokingPreferences}-${preferences.petsPreferences}`;
}

function isBasicCompatible(preferences1, preferences2) {
  // Check age range compatibility
  if (preferences1.ageRangeMin > preferences2.ageRangeMax || 
      preferences1.ageRangeMax < preferences2.ageRangeMin) {
    return false;
  }

  // Add more basic compatibility checks as needed
  return true;
}

function calculateCompatibilityScore(preferences1, preferences2) {
  let score = 0;
  let totalFactors = 0;

  // Cleanliness level (weight: 15%)
  const cleanlinessMatch = 5 - Math.abs(preferences1.cleanlinessLevel - preferences2.cleanlinessLevel);
  score += (cleanlinessMatch / 5) * 15;
  totalFactors += 15;

  // Noise level (weight: 15%)
  const noiseMatch = 5 - Math.abs(preferences1.noiseLevel - preferences2.noiseLevel);
  score += (noiseMatch / 5) * 15;
  totalFactors += 15;

  // Sleep schedule (weight: 15%)
  if (preferences1.sleepSchedule === preferences2.sleepSchedule) {
    score += 15;
  } else if (preferences1.sleepSchedule === 'flexible' || preferences2.sleepSchedule === 'flexible') {
    score += 10;
  }
  totalFactors += 15;

  // Smoking preferences (weight: 10%)
  if (preferences1.smokingPreferences === preferences2.smokingPreferences) {
    score += 10;
  } else if (preferences1.smokingPreferences === 'outdoors_only' || 
             preferences2.smokingPreferences === 'outdoors_only') {
    score += 5;
  }
  totalFactors += 10;

  // Pets preferences (weight: 10%)
  if (preferences1.petsPreferences === preferences2.petsPreferences) {
    score += 10;
  } else if (preferences1.petsPreferences === 'depends' || 
             preferences2.petsPreferences === 'depends') {
    score += 5;
  }
  totalFactors += 10;

  // Diet preferences (weight: 5%)
  if (preferences1.dietPreferences === preferences2.dietPreferences) {
    score += 5;
  }
  totalFactors += 5;

  // Guest preferences (weight: 10%)
  if (preferences1.guestPreferences === preferences2.guestPreferences) {
    score += 10;
  } else if (Math.abs(
      getGuestPreferenceValue(preferences1.guestPreferences) - 
      getGuestPreferenceValue(preferences2.guestPreferences)
    ) === 1) {
    score += 5;
  }
  totalFactors += 10;

  // Interests (weight: 20%)
  const commonInterests = preferences1.interests.filter(interest => 
    preferences2.interests.includes(interest)
  );
  
  const interestScore = commonInterests.length / 
    Math.max(1, Math.min(preferences1.interests.length, preferences2.interests.length));
  
  score += interestScore * 20;
  totalFactors += 20;

  // Calculate final percentage
  const finalScore = Math.round((score / totalFactors) * 100);
  return finalScore;
}

function getGuestPreferenceValue(preference) {
  switch (preference) {
    case 'often': return 3;
    case 'sometimes': return 2;
    case 'rarely': return 1;
    default: return 2;
  }
}
