const express = require('express');
const router = express.Router();
const roommateController = require('../../controllers/roommateController');
const auth = require('../../middleware/auth');
const { preferencesValidation, matchStatusValidation } = require('../../middleware/validator');

// @route   POST api/roommate-preferences
// @desc    Create or update roommate preferences
// @access  Private
router.post('/preferences', auth, preferencesValidation, roommateController.createPreferences);

// @route   GET api/roommate-preferences
// @desc    Get current user's roommate preferences
// @access  Private
router.get('/preferences', auth, roommateController.getPreferences);

// @route   GET api/roommates
// @desc    Get potential roommates based on preferences
// @access  Private
router.get('/', auth, roommateController.getPotentialRoommates);

// @route   POST api/roommates/match/:userId
// @desc    Create a new match
// @access  Private
router.post('/match/:userId', auth, roommateController.createMatch);

// @route   GET api/roommates/matches
// @desc    Get all matches for the user
// @access  Private
router.get('/matches', auth, roommateController.getMatches);

// @route   PUT api/roommates/matches/:id/status
// @desc    Update match status
// @access  Private
router.put('/matches/:id/status', auth, matchStatusValidation, roommateController.updateMatchStatus);

module.exports = router;
