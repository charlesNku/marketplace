require('dotenv').config({ path: './backend/.env' });
const supabase = require('./config/supabaseClient');
const bcrypt = require('bcrypt');
const { products } = require('./routes/seedRoutes.js');

const seedDb = async () => {
  try {
    console.log('Clearing existing products...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
    
    console.log('Finding or creating trader account...');
    let { data: trader } = await supabase.from('users').select('*').eq('role', 'trader').single();
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
        // Fallback to a hardcoded admin/trader ID if you know one, or throw
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

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDb();
