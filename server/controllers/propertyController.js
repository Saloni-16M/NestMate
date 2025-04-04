const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');

// @route   POST api/properties
// @desc    Create a property
// @access  Private
exports.createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      description,
      address,
      city,
      state,
      zipCode,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      propertyType,
      isAvailable,
      availableFrom,
      amenities,
      images
    } = req.body;

    // Create new property
    const newProperty = new Property({
      ownerId: req.user.id,
      title,
      description,
      address,
      city,
      state,
      zipCode,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      propertyType,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      availableFrom,
      amenities: amenities || [],
      images: images || [],
      datePosted: Date.now()
    });

    const property = await newProperty.save();
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/properties
// @desc    Get all properties
// @access  Public
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ datePosted: -1 });
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/properties/:id
// @desc    Get property by ID
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private
exports.updateProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this property' });
    }

    // Update fields
    const {
      title,
      description,
      address,
      city,
      state,
      zipCode,
      price,
      bedrooms,
      bathrooms,
      areaSqFt,
      propertyType,
      isAvailable,
      availableFrom,
      amenities,
      images
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (address) property.address = address;
    if (city) property.city = city;
    if (state) property.state = state;
    if (zipCode) property.zipCode = zipCode;
    if (price) property.price = price;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (areaSqFt) property.areaSqFt = areaSqFt;
    if (propertyType) property.propertyType = propertyType;
    if (isAvailable !== undefined) property.isAvailable = isAvailable;
    if (availableFrom) property.availableFrom = availableFrom;
    if (amenities) property.amenities = amenities;
    if (images) property.images = images;

    await property.save();
    res.json(property);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this property' });
    }

    await property.remove();
    res.json({ message: 'Property removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/properties/user
// @desc    Get all properties created by the user
// @access  Private
exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id }).sort({ datePosted: -1 });
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/properties/interest/:id
// @desc    Express interest in a property
// @access  Private
exports.expressInterest = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the property is available
    if (!property.isAvailable) {
      return res.status(400).json({ message: 'This property is not available' });
    }

    // Check if user has already expressed interest
    if (property.interestedUsers.some(user => user.userId.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already expressed interest in this property' });
    }

    // Add user to interested users
    property.interestedUsers.unshift({
      userId: req.user.id,
      date: Date.now(),
      status: 'interested'
    });

    await property.save();
    res.json(property.interestedUsers);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/properties/interest
// @desc    Get all properties the user has expressed interest in
// @access  Private
exports.getUserInterests = async (req, res) => {
  try {
    const properties = await Property.find({
      'interestedUsers.userId': req.user.id
    });

    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/properties/interest/:id/:status
// @desc    Update interest status (for property owners)
// @access  Private
exports.updateInterestStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update interest status' });
    }

    // Find the interest to update
    const interestIndex = property.interestedUsers.findIndex(
      interest => interest.userId.toString() === req.params.userId
    );

    if (interestIndex === -1) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    // Update status
    property.interestedUsers[interestIndex].status = req.params.status;
    await property.save();

    res.json(property.interestedUsers);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).send('Server error');
  }
};
