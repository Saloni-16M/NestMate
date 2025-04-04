const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const { registerValidation, loginValidation, profileUpdateValidation } = require('../../middleware/validator');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', registerValidation, userController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, userController.loginUser);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, userController.getUser);

// @route   PUT api/auth/user
// @desc    Update user profile
// @access  Private
router.put('/user', auth, profileUpdateValidation, userController.updateUser);

// @route   DELETE api/auth/user
// @desc    Delete user
// @access  Private
router.delete('/user', auth, userController.deleteUser);

// @route   GET api/users
// @desc    Get all users (for admin only)
// @access  Private/Admin
router.get('/', auth, userController.getAllUsers);

module.exports = router;
