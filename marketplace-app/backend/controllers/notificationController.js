const supabase = require('../config/supabaseClient');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;

    const mappedNotifications = notifications.map(n => ({ ...n, _id: n.id }));
    res.json(mappedNotifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ ...notification, _id: notification.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(404).json({ message: 'Notification not found or error deleting' });
    }
    
    res.json({ message: 'Notification removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification
};
