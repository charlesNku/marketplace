const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');

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

  // ===== AUTOMOTIVE (3 products) =====
  { title: "Cordless Car Vacuum Cleaner", description: "Powerful 12V handheld car vacuum with HEPA filter. Clean your vehicle anywhere, anytime.", price: 59.99, image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800", category: "Automotive", stock: 150, average_rating: 4.5, review_count: 178 },
  { title: "Dash Cam 4K Ultra HD", description: "Front and rear dual dash camera with night vision and parking monitoring. WiFi enabled.", price: 129.99, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0abb?w=800", category: "Automotive", stock: 90, average_rating: 4.7, review_count: 234 },
  { title: "Portable Jump Starter Power Bank", description: "2000A peak current car jump starter with USB-C fast charging and LED flashlight.", price: 89.99, image: "https://images.unsplash.com/photo-1611262588024-d780546370d8?w=800", category: "Automotive", stock: 120, average_rating: 4.6, review_count: 145 },

  // ===== BOOKS & MEDIA (3 products) =====
  { title: "Wireless Book Light LED Rechargeable", description: "Clip-on LED reading light with 3 color temperatures and adjustable brightness. USB-C rechargeable.", price: 18.99, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800", category: "Books & Media", stock: 300, average_rating: 4.4, review_count: 267 },
  { title: "Bluetooth Vinyl Record Player", description: "Retro-style turntable with built-in speakers and Bluetooth connectivity. Plays 33/45/78 RPM.", price: 149.99, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", category: "Books & Media", stock: 60, average_rating: 4.7, review_count: 189 },
  { title: "Kindle Paperwhite E-Reader Cover", description: "Premium PU leather case with auto sleep/wake function for Kindle Paperwhite. Multiple colors.", price: 24.99, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800", category: "Books & Media", stock: 200, average_rating: 4.5, review_count: 312 },

  // ===== SPORTS (3 products) =====
  { title: "Adjustable Dumbbell Set 25kg", description: "Space-saving adjustable dumbbells with quick-lock mechanism. Replaces 15 sets of weights.", price: 299.99, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800", category: "Sports", stock: 50, average_rating: 4.8, review_count: 156 },
  { title: "Insulated Sports Water Bottle 1L", description: "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24hrs or hot for 12hrs.", price: 29.99, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800", category: "Sports", stock: 400, average_rating: 4.6, review_count: 523 },
  { title: "Resistance Bands Set (5 Pack)", description: "Premium latex resistance bands with door anchor and carrying bag. 5 tension levels.", price: 22.99, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800", category: "Sports", stock: 350, average_rating: 4.5, review_count: 389 },

  // ===== TOYS & GAMES (3 products) =====
  { title: "STEM Robot Building Kit", description: "1000+ piece programmable robot kit. Learn coding, engineering, and problem solving.", price: 79.99, image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800", category: "Toys & Games", stock: 80, average_rating: 4.8, review_count: 234 },
  { title: "Magnetic Tiles Building Set (120pc)", description: "Colorful magnetic building tiles for creative 3D construction. Compatible with major brands.", price: 49.99, image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800", category: "Toys & Games", stock: 150, average_rating: 4.7, review_count: 456 },
  { title: "Strategy Board Game Collection", description: "Award-winning family board game. Includes strategy cards, game board, and tokens for 2-6 players.", price: 39.99, image: "https://images.unsplash.com/photo-1611891488057-8b0e20113148?w=800", category: "Toys & Games", stock: 120, average_rating: 4.6, review_count: 198 },

  // ===== COMPUTERS & IT (3 products) =====
  { title: "27\" 4K IPS Monitor USB-C", description: "Professional 27-inch 4K UHD monitor with USB-C hub, 99% sRGB, and adjustable stand.", price: 449.99, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800", category: "Computers & IT", stock: 40, average_rating: 4.8, review_count: 167 },
  { title: "Ergonomic Wireless Mouse Silent", description: "Whisper-quiet clicks with ergonomic vertical design. 2.4GHz wireless with 3 DPI levels.", price: 34.99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", category: "Computers & IT", stock: 250, average_rating: 4.5, review_count: 345 },
  { title: "USB-C Docking Station 12-in-1", description: "Expand your laptop with dual HDMI, Ethernet, SD card, and 100W PD charging. Triple display support.", price: 89.99, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800", category: "Computers & IT", stock: 100, average_rating: 4.6, review_count: 210 },

  // ===== ART & CRAFTS (3 products) =====
  { title: "Professional Acrylic Paint Set (48 Colors)", description: "Rich pigmented acrylic paints in 48 vibrant colors. Non-toxic, quick-drying formula for canvas and more.", price: 44.99, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800", category: "Art & Crafts", stock: 100, average_rating: 4.7, review_count: 198 },
  { title: "Calligraphy Pen Set with Practice Book", description: "Complete calligraphy starter kit with 5 nibs, ink bottle, and 40-page practice workbook.", price: 28.99, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800", category: "Art & Crafts", stock: 180, average_rating: 4.5, review_count: 156 },
  { title: "Sketching Pencils Set (33 Pieces)", description: "Professional drawing pencils, charcoal sticks, erasers, and blending tools in a zippered case.", price: 19.99, image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800", category: "Art & Crafts", stock: 250, average_rating: 4.6, review_count: 278 },

  // ===== JEWELRY (3 products) =====
  { title: "Sterling Silver Pendant Necklace", description: "Handcrafted 925 sterling silver pendant with cubic zirconia stones. Hypoallergenic chain.", price: 79.99, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", category: "Jewelry", stock: 120, average_rating: 4.7, review_count: 189 },
  { title: "Men's Stainless Steel Bracelet", description: "Heavy-duty stainless steel link bracelet with magnetic clasp. Scratch-resistant polished finish.", price: 45.00, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", category: "Jewelry", stock: 200, average_rating: 4.5, review_count: 134 },
  { title: "Pearl Drop Earrings 925 Silver", description: "Elegant freshwater pearl drop earrings set in sterling silver. Perfect for any occasion.", price: 55.00, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800", category: "Jewelry", stock: 150, average_rating: 4.8, review_count: 245 },

  // ===== MUSIC (3 products) =====
  { title: "Digital Piano 88-Key Weighted", description: "Full-size digital piano with hammer-action weighted keys. 128 voices, built-in speakers, and MIDI.", price: 599.99, image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800", category: "Music", stock: 25, average_rating: 4.9, review_count: 89 },
  { title: "Acoustic Guitar Starter Pack", description: "Solid spruce top acoustic guitar with tuner, picks, strap, and padded gig bag. Full-size 41 inch.", price: 149.99, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800", category: "Music", stock: 60, average_rating: 4.6, review_count: 234 },
  { title: "Condenser Microphone Studio Kit", description: "Professional XLR condenser microphone with pop filter, shock mount, and boom arm. USB-C compatible.", price: 89.99, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800", category: "Music", stock: 100, average_rating: 4.7, review_count: 167 },

  // ===== BABY PRODUCTS (3 products) =====
  { title: "Baby Stroller Lightweight Foldable", description: "Ultra-compact foldable stroller with canopy, storage basket, and 5-point safety harness.", price: 199.99, image: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=800", category: "Baby Products", stock: 40, average_rating: 4.8, review_count: 123 },
  { title: "Organic Baby Onesie Set (5 Pack)", description: "100% organic cotton onesies. Soft, breathable, and machine washable. BPA and formaldehyde free.", price: 34.99, image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800", category: "Baby Products", stock: 300, average_rating: 4.7, review_count: 345 },
  { title: "Baby Monitor WiFi HD Camera", description: "1080p HD baby monitor with night vision, two-way audio, lullabies, and temperature sensor.", price: 89.99, image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800", category: "Baby Products", stock: 80, average_rating: 4.6, review_count: 198 },

  // ===== OUTDOORS (3 products) =====
  { title: "Camping Tent 4-Person Waterproof", description: "Easy-setup dome tent with rainfly and mesh windows. Fits 4 adults comfortably. UV-resistant.", price: 129.99, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800", category: "Outdoors", stock: 50, average_rating: 4.7, review_count: 167 },
  { title: "Solar Powered Camping Lantern", description: "Rechargeable LED lantern with solar panel and USB charging. Collapsible design, 800 lumens.", price: 24.99, image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800", category: "Outdoors", stock: 200, average_rating: 4.5, review_count: 234 },
  { title: "Hiking Backpack 45L Waterproof", description: "Ergonomic hiking backpack with rain cover, multiple compartments, and adjustable chest strap.", price: 79.99, image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=800", category: "Outdoors", stock: 120, average_rating: 4.6, review_count: 189 },

  // ===== OFFICE (3 products) =====
  { title: "Ergonomic Standing Desk Converter", description: "Height-adjustable sit-stand desk riser with keyboard tray. Fits dual monitors up to 27 inch.", price: 199.99, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800", category: "Office", stock: 45, average_rating: 4.7, review_count: 145 },
  { title: "Wireless Ergonomic Keyboard & Mouse", description: "Split ergonomic wireless keyboard with matching mouse. Reduces wrist strain during long work sessions.", price: 59.99, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800", category: "Office", stock: 180, average_rating: 4.5, review_count: 234 },
  { title: "LED Desk Lamp Eye-Care Dimmable", description: "Touch-control LED desk lamp with 5 brightness levels, 3 color modes, and USB charging port.", price: 39.99, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", category: "Office", stock: 200, average_rating: 4.6, review_count: 312 },

  // ===== HARDWARE (3 products) =====
  { title: "Cordless Drill Set 20V", description: "Professional cordless drill with 2 batteries, 50 accessories, and carrying case. 2-speed gearbox.", price: 89.99, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800", category: "Hardware", stock: 75, average_rating: 4.8, review_count: 267 },
  { title: "Digital Laser Measure 50m", description: "High-precision laser distance meter with backlit display. Measures up to 50 meters. Memory function.", price: 34.99, image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800", category: "Hardware", stock: 150, average_rating: 4.6, review_count: 145 },
  { title: "Precision Screwdriver Set (60pc)", description: "Mini magnetic screwdriver set for electronics repair. Includes Torx, Phillips, and flathead bits.", price: 19.99, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800", category: "Hardware", stock: 300, average_rating: 4.5, review_count: 198 },

  // ===== FURNITURE (3 products) =====
  { title: "Ergonomic Office Chair Mesh", description: "Adjustable mesh office chair with lumbar support, headrest, and flip-up armrests. BIFMA certified.", price: 249.99, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800", category: "Furniture", stock: 30, average_rating: 4.8, review_count: 189 },
  { title: "Floating Wall Shelf Set (3pc)", description: "Rustic wood floating shelves with invisible mounting hardware. Holds up to 20kg each.", price: 39.99, image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800", category: "Furniture", stock: 120, average_rating: 4.6, review_count: 234 },
  { title: "Modular Storage Cube Organizer", description: "Customizable 9-cube storage organizer for books, toys, and decor. Easy assembly, sturdy MDF.", price: 129.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", category: "Furniture", stock: 50, average_rating: 4.7, review_count: 156 },

  // ===== TRAVEL (3 products) =====
  { title: "Hard Shell Carry-On Luggage 20\"", description: "Lightweight polycarbonate carry-on with TSA lock, 360-degree spinner wheels, and USB port.", price: 129.99, image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800", category: "Travel", stock: 60, average_rating: 4.7, review_count: 210 },
  { title: "Packing Cubes Set (6pc)", description: "Durable nylon packing cubes with compression zippers. Keeps luggage organized and saves space.", price: 24.99, image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800", category: "Travel", stock: 250, average_rating: 4.6, review_count: 345 },
  { title: "Universal Travel Adapter GaN", description: "Compact GaN travel adapter with 4 USB ports and 1 AC outlet. Works in 150+ countries.", price: 34.99, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800", category: "Travel", stock: 180, average_rating: 4.5, review_count: 198 },

  // ===== PHOTOGRAPHY (3 products) =====
  { title: "Mirrorless Camera Kit 24MP", description: "Compact mirrorless camera with 18-55mm kit lens, 4K video, and WiFi. Perfect for content creators.", price: 699.99, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800", category: "Photography", stock: 30, average_rating: 4.9, review_count: 112 },
  { title: "Tripod Carbon Fiber 170cm", description: "Lightweight carbon fiber tripod with ball head. Supports up to 10kg. Folds to 45cm for travel.", price: 89.99, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800", category: "Photography", stock: 80, average_rating: 4.7, review_count: 156 },
  { title: "LED Ring Light 18\" with Stand", description: "Professional 18-inch ring light with adjustable tripod stand and phone holder. 3 color modes.", price: 59.99, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800", category: "Photography", stock: 120, average_rating: 4.6, review_count: 234 },

  // ===== PET SUPPLIES (3 products) =====
  { title: "Automatic Pet Feeder WiFi", description: "Programmable pet feeder with app control, portion control, and voice recorder. 5L capacity.", price: 69.99, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800", category: "Pet Supplies", stock: 80, average_rating: 4.6, review_count: 178 },
  { title: "Orthopaedic Pet Bed Memory Foam", description: "High-density memory foam pet bed with washable cover. Ideal for medium to large dogs.", price: 49.99, image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800", category: "Pet Supplies", stock: 100, average_rating: 4.7, review_count: 234 },
  { title: "Retractable Dog Leash 5m", description: "Heavy-duty retractable leash for dogs up to 50kg. One-button brake and lock system.", price: 19.99, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800", category: "Pet Supplies", stock: 250, average_rating: 4.5, review_count: 345 },

  // ===== INDUSTRIAL (3 products) =====
  { title: "Digital Multimeter Auto-Ranging", description: "Professional auto-ranging multimeter with LCD display. Measures voltage, current, resistance, and temperature.", price: 39.99, image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800", category: "Industrial", stock: 100, average_rating: 4.7, review_count: 145 },
  { title: "Welding Helmet Auto-Darkening", description: "Solar-powered auto-darkening welding helmet with 4 sensors. Adjustable shade from DIN 9 to DIN 13.", price: 69.99, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800", category: "Industrial", stock: 60, average_rating: 4.6, review_count: 98 },
  { title: "Safety Work Gloves Cut-Resistant", description: "ANSI A4 cut-resistant work gloves with anti-slip grip. Breathable and touchscreen compatible.", price: 14.99, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", category: "Industrial", stock: 500, average_rating: 4.5, review_count: 267 },

  // ===== WATCHES (3 products) =====
  { title: "Classic Automatic Mechanical Watch", description: "Self-winding mechanical watch with sapphire crystal glass and genuine leather strap. 100m water resistant.", price: 199.99, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", category: "Watches", stock: 40, average_rating: 4.8, review_count: 167 },
  { title: "Sport Smartwatch GPS Tracker", description: "Feature-rich sports smartwatch with GPS, heart rate monitor, SpO2, and 7-day battery life.", price: 149.99, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800", category: "Watches", stock: 80, average_rating: 4.7, review_count: 234 },
  { title: "Minimalist Quartz Watch Unisex", description: "Sleek minimalist dial watch with mesh stainless steel band. Japanese movement, scratch-resistant glass.", price: 79.99, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800", category: "Watches", stock: 120, average_rating: 4.6, review_count: 189 },

  // ===== SALON & SPA (3 products) =====
  { title: "Professional Hair Clipper Set", description: "Cordless hair clipper with 8 guide combs, precision trimmer, and leather carrying case. 180min runtime.", price: 59.99, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800", category: "Salon & Spa", stock: 100, average_rating: 4.7, review_count: 234 },
  { title: "LED Face Mask Therapy 7 Colors", description: "Professional 7-color LED face mask for anti-aging, acne treatment, and skin rejuvenation. Rechargeable.", price: 49.99, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800", category: "Salon & Spa", stock: 80, average_rating: 4.5, review_count: 156 },
  { title: "Hot Stone Massage Set (9pc)", description: "Natural basalt hot stone massage set with heating bag. Perfect for spa treatments and relaxation.", price: 34.99, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800", category: "Salon & Spa", stock: 150, average_rating: 4.6, review_count: 178 },

  // ===== COMPONENTS (3 products) =====
  { title: "RGB Gaming Mouse Pad XXL", description: "Extended desk mat with 16.8 million RGB colors. Anti-slip rubber base, soft cloth surface.", price: 29.99, image: "https://images.unsplash.com/photo-1616353071855-2c26c4835c03?w=800", category: "Components", stock: 200, average_rating: 4.6, review_count: 345 },
  { title: "M.2 NVMe SSD 1TB", description: "High-speed NVMe M.2 SSD with 3500MB/s read speed. 3D TLC NAND flash. 5-year warranty.", price: 89.99, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800", category: "Components", stock: 100, average_rating: 4.8, review_count: 267 },
  { title: "750W Modular Power Supply 80+ Gold", description: "Fully modular ATX power supply with 80 Plus Gold efficiency. Silent 135mm fan, flat cables.", price: 99.99, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800", category: "Components", stock: 50, average_rating: 4.7, review_count: 145 },

  // ===== GIFTS (3 products) =====
  { title: "Personalized Leather Journal", description: "Handmade genuine leather journal with customizable embossed cover. 200 lined pages.", price: 34.99, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800", category: "Gifts", stock: 150, average_rating: 4.7, review_count: 189 },
  { title: "Gourmet Gift Basket Deluxe", description: "Curated gift basket with premium chocolates, teas, artisan crackers, and imported preserves.", price: 59.99, image: "https://images.unsplash.com/photo-1549465220-8b80323bd16e?w=800", category: "Gifts", stock: 80, average_rating: 4.6, review_count: 145 },
  { title: "Engraved Wooden Keepsake Box", description: "Handcrafted solid walnut keepsake box with brass hinges. Custom engraving available on lid.", price: 44.99, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800", category: "Gifts", stock: 100, average_rating: 4.8, review_count: 123 },

  // ===== CAFE & TEA (3 products) =====
  { title: "Pour-Over Coffee Dripper Glass", description: "Borosilicate glass pour-over coffee dripper with stainless steel mesh filter. Brews 1-4 cups.", price: 24.99, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", category: "Cafe & Tea", stock: 200, average_rating: 4.6, review_count: 234 },
  { title: "Electric Milk Frother Handheld", description: "Battery-operated milk frother for lattes, cappuccinos, and hot chocolate. Stainless steel whisk.", price: 12.99, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800", category: "Cafe & Tea", stock: 400, average_rating: 4.5, review_count: 456 },
  { title: "Ceramic Tea Set with Infuser (6pc)", description: "Handcrafted ceramic teapot with 4 cups and built-in infuser. Japanese-inspired minimalist design.", price: 39.99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800", category: "Cafe & Tea", stock: 120, average_rating: 4.7, review_count: 167 },

  // ===== PHARMACY (3 products) =====
  { title: "Digital Blood Pressure Monitor", description: "Automatic upper arm blood pressure monitor with irregular heartbeat detection. Stores 120 readings.", price: 39.99, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800", category: "Pharmacy", stock: 100, average_rating: 4.7, review_count: 189 },
  { title: "Pulse Oximeter Fingertip", description: "Medical-grade fingertip pulse oximeter with OLED display. Measures SpO2 and pulse rate.", price: 24.99, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800", category: "Pharmacy", stock: 200, average_rating: 4.6, review_count: 234 },
  { title: "First Aid Kit 200-Piece", description: "Comprehensive first aid kit with bandages, antiseptics, tweezers, and emergency guide. Portable case.", price: 29.99, image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800", category: "Pharmacy", stock: 150, average_rating: 4.5, review_count: 178 },
];

// POST /api/seed
router.post('/', async (req, res) => {
  try {
    // Clear products and users (except admins if they exist)
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
    
    // Find or create admin
    let { data: admins, error: adminQueryError } = await supabase.from('users').select('*').eq('email', 'admin@marketplace.com');
    if (adminQueryError) {
      console.error("Admin query error:", adminQueryError);
    }
    let adminUser = admins && admins.length > 0 ? admins[0] : null;
    if (!adminUser) {
      const adminSalt = await bcrypt.genSalt(10);
      const adminHashedPassword = await bcrypt.hash('Admin@123', adminSalt);
      const adminId = require('crypto').randomUUID();
      const { error: adminInsertError } = await supabase
        .from('users')
        .insert([{ id: adminId, name: 'System Admin', email: 'admin@marketplace.com', password: adminHashedPassword, role: 'admin' }]);
      if (adminInsertError) {
        throw new Error("Admin insert failed: " + adminInsertError.message);
      }
    }

    // Find or create trader by email (since email is unique)
    let { data: traders, error: traderQueryError } = await supabase.from('users').select('*').eq('email', 'seller@marketplace.com');
    if (traderQueryError) {
      console.error("Trader query error:", traderQueryError);
    }
    let trader = traders && traders.length > 0 ? traders[0] : null;
    if (!trader) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Seller@123', salt);
      const traderId = require('crypto').randomUUID();
      const { data: newTraders, error: insertError } = await supabase
        .from('users')
        .insert([{ id: traderId, name: 'Demo Seller', email: 'seller@marketplace.com', password: hashedPassword, role: 'trader' }])
        .select();
      if (insertError) {
        throw new Error("Trader insert failed: " + insertError.message);
      }
      trader = newTraders && newTraders.length > 0 ? newTraders[0] : null;
    }

    if (!trader) {
      throw new Error("Failed to resolve trader account after insert.");
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

    res.json({ message: `✅ Seeded ${products.length} products and created default admin & seller credentials!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.products = products;


