const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

const categories = [
  { name: 'Electronics', description: 'Gadgets, phones, and more', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
  { name: 'Fashion', description: 'Trendy clothes and shoes', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?w=800' },
  { name: 'Home & Kitchen', description: 'Essentials for your home', icon: 'Home', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
  { name: 'Groceries', description: 'Fresh food and daily needs', icon: 'ShoppingBasket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
  { name: 'Health & Beauty', description: 'Care for yourself', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800' },
];

const products = [
  // Electronics
  { title: "Pro Wireless Noise-Cancelling Headphones", description: "Experience crystal-clear sound with our flagship wireless headphones. Features active noise cancellation and 40-hour battery life.", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", category: "Electronics", stock: 50, averageRating: 4.8, reviewCount: 156 },
  { title: "Smart Watch Elite Series 7", description: "Stay connected and track your fitness with the latest Smart Watch Elite. Includes heart rate monitoring and GPS.", price: 399.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", category: "Electronics", stock: 120, averageRating: 4.9, reviewCount: 89 },
  { title: "Ultra Slim Laptop Pro 14\"", description: "Powerful performance in a sleek aluminum chassis. Perfect for professionals and creatives on the go.", price: 1299.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", category: "Electronics", stock: 30, averageRating: 4.7, reviewCount: 45 },
  { title: "Mechanical Gaming Keyboard RGB", description: "Tactile mechanical switches with customizable RGB lighting for the ultimate gaming experience.", price: 129.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800", category: "Electronics", stock: 200, averageRating: 4.6, reviewCount: 230 },

  // Fashion
  { title: "Premium Men's Silk Tie", description: "Elegant 100% silk tie for the modern gentleman. Hand-finished for superior quality.", price: 45.00, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800", category: "Fashion", stock: 300, averageRating: 4.5, reviewCount: 78 },
  { title: "Classic Leather Chelsea Boots", description: "Timeless Chelsea boots crafted from premium Italian leather. Durable and stylish.", price: 180.00, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800", category: "Fashion", stock: 85, averageRating: 4.7, reviewCount: 112 },
  { title: "Women's Oversized Cashmere Sweater", description: "Luxuriously soft oversized cashmere sweater. Perfect for chilly evenings.", price: 220.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", category: "Fashion", stock: 150, averageRating: 4.9, reviewCount: 64 },
  { title: "Minimalist Unisex Backpack", description: "Clean design meets functionality. Water-resistant material with a padded laptop compartment.", price: 75.00, image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=800", category: "Fashion", stock: 250, averageRating: 4.4, reviewCount: 190 },

  // Home & Kitchen
  { title: "Professional Espresso Machine", description: "Brew cafe-quality espresso at home. Features precise temperature control and milk frother.", price: 599.99, image: "https://images.unsplash.com/photo-1534131707746-25d604851a1f?w=800", category: "Home & Kitchen", stock: 40, averageRating: 4.8, reviewCount: 56 },
  { title: "Ceramic Non-Stick Cookware Set (12pc)", description: "Complete set of eco-friendly ceramic non-stick pots and pans. PFOA-free.", price: 249.99, image: "https://images.unsplash.com/photo-1584990344619-391e9ef74c41?w=800", category: "Home & Kitchen", stock: 100, averageRating: 4.5, reviewCount: 143 },
  { title: "Smart Air Purifier HEPA", description: "Remove 99.9% of allergens and pollutants from your home with smart monitoring.", price: 199.99, image: "https://images.unsplash.com/photo-1585771724684-2626fc4858d1?w=800", category: "Home & Kitchen", stock: 180, averageRating: 4.6, reviewCount: 210 },
  { title: "Weighted Sleep Blanket 15lbs", description: "Calm your nervous system and sleep better with our deep pressure weighted blanket.", price: 110.00, image: "https://images.unsplash.com/photo-1580302212146-f6a8e811375d?w=800", category: "Home & Kitchen", stock: 300, averageRating: 4.7, reviewCount: 320 },

  // Groceries
  { title: "Organic Quinoa 2kg", description: "Premium organic white quinoa. High in protein and gluten-free.", price: 14.99, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800", category: "Groceries", stock: 500, averageRating: 4.9, reviewCount: 450 },
  { title: "Cold Pressed Extra Virgin Olive Oil 1L", description: "Pure Mediterranean olive oil. Perfect for dressings and cooking.", price: 22.50, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800", category: "Groceries", stock: 200, averageRating: 4.8, reviewCount: 180 },
  { title: "Artisan Coffee Beans Roast Master", description: "Ethically sourced whole bean coffee. Rich chocolatey and nutty profile.", price: 18.00, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800", category: "Groceries", stock: 150, averageRating: 4.9, reviewCount: 520 },
  { title: "Manuka Honey MGO 400+", description: "Authentic New Zealand Manuka honey with high antibacterial properties.", price: 45.00, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800", category: "Groceries", stock: 90, averageRating: 5.0, reviewCount: 95 },

  // Health & Beauty
  { title: "Advanced Anti-Aging Serum", description: "Dermatologist-tested serum with Vitamin C and Hyaluronic Acid.", price: 55.00, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800", category: "Health & Beauty", stock: 200, averageRating: 4.7, reviewCount: 312 },
  { title: "Professional Hair Dryer ionic", description: "Fast-drying ionic technology for smooth, salon-finish hair at home.", price: 89.99, image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800", category: "Health & Beauty", stock: 130, averageRating: 4.6, reviewCount: 156 },
  { title: "Himalayan Salt Lamp Large", description: "Natural air purifier and beautiful warm ambient light for your home.", price: 35.00, image: "https://images.unsplash.com/photo-1536924430914-72f9390b14f3?w=800", category: "Health & Beauty", stock: 250, averageRating: 4.5, reviewCount: 420 },
  { title: "Eco-Friendly Bamboo Toothbrush Set (4pc)", description: "Biodegradable charcoal-infused bamboo toothbrushes.", price: 12.00, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800", category: "Health & Beauty", stock: 1000, averageRating: 4.4, reviewCount: 850 },
];

const Category = require('../models/Category');

// POST /api/seed  — seeds the DB with products and categories (dev only)
router.post('/', async (req, res) => {
  try {
    // Clear existing data for a fresh seed
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);

    // Find or create a demo trader
    let trader = await User.findOne({ role: 'trader' });
    if (!trader) {
      trader = await User.create({
        name: 'Demo Seller',
        email: 'seller@marketplace.com',
        password: 'Seller@123',
        role: 'trader',
      });
    }

    // Find or create an admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@marketplace.com',
        password: 'Admin@123',
        role: 'admin',
      });
    }

    const productsWithTrader = products.map((p) => ({ ...p, traderId: trader._id }));
    await Product.insertMany(productsWithTrader);

    res.json({ 
      message: `✅ Seeded ${products.length} products and ${createdCategories.length} categories!`, 
      productCount: products.length,
      categoryCount: createdCategories.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/seed — clears all products (dev only)
router.delete('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: '🗑️ All products cleared.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/seed/verify — check for non-standard products (dev only)
router.get('/verify', async (req, res) => {
  try {
    const products = await Product.find({});
    const nonStandard = [];

    products.forEach(p => {
      const issues = [];
      if (!p.title || p.title === 'Sample title') issues.push('Generic or missing title');
      if (!p.description || p.description === 'Sample description') issues.push('Generic or missing description');
      if (!p.price || p.price <= 0) issues.push('Invalid or zero price');
      if (!p.image || p.image.includes('placeholder') || p.image === '/images/sample.jpg') issues.push('Placeholder or missing image');
      if (!p.category || p.category === 'Uncategorized') issues.push('Generic or missing category');
      if (p.stock === undefined || p.stock < 0) issues.push('Invalid stock');

      if (issues.length > 0) {
        nonStandard.push({
          id: p._id,
          title: p.title,
          issues
        });
      }
    });

    res.json({
      totalProducts: products.length,
      nonStandardCount: nonStandard.length,
      nonStandardProducts: nonStandard,
      message: nonStandard.length === 0 ? '✅ All products are standardized!' : '⚠️ Found some non-standard products.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.products = products;


