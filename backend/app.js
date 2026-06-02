const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
if (isVercel) {
  app.use('/api/uploads', express.static('/tmp'));
  app.use('/api/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));
} else {
  app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Routes
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const seedRoutes = require('./routes/seedRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/upload', uploadRoutes);

// Attach io to app for use in controllers
app.set('socketio', io);

app.get('/', (req, res) => {
  res.send('Marketplace API is running');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected socket ID:', socket.id);

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('join_user', (userId) => {
    socket.join(userId);
    console.log(`User socket joined personal room: ${userId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.conversationId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user_typing', { userId: data.userId, conversationId: data.conversationId });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.conversationId).emit('user_stop_typing', { userId: data.userId, conversationId: data.conversationId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, server };
