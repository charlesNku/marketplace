const supabase = require('../config/supabaseClient');

// GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*, users!user1_id(name, profile_image, role), users!user2_id(name, profile_image, role), products(title, image)')
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Map for frontend compatibility
    const mappedConversations = conversations.map(c => ({
      ...c,
      _id: c.id,
      participants: [
        { _id: c.user1_id, name: c.users_user1_id.name, profileImage: c.users_user1_id.profile_image, role: c.users_user1_id.role },
        { _id: c.user2_id, name: c.users_user2_id.name, profileImage: c.users_user2_id.profile_image, role: c.users_user2_id.role }
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
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', req.params.conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const mappedMessages = messages.map(m => ({ ...m, _id: m.id }));
    res.json(mappedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, productId, messageText } = req.body;

    // Check if conversation exists (in either order)
    let { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${req.user.id},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${req.user.id})`)
      .eq('product_id', productId)
      .single();

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

    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversation.id,
        sender_id: req.user.id,
        receiver_id: receiverId,
        message: messageText
      }])
      .select()
      .single();

    if (msgError) throw msgError;

    // Create Notification
    const { data: notification } = await supabase
      .from('notifications')
      .insert([{
        user_id: receiverId,
        type: 'chat',
        content: `New message from ${req.user.name}: "${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}"`
      }])
      .select()
      .single();

    const io = req.app.get('socketio');
    if (io && notification) {
      io.to(receiverId).emit('new_notification', { ...notification, _id: notification.id });
    }

    res.status(201).json({ ...message, _id: message.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

