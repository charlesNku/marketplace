const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // Clothes
  { title: "Men's Classic T-Shirt", description: 'Premium 100% cotton t-shirt. Everyday essential.', price: 15.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', category: 'Clothes', stock: 150, averageRating: 4.5, reviewCount: 120 },
  { title: "Women's Summer Dress", description: 'Lightweight floral print summer dress.', price: 35.99, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', category: 'Clothes', stock: 80, averageRating: 4.7, reviewCount: 200 },
  { title: "Unisex Winter Jacket", description: 'Warm and waterproof winter jacket.', price: 89.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', category: 'Clothes', stock: 45, averageRating: 4.8, reviewCount: 85 },
  { title: "Kids Denim Jeans", description: 'Durable and comfortable denim jeans for kids.', price: 25.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', category: 'Clothes', stock: 110, averageRating: 4.4, reviewCount: 60 },

  // Shoes
  { title: 'Running Sneakers Pro', description: 'Lightweight breathable mesh sneakers for running.', price: 65.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Shoes', stock: 200, averageRating: 4.6, reviewCount: 340 },
  { title: "Men's Leather Loafers", description: 'Classic genuine leather slip-on loafers.', price: 85.99, image: 'https://images.unsplash.com/photo-1614252209825-f0000270a417?w=500', category: 'Shoes', stock: 65, averageRating: 4.8, reviewCount: 150 },
  { title: "Women's Ankle Boots", description: 'Stylish suede ankle boots with a low heel.', price: 75.99, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', category: 'Shoes', stock: 95, averageRating: 4.5, reviewCount: 210 },
  { title: 'Kids Velcro Sneakers', description: 'Easy-to-wear comfortable sneakers for kids.', price: 30.99, image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500', category: 'Shoes', stock: 140, averageRating: 4.3, reviewCount: 95 },

  // Rices
  { title: 'Premium Basmati Rice 5kg', description: 'Long-grain aromatic basmati rice. Perfect for biryani.', price: 18.99, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', category: 'Rices', stock: 300, averageRating: 4.9, reviewCount: 450 },
  { title: 'Jasmine Rice 10kg', description: 'Fragrant and sticky jasmine rice imported from Thailand.', price: 24.99, image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500', category: 'Rices', stock: 150, averageRating: 4.7, reviewCount: 180 },
  { title: 'Brown Whole Grain Rice 2kg', description: 'Healthy and nutritious brown rice.', price: 9.99, image: 'https://images.unsplash.com/photo-1596562541748-ebc3cc807c4c?w=500', category: 'Rices', stock: 120, averageRating: 4.6, reviewCount: 110 },
  { title: 'Sushi Rice Medium Grain 1kg', description: 'Authentic sticky white rice for making sushi.', price: 6.99, image: 'https://images.unsplash.com/photo-1613588718956-c2e80315bf61?w=500', category: 'Rices', stock: 85, averageRating: 4.8, reviewCount: 90 },

  // Maize Flour
  { title: 'White Maize Flour 5kg', description: 'Finely milled white maize flour for ugali or tortillas.', price: 12.50, image: 'https://images.unsplash.com/photo-1626200419131-eb4715560bfa?w=500', category: 'Maize Flour', stock: 400, averageRating: 4.5, reviewCount: 300 },
  { title: 'Yellow Cornmeal 2kg', description: 'Coarse yellow cornmeal for baking cornbread.', price: 7.99, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', category: 'Maize Flour', stock: 250, averageRating: 4.4, reviewCount: 150 },
  { title: 'Organic Masa Harina 1kg', description: 'Nixtamalized corn flour for authentic Mexican cuisine.', price: 8.50, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', category: 'Maize Flour', stock: 110, averageRating: 4.7, reviewCount: 88 },
  { title: 'Super Fine Maize Flour 10kg', description: 'Bulk packed high-quality maize flour for restaurants.', price: 22.00, image: 'https://images.unsplash.com/photo-1586525198428-225f6f12cff5?w=500', category: 'Maize Flour', stock: 50, averageRating: 4.6, reviewCount: 45 },

  // Keep a few other items for other categories
  { title: 'Wireless Bluetooth Headphones Pro', description: 'Premium noise-cancelling headphones.', price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electronics', stock: 85, averageRating: 4.7, reviewCount: 312 },
  { title: 'Non-Stick Frying Pan', description: 'Ceramic-coated frying pan.', price: 44.99, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', category: 'Home', stock: 140, averageRating: 4.5, reviewCount: 302 },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a trader user to assign as seller
    let trader = await User.findOne({ role: 'trader' });

    if (!trader) {
      console.log('No trader found. Creating a default trader...');
      trader = await User.create({
        name: 'Demo Seller',
        email: 'seller@marketplace.com',
        password: 'seller123',
        role: 'trader',
      });
      console.log(`✅ Created trader: ${trader.email}`);
    } else {
      console.log(`✅ Using existing trader: ${trader.email}`);
    }

    // Map traderId onto each product
    const productsWithTrader = products.map((p) => ({ ...p, traderId: trader._id }));

    // Insert all 50 products
    await Product.insertMany(productsWithTrader);

    console.log(`\n🎉 Successfully seeded ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedProducts();
