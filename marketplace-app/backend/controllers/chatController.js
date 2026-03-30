const Conversation = require('../models/Conversation.js');
const Message = require('../models/Message.js');

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: { $in: [req.user._id] } })
      .populate('participants', 'name profileImage role')
      .populate('productId', 'title image')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, messageText } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
      productId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        productId,
        lastMessage: messageText
      });
    } else {
      conversation.lastMessage = messageText;
      await conversation.save();
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user._id,
      receiverId,
      productId,
      message: messageText
    });

    // Create Notification for the receiver
    const Notification = require('../models/Notification');
    const chatNotification = await Notification.create({
      userId: receiverId,
      type: 'chat',
      message: `New message from ${req.user.name}: "${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}"`
    });

    const io = req.app.get('socketio');
    if (io) {
      io.to(receiverId.toString()).emit('new_notification', chatNotification);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/chat/read/:conversationId
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Message.updateMany(
      { conversationId, receiverId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };

