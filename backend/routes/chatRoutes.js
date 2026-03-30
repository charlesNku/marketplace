const express = require('express');
const { getConversations, getMessages, sendMessage, markAsRead } = require('../controllers/chatController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/conversations').get(protect, getConversations);
router.route('/messages/:conversationId').get(protect, getMessages);
router.route('/message').post(protect, sendMessage);
router.route('/read/:conversationId').put(protect, markAsRead);


module.exports = router;
