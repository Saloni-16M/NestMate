const { check } = require('express-validator');

exports.registerValidation = [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('fullName', 'Full name is required').not().isEmpty()
];

exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.profileUpdateValidation = [
  check('fullName', 'Full name is required').optional(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('bio', 'Bio cannot be more than 500 characters').optional().isLength({ max: 500 })
];

exports.propertyValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zipCode', 'Zip code is required').not().isEmpty(),
  check('price', 'Price must be a number').isNumeric(),
  check('bedrooms', 'Number of bedrooms must be a number').isNumeric(),
  check('bathrooms', 'Number of bathrooms must be a number').isNumeric(),
  check('areaSqFt', 'Area in square feet must be a number').isNumeric(),
  check('propertyType', 'Property type is required').not().isEmpty()
];

exports.preferencesValidation = [
  check('cleanlinessLevel', 'Cleanliness level must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('noiseLevel', 'Noise level must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('sleepSchedule', 'Sleep schedule must be early_bird, night_owl, or flexible').isIn(['early_bird', 'night_owl', 'flexible']),
  check('dietPreferences', 'Diet preferences must be vegan, vegetarian, or no_restrictions').isIn(['vegan', 'vegetarian', 'no_restrictions']),
  check('smokingPreferences', 'Smoking preferences must be yes, no, or outdoors_only').isIn(['yes', 'no', 'outdoors_only']),
  check('petsPreferences', 'Pet preferences must be yes, no, or depends').isIn(['yes', 'no', 'depends']),
  check('guestPreferences', 'Guest preferences must be often, sometimes, or rarely').isIn(['often', 'sometimes', 'rarely']),
  check('ageRangeMin', 'Minimum age must be at least 18').isInt({ min: 18 }),
  check('ageRangeMax', 'Maximum age must be at least 18').isInt({ min: 18 })
];

exports.messageValidation = [
  check('recipientId', 'Recipient ID is required').not().isEmpty(),
  check('content', 'Message content is required').not().isEmpty()
];

exports.matchStatusValidation = [
  check('status', 'Status must be pending, accepted, or rejected').isIn(['pending', 'accepted', 'rejected'])
];

exports.interestStatusValidation = [
  check('status', 'Status must be a valid interest status').isIn(['interested', 'viewed', 'applied', 'approved', 'rejected'])
];
