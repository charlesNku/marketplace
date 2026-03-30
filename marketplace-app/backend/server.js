const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

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

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB Connected to local MongoDB');
  } catch (err) {
    console.log('Local MongoDB not found. Starting In-Memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('In-Memory MongoDB Connected!');
      
        // Automatically seed admin and trader users for development
        try {
          const User = require('./models/User');
          const Product = require('./models/Product');
          
          let admin = await User.findOne({ role: 'admin' });
          if (!admin) {
            await User.create({
              name: 'System Admin',
              email: 'admin@marketplace.com',
              password: 'Admin@123',
              role: 'admin',
            });
          }
          let trader = await User.findOne({ role: 'trader' });
          if (!trader) {
            trader = await User.create({
              name: 'Demo Seller',
              email: 'seller@marketplace.com',
              password: 'Seller@123',
              role: 'trader',
            });
          }
          
          // Seed products if none exist
          const productCount = await Product.countDocuments();
          if (productCount === 0) {
             const { products } = require('./routes/seedRoutes');
             const productsWithTrader = products.map((p) => ({ ...p, traderId: trader._id }));
             await Product.insertMany(productsWithTrader);
             console.log(`✅ Auto-seeded ${products.length} Products for In-Memory DB`);
          }

          console.log('✅ Auto-seeded Admin, Trader, and Products for In-Memory DB');
        } catch (seedErr) {
          console.log('Error auto-seeding DB:', seedErr.message);
        }

    } catch (memoryErr) {
      console.log('In-Memory MongoDB connection error:', memoryErr);
    }
  }
};
connectDB();

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

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);

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

  socket.on('messages_read', (data) => {
    io.to(data.conversationId).emit('messages_read', data);
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
