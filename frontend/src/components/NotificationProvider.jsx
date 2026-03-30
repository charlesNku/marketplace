import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const NotificationProvider = ({ children }) => {
  const { userInfo } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const socketRef = useRef();

  useEffect(() => {
    if (userInfo?._id) {
      socketRef.current = io(`http://${window.location.hostname}:5000`);
      
      // Join personal room for targeted notifications
      socketRef.current.emit('join_user', userInfo._id);

      // Listen for new notifications
      socketRef.current.on('new_notification', (notification) => {
        addNotification(notification);
        
        // Browser notification (optional)
        if (Notification.permission === 'granted') {
           new Notification('Platform Alert', {
             body: notification.message,
             icon: '/favicon.ico'
           });
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userInfo, addNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
