const supabase = require('../config/supabaseClient');
const path = require('path');

const DATA_FILE = path.join(require('os').tmpdir(), 'chats.json');

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*, user1:users!user1_id(name, profile_image, role), user2:users!user2_id(name, profile_image, role), products(title, image)')
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Map for frontend compatibility
    const mappedConversations = conversations.map(c => ({
      ...c,
      _id: c.id,
      participants: [
        { _id: c.user1_id, name: c.user1.name, profileImage: c.user1.profile_image, role: c.user1.role },
        { _id: c.user2_id, name: c.user2.name, profileImage: c.user2.profile_image, role: c.user2.role }
      ],
      productId: c.products ? { _id: c.product_id, title: c.products.title, image: c.products.image } : null
    }));

    res.json(mappedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    let messages;
    const queryResponse = await supabase
      .from('messages')
      .select('*, parentMessage:parent_message_id(message, sender_id)')
      .eq('conversation_id', req.params.conversationId)
      .order('created_at', { ascending: true });

    if (queryResponse.error) {
      // Fallback: If parent_message_id column or relationship is missing
      if (queryResponse.error.code === '42703' || queryResponse.error.code === 'PGRST200' || (queryResponse.error.message && queryResponse.error.message.includes('parent_message_id'))) {
        const fallbackResponse = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', req.params.conversationId)
          .order('created_at', { ascending: true });

        if (fallbackResponse.error) throw fallbackResponse.error;
        messages = fallbackResponse.data;
      } else {
        throw queryResponse.error;
      }
    } else {
      messages = queryResponse.data;
    }

    const mappedMessages = (messages || []).map(m => ({
      ...m,
      _id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      createdAt: m.created_at,
      isRead: m.is_read,
      conversationId: m.conversation_id,
      parentMessage: m.parentMessage ? { message: m.parentMessage.message, senderId: m.parentMessage.sender_id } : null
    }));
    res.json(mappedMessages);
  } catch (error) {
    console.error('getMessages error details:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, messageText, parentMessageId } = req.body;
    let { productId } = req.body;

    // Normalize productId to null if it's empty, "null", or undefined
    if (!productId || productId === 'null' || productId === 'undefined' || productId === '') {
      productId = null;
    }

    // Check if conversation exists (in either order)
    let query = supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${req.user.id},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${req.user.id})`);

    if (productId) {
      query = query.eq('product_id', productId);
    } else {
      query = query.is('product_id', null);
    }

    let { data: conversation, error: findError } = await query.maybeSingle();

    if (findError) throw findError;

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert([{
          user1_id: req.user.id,
          user2_id: receiverId,
          product_id: productId
        }])
        .select()
        .single();

      if (convError) throw convError;
      conversation = newConv;
    } else {
      // Update last message timestamp
      await supabase.from('conversations').update({ updated_at: new Date() }).eq('id', conversation.id);
    }

    // Insert payload
    const insertPayload = {
      conversation_id: conversation.id,
      sender_id: req.user.id,
      receiver_id: receiverId,
      message: messageText
    };

    if (parentMessageId) {
      insertPayload.parent_message_id = parentMessageId;
    }

    let message;
    const msgResponse = await supabase
      .from('messages')
      .insert([insertPayload])
      .select('*, parentMessage:parent_message_id(message, sender_id)')
      .maybeSingle();

    if (msgResponse.error) {
      // Fallback if parent_message_id is not supported or relationship missing
      if (msgResponse.error.code === '42703' || msgResponse.error.code === 'PGRST200' || (msgResponse.error.message && msgResponse.error.message.includes('parent_message_id'))) {
        delete insertPayload.parent_message_id;
        const fallbackMsgResponse = await supabase
          .from('messages')
          .insert([insertPayload])
          .select('*')
          .single();

        if (fallbackMsgResponse.error) throw fallbackMsgResponse.error;
        message = fallbackMsgResponse.data;
      } else {
        throw msgResponse.error;
      }
    } else {
      message = msgResponse.data;
    }

    // Create Notification
    const { data: notification } = await supabase
      .from('notifications')
      .insert([{
        user_id: receiverId,
        type: 'chat',
        content: `New message from ${req.user.name}: "${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}"`
      }])
      .select()
      .maybeSingle();

    if (!message) throw new Error("Failed to insert message, received null data.");

    const normalizedMessage = {
      ...message,
      _id: message.id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      createdAt: message.created_at,
      isRead: message.is_read,
      conversationId: message.conversation_id,
      parentMessage: message.parentMessage ? { message: message.parentMessage.message, senderId: message.parentMessage.sender_id } : null
    };

    const io = req.app.get('socketio');
    if (io) {
      if (notification) {
        io.to(receiverId).emit('new_notification', { ...notification, _id: notification.id });
      }
      // Emit the message to participants
      io.to(conversation.id).to(req.user.id).to(receiverId).emit('receive_message', normalizedMessage);
    }

    res.status(201).json(normalizedMessage);
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ message: error.message, detail: error.details || error.hint || null });
  }
};

// PUT /api/chat/read/:conversationId
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };

