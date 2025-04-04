const express = require('express');
const router = express.Router();
const propertyController = require('../../controllers/propertyController');
const auth = require('../../middleware/auth');
const { propertyValidation, interestStatusValidation } = require('../../middleware/validator');

// @route   POST api/properties
// @desc    Create a property
// @access  Private
router.post('/', auth, propertyValidation, propertyController.createProperty);

// @route   GET api/properties
// @desc    Get all properties
// @access  Public
router.get('/', propertyController.getAllProperties);

// @route   GET api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', propertyController.getPropertyById);

// @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private
router.put('/:id', auth, propertyValidation, propertyController.updateProperty);

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private
router.delete('/:id', auth, propertyController.deleteProperty);

// @route   GET api/properties/user
// @desc    Get all properties created by the user
// @access  Private
router.get('/user', auth, propertyController.getUserProperties);

// @route   POST api/properties/interest/:id
// @desc    Express interest in a property
// @access  Private
router.post('/interest/:id', auth, propertyController.expressInterest);

// @route   GET api/properties/interest
// @desc    Get all properties the user has expressed interest in
// @access  Private
router.get('/interest', auth, propertyController.getUserInterests);

// @route   PUT api/properties/interest/:id/:status
// @desc    Update interest status (for property owners)
// @access  Private
router.put('/interest/:id/:userId/:status', auth, interestStatusValidation, propertyController.updateInterestStatus);

module.exports = router;
