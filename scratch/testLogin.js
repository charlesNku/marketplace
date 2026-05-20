require('dotenv').config({ path: './backend/.env' });
const supabase = require('../backend/config/supabaseClient');
const bcrypt = require('bcryptjs');

const test = async () => {
  const email = 'admin@marketplace.com';
  const password = 'Admin@123';
  
  console.log('Testing login for', email);
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  console.log('User found:', user ? 'Yes' : 'No');
  if (error) console.log('Supabase Error:', error);
  
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
  }
};

test();
