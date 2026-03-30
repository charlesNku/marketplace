import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  unreadCount: 0,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      set({ 
        notifications: data, 
        unreadCount: data.filter(n => !n.isRead).length,
        loading: false 
      });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      set({ loading: false });
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));

export default useNotificationStore;
