const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageController');
const auth = require('../../middleware/auth');
const { messageValidation } = require('../../middleware/validator');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, messageValidation, messageController.sendMessage);

// @route   GET api/messages
// @desc    Get all conversations for the user
// @access  Private
router.get('/', auth, messageController.getConversations);

// @route   GET api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:userId', auth, messageController.getConversation);

// @route   PUT api/messages/:id/read
// @desc    Mark a message as read
// @access  Private
router.put('/:id/read', auth, messageController.markAsRead);

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
