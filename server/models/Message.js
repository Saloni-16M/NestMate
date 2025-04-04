const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  dateSent: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('message', MessageSchema);
