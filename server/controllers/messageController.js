const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipientId, content } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create new message
    const newMessage = new Message({
      senderId: req.user.id,
      recipientId,
      content,
      dateSent: Date.now(),
      isRead: false
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/messages
// @desc    Get all conversations for the user
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    // Find all messages where the user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id },
        { recipientId: req.user.id }
      ]
    }).sort({ dateSent: -1 });

    // Group messages by conversation
    const conversations = {};
    
    for (const message of messages) {
      const otherUserId = message.senderId.toString() === req.user.id 
        ? message.recipientId.toString() 
        : message.senderId.toString();
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          messages: [],
          otherUserId,
          unreadCount: 0
        };
      }
      
      conversations[otherUserId].messages.push(message);
      
      // Count unread messages
      if (message.recipientId.toString() === req.user.id && !message.isRead) {
        conversations[otherUserId].unreadCount++;
      }
    }

    // Convert to array and add user details
    const conversationsArray = await Promise.all(
      Object.values(conversations).map(async (conversation) => {
        // Sort messages by date (newest first)
        conversation.messages.sort((a, b) => b.dateSent - a.dateSent);
        
        // Get other user's details
        const otherUser = await User.findById(conversation.otherUserId)
          .select('fullName profileImage');
        
        return {
          ...conversation,
          otherUser,
          latestMessage: conversation.messages[0]
        };
      })
    );

    // Sort conversations by latest message date
    conversationsArray.sort((a, b) => 
      b.latestMessage.dateSent - a.latestMessage.dateSent
    );

    res.json(conversationsArray);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/messages/:userId
// @desc    Get conversation with a specific user
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    // Find messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, recipientId: req.params.userId },
        { senderId: req.params.userId, recipientId: req.user.id }
      ]
    }).sort({ dateSent: 1 });

    // Get other user details
    const otherUser = await User.findById(req.params.userId)
      .select('fullName profileImage');
    
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      messages,
      otherUser
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   PUT api/messages/:id/read
// @desc    Mark a message as read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the recipient
    if (message.recipientId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to mark this message as read' });
    }

    // Mark as read
    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.senderId.toString() !== req.user.id && 
        message.recipientId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this message' });
    }

    await message.remove();
    res.json({ message: 'Message removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).send('Server error');
  }
};
