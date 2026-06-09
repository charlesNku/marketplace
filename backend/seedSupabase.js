require('dotenv').config({ path: './backend/.env' });
const supabase = require('./config/supabaseClient');
const bcrypt = require('bcryptjs');
const { products } = require('./routes/seedRoutes.js');

const seedDb = async () => {
  try {
    console.log('Clearing existing products...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Finding or creating trader account...');
    let { data: existingUsers } = await supabase.from('users').select('*').eq('email', 'seller@marketplace.com');
    let trader = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
    if (!trader) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Seller@123', salt);
      const newId = require('crypto').randomUUID();
      const { data: newTrader, error: userError } = await supabase
        .from('users')
        .insert([{ id: newId, name: 'Demo Seller', email: 'seller@marketplace.com', password: hashedPassword, role: 'trader' }])
        .select()
        .single();
      if (userError) {
        console.error("Failed to create trader:", userError);
        throw new Error("Could not create trader account");
      }
      trader = newTrader;
    }

    console.log('Formatting products...');
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

    console.log(`Inserting ${productsWithTrader.length} products...`);
    const { error } = await supabase.from('products').insert(productsWithTrader);

    if (error) throw error;

    console.log('Seeding a test conversation...');
    const { data: buyers } = await supabase.from('users').select('*').eq('email', 'buyer1780496851683@test.com').limit(1);
    const buyer = buyers && buyers.length > 0 ? buyers[0] : null;

    if (buyer && trader) {
      console.log(`Found buyer: ${buyer.email}. Creating conversation...`);
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert([{
          user1_id: buyer.id,
          user2_id: trader.id,
          product_id: productsWithTrader[0]?.id || null
        }])
        .select()
        .single();

      if (convErr) console.error("Conv error:", convErr);

      if (conv) {
        console.log('Seeding a test message...');
        const { error: msgErr } = await supabase.from('messages').insert([{
          conversation_id: conv.id,
          sender_id: buyer.id,
          receiver_id: trader.id,
          message: "Hello! Is this still available?"
        }]);
        if (msgErr) console.error("Msg error:", msgErr);
      }
    } else {
      console.warn("Could not find buyer to seed conversation.");
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDb();
