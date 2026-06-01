const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const supabase = require('../config/supabaseClient'); // Kept for users/products lookup

const DATA_FILE = path.join(__dirname, '../data/chats.json');

// Initialize local DB
const getChatData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ conversations: [], messages: [] }));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

const saveChatData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const data = getChatData();
    const myConvs = data.conversations.filter(c => c.user1_id === req.user.id || c.user2_id === req.user.id);
    
    // Sort by updated_at descending
    myConvs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Fetch user details from supabase for these conversations
    const userIds = [...new Set(myConvs.flatMap(c => [c.user1_id, c.user2_id]))];
    let usersMap = {};
    if (userIds.length > 0) {
       const { data: usersData } = await supabase.from('users').select('id, name, profile_image, role').in('id', userIds);
       if (usersData) {
          usersMap = usersData.reduce((acc, u) => ({...acc, [u.id]: u}), {});
       }
    }

    const productIds = [...new Set(myConvs.map(c => c.product_id).filter(Boolean))];
    let productsMap = {};
    if (productIds.length > 0) {
       const { data: prodsData } = await supabase.from('products').select('id, title, image').in('id', productIds);
       if (prodsData) {
          productsMap = prodsData.reduce((acc, p) => ({...acc, [p.id]: p}), {});
       }
    }

    const mappedConversations = myConvs.map(c => {
      const u1 = usersMap[c.user1_id] || { name: 'Unknown', role: 'customer' };
      const u2 = usersMap[c.user2_id] || { name: 'Unknown', role: 'customer' };
      const p = c.product_id ? productsMap[c.product_id] : null;

      return {
        ...c,
        _id: c.id,
        participants: [
          { _id: c.user1_id, name: u1.name, profileImage: u1.profile_image, role: u1.role },
          { _id: c.user2_id, name: u2.name, profileImage: u2.profile_image, role: u2.role }
        ],
        productId: p ? { _id: p.id, title: p.title, image: p.image } : null
      };
    });

    res.json(mappedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const data = getChatData();
    const myMsgs = data.messages
       .filter(m => m.conversation_id === req.params.conversationId)
       .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const mappedMessages = myMsgs.map(m => ({
      ...m,
      _id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      createdAt: m.created_at,
      isRead: m.is_read,
      conversationId: m.conversation_id,
    }));
    
    res.json(mappedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, messageText } = req.body;
    const db = getChatData();

    // Find conversation
    let conversation = db.conversations.find(c => 
       ((c.user1_id === req.user.id && c.user2_id === receiverId) || 
        (c.user1_id === receiverId && c.user2_id === req.user.id)) &&
       c.product_id === (productId || null)
    );

    const now = new Date().toISOString();

    if (!conversation) {
      conversation = {
         id: crypto.randomUUID(),
         user1_id: req.user.id,
         user2_id: receiverId,
         product_id: productId || null,
         created_at: now,
         updated_at: now
      };
      db.conversations.push(conversation);
    } else {
      conversation.updated_at = now;
    }

    const newMessage = {
       id: crypto.randomUUID(),
       conversation_id: conversation.id,
       sender_id: req.user.id,
       receiver_id: receiverId,
       message: messageText,
       is_read: false,
       created_at: now
    };
    db.messages.push(newMessage);
    saveChatData(db);

    const io = req.app.get('socketio');
    if (io) {
      io.to(receiverId).emit('new_notification', { 
         _id: crypto.randomUUID(),
         user_id: receiverId,
         type: 'chat',
         content: `New message from ${req.user.name}: "${messageText.substring(0, 30)}..."`,
         is_read: false,
         created_at: now
      });
    }

    const normalizedMessage = {
      ...newMessage,
      _id: newMessage.id,
      senderId: newMessage.sender_id,
      receiverId: newMessage.receiver_id,
      createdAt: newMessage.created_at,
      isRead: newMessage.is_read,
      conversationId: newMessage.conversation_id,
    };

    res.status(201).json(normalizedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/chat/read/:conversationId
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const db = getChatData();
    let modified = false;

    db.messages = db.messages.map(m => {
       if (m.conversation_id === conversationId && m.receiver_id === req.user.id && !m.is_read) {
          modified = true;
          return { ...m, is_read: true };
       }
       return m;
    });

    if (modified) {
       saveChatData(db);
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };
