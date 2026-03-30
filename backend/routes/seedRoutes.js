const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

const categories = [
  { name: 'Electronics', description: 'Gadgets, phones, and more', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
  { name: 'Fashion', description: 'Trendy clothes and shoes', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1445205170230-053b830c6039?w=800' },
  { name: 'Home & Kitchen', description: 'Essentials for your home', icon: 'Home', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800' },
  { name: 'Groceries', description: 'Fresh food and daily needs', icon: 'ShoppingBasket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
  { name: 'Health & Beauty', description: 'Care for yourself', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800' },
];

const products = [
  // ===== ELECTRONICS (8 products) =====
  { title: "Pro Wireless Noise-Cancelling Headphones", description: "Experience crystal-clear sound with our flagship wireless headphones. Features active noise cancellation and 40-hour battery life.", price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", category: "Electronics", stock: 50, average_rating: 4.8, review_count: 156 },
  { title: "Smart Watch Elite Series 7", description: "Stay connected and track your fitness with the latest Smart Watch Elite. Includes heart rate monitoring and GPS.", price: 399.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", category: "Electronics", stock: 120, average_rating: 4.9, review_count: 89 },
  { title: "Ultra Slim Laptop Pro 14\"", description: "Powerful performance in a sleek aluminum chassis. Perfect for professionals and creatives on the go.", price: 1299.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", category: "Electronics", stock: 30, average_rating: 4.7, review_count: 45 },
  { title: "Mechanical Gaming Keyboard RGB", description: "Tactile mechanical switches with customizable RGB lighting for the ultimate gaming experience.", price: 129.99, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800", category: "Electronics", stock: 200, average_rating: 4.6, review_count: 230 },
  { title: "4K Ultra HD Wireless Webcam", description: "Professional-grade webcam with auto-focus, low-light correction, and built-in noise-cancelling microphone.", price: 179.99, image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800", category: "Electronics", stock: 75, average_rating: 4.5, review_count: 98 },
  { title: "Portable Bluetooth Speaker Waterproof", description: "360° immersive sound with IPX7 waterproof rating. Perfect for outdoor adventures and pool parties.", price: 89.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800", category: "Electronics", stock: 320, average_rating: 4.7, review_count: 412 },
  { title: "Wireless Charging Pad Duo", description: "Charge two devices simultaneously with Qi-compatible fast wireless charging. Sleek minimalist design.", price: 49.99, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800", category: "Electronics", stock: 500, average_rating: 4.3, review_count: 167 },
  { title: "Noise-Cancelling Earbuds Pro", description: "Premium true wireless earbuds with adaptive ANC, transparency mode, and 30-hour total battery life.", price: 249.99, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800", category: "Electronics", stock: 180, average_rating: 4.8, review_count: 534 },

  // ===== FASHION (8 products) =====
  { title: "Premium Men's Silk Tie", description: "Elegant 100% silk tie for the modern gentleman. Hand-finished for superior quality.", price: 45.00, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800", category: "Fashion", stock: 300, average_rating: 4.5, review_count: 78 },
  { title: "Classic Leather Chelsea Boots", description: "Timeless Chelsea boots crafted from premium Italian leather. Durable and stylish.", price: 180.00, image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800", category: "Fashion", stock: 85, average_rating: 4.7, review_count: 112 },
  { title: "Women's Oversized Cashmere Sweater", description: "Luxuriously soft oversized cashmere sweater. Perfect for chilly evenings.", price: 220.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", category: "Fashion", stock: 150, average_rating: 4.9, review_count: 64 },
  { title: "Minimalist Unisex Backpack", description: "Clean design meets functionality. Water-resistant material with a padded laptop compartment.", price: 75.00, image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=800", category: "Fashion", stock: 250, average_rating: 4.4, review_count: 190 },
  { title: "Designer Sunglasses Aviator", description: "Classic aviator sunglasses with UV400 protection and polarized lenses. Titanium frame.", price: 159.00, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", category: "Fashion", stock: 200, average_rating: 4.6, review_count: 245 },
  { title: "Luxury Leather Wallet Slim", description: "Handcrafted slim leather wallet with RFID blocking technology. Holds up to 8 cards.", price: 65.00, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800", category: "Fashion", stock: 400, average_rating: 4.8, review_count: 320 },
  { title: "Athletic Running Shoes Ultra", description: "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.", price: 135.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", category: "Fashion", stock: 175, average_rating: 4.7, review_count: 189 },
  { title: "Canvas Tote Bag Premium", description: "Durable organic cotton canvas tote with internal pockets. Perfect for everyday use.", price: 38.00, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800", category: "Fashion", stock: 600, average_rating: 4.3, review_count: 156 },

  // ===== HOME & KITCHEN (8 products) =====
  { title: "Professional Espresso Machine", description: "Brew cafe-quality espresso at home. Features precise temperature control and milk frother.", price: 599.99, image: "https://images.unsplash.com/photo-1534131707746-25d604851a1f?w=800", category: "Home & Kitchen", stock: 40, average_rating: 4.8, review_count: 56 },
  { title: "Ceramic Non-Stick Cookware Set (12pc)", description: "Complete set of eco-friendly ceramic non-stick pots and pans. PFOA-free.", price: 249.99, image: "https://images.unsplash.com/photo-1584990344619-391e9ef74c41?w=800", category: "Home & Kitchen", stock: 100, average_rating: 4.5, review_count: 143 },
  { title: "Smart Air Purifier HEPA", description: "Remove 99.9% of allergens and pollutants from your home with smart monitoring.", price: 199.99, image: "https://images.unsplash.com/photo-1585771724684-2626fc4858d1?w=800", category: "Home & Kitchen", stock: 180, average_rating: 4.6, review_count: 210 },
  { title: "Weighted Sleep Blanket 15lbs", description: "Calm your nervous system and sleep better with our deep pressure weighted blanket.", price: 110.00, image: "https://images.unsplash.com/photo-1580302212146-f6a8e811375d?w=800", category: "Home & Kitchen", stock: 300, average_rating: 4.7, review_count: 320 },
  { title: "Robot Vacuum Cleaner Smart", description: "LiDAR navigation with auto-empty station. Maps your home and cleans every corner automatically.", price: 449.99, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", category: "Home & Kitchen", stock: 60, average_rating: 4.8, review_count: 278 },
  { title: "Japanese Chef Knife Set (5pc)", description: "Hand-forged Damascus steel chef knives with ergonomic walnut handles. Razor-sharp precision.", price: 189.99, image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800", category: "Home & Kitchen", stock: 80, average_rating: 4.9, review_count: 167 },
  { title: "Scented Soy Candle Collection (3pc)", description: "Hand-poured natural soy wax candles. Lavender, Vanilla, and Ocean Breeze scents.", price: 42.00, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800", category: "Home & Kitchen", stock: 350, average_rating: 4.6, review_count: 445 },
  { title: "Cast Iron Dutch Oven 6Qt", description: "Enameled cast iron for even heat distribution. Perfect for stews, bread, and braising.", price: 79.99, image: "https://images.unsplash.com/photo-1585771724684-2626fc4858d1?w=800", category: "Home & Kitchen", stock: 120, average_rating: 4.7, review_count: 203 },

  // ===== GROCERIES (8 products) =====
  { title: "Organic Quinoa 2kg", description: "Premium organic white quinoa. High in protein and gluten-free.", price: 14.99, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800", category: "Groceries", stock: 500, average_rating: 4.9, review_count: 450 },
  { title: "Cold Pressed Extra Virgin Olive Oil 1L", description: "Pure Mediterranean olive oil. Perfect for dressings and cooking.", price: 22.50, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800", category: "Groceries", stock: 200, average_rating: 4.8, review_count: 180 },
  { title: "Artisan Coffee Beans Roast Master", description: "Ethically sourced whole bean coffee. Rich chocolatey and nutty profile.", price: 18.00, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800", category: "Groceries", stock: 150, average_rating: 4.9, review_count: 520 },
  { title: "Manuka Honey MGO 400+", description: "Authentic New Zealand Manuka honey with high antibacterial properties.", price: 45.00, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800", category: "Groceries", stock: 90, average_rating: 5.0, review_count: 95 },
  { title: "Organic Matcha Green Tea Powder", description: "Ceremonial-grade Japanese matcha. Rich in antioxidants and natural energy.", price: 32.00, image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800", category: "Groceries", stock: 180, average_rating: 4.7, review_count: 312 },
  { title: "Mixed Nuts & Trail Mix Premium 1kg", description: "A delicious blend of almonds, cashews, walnuts, dried cranberries, and dark chocolate chips.", price: 24.99, image: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800", category: "Groceries", stock: 300, average_rating: 4.6, review_count: 234 },
  { title: "Aged Balsamic Vinegar of Modena 250ml", description: "Traditional aged balsamic from Modena, Italy. Rich, sweet, and complex flavor.", price: 28.00, image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800", category: "Groceries", stock: 110, average_rating: 4.8, review_count: 143 },
  { title: "Dark Chocolate Collection Box (24pc)", description: "Single-origin artisan dark chocolates from around the world. 70-85% cocoa.", price: 39.99, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800", category: "Groceries", stock: 220, average_rating: 4.9, review_count: 567 },

  // ===== HEALTH & BEAUTY (8 products) =====
  { title: "Advanced Anti-Aging Serum", description: "Dermatologist-tested serum with Vitamin C and Hyaluronic Acid.", price: 55.00, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800", category: "Health & Beauty", stock: 200, average_rating: 4.7, review_count: 312 },
  { title: "Professional Hair Dryer Ionic", description: "Fast-drying ionic technology for smooth, salon-finish hair at home.", price: 89.99, image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800", category: "Health & Beauty", stock: 130, average_rating: 4.6, review_count: 156 },
  { title: "Himalayan Salt Lamp Large", description: "Natural air purifier and beautiful warm ambient light for your home.", price: 35.00, image: "https://images.unsplash.com/photo-1536924430914-72f9390b14f3?w=800", category: "Health & Beauty", stock: 250, average_rating: 4.5, review_count: 420 },
  { title: "Eco-Friendly Bamboo Toothbrush Set (4pc)", description: "Biodegradable charcoal-infused bamboo toothbrushes.", price: 12.00, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800", category: "Health & Beauty", stock: 1000, average_rating: 4.4, review_count: 850 },
  { title: "Aromatherapy Essential Oil Set (8pc)", description: "Pure therapeutic-grade essential oils including Lavender, Eucalyptus, Tea Tree, and Peppermint.", price: 34.99, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800", category: "Health & Beauty", stock: 280, average_rating: 4.8, review_count: 389 },
  { title: "Jade Face Roller & Gua Sha Set", description: "Natural jade stone facial massage tools. Reduces puffiness and promotes blood circulation.", price: 28.00, image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800", category: "Health & Beauty", stock: 400, average_rating: 4.5, review_count: 278 },
  { title: "Organic Coconut Body Butter 300ml", description: "Ultra-hydrating body butter with organic coconut oil, shea butter, and vitamin E.", price: 19.99, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800", category: "Health & Beauty", stock: 350, average_rating: 4.7, review_count: 198 },
  { title: "Yoga Mat Premium Non-Slip 6mm", description: "Eco-friendly TPE yoga mat with alignment lines. Extra thick for joint protection.", price: 45.00, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800", category: "Health & Beauty", stock: 190, average_rating: 4.6, review_count: 267 },
];

// POST /api/seed
router.post('/', async (req, res) => {
  try {
    // Clear products and users (except admins if they exist)
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
    
    // Find or create trader
    let { data: trader } = await supabase.from('users').select('*').eq('role', 'trader').single();
    if (!trader) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Seller@123', salt);
      const { data: newTrader } = await supabase
        .from('users')
        .insert([{ name: 'Demo Seller', email: 'seller@marketplace.com', password: hashedPassword, role: 'trader' }])
        .select()
        .single();
      trader = newTrader;
    }

    const productsWithTrader = products.map((p) => ({ 
      trader_id: trader.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
      average_rating: p.average_rating,
      review_count: p.review_count
    }));

    await supabase.from('products').insert(productsWithTrader);

    res.json({ message: `✅ Seeded ${products.length} products!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.products = products;


