const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://cjobmtwtssmdcvpyxruv.supabase.co';

// Service role key bypasses RLS (for trusted backend use).
// Anon key respects RLS (for client-side use only).
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqb2JtdHd0c3NtZGN2cHl4cnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTg1MTMsImV4cCI6MjA5NDU5NDUxM30.ep5HCh3K-QEiyaLmDCWjEqEvnKn9iDkcHBx6RDxCyvY';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

module.exports = supabase;

