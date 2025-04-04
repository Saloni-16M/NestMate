const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'roommate-finder-secret-key';

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, fullName, userType, profileImage, bio, phoneNumber } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      fullName,
      userType: userType || 'renter',
      profileImage,
      bio,
      phoneNumber
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
exports.getUser = async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/auth/user
// @desc    Update user profile
// @access  Private
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, username, email, profileImage, bio, phoneNumber } = req.body;

  // Build user object
  const userFields = {};
  if (fullName) userFields.fullName = fullName;
  if (username) userFields.username = username;
  if (email) userFields.email = email;
  if (profileImage) userFields.profileImage = profileImage;
  if (bio) userFields.bio = bio;
  if (phoneNumber) userFields.phoneNumber = phoneNumber;

  try {
    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Update user
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/users
// @desc    Get all users (for admin only)
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/auth/user
// @desc    Delete user
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    // Delete user
    await User.findByIdAndRemove(req.user.id);

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
