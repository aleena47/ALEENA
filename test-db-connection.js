// Quick script to test Supabase database connection
require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('🔍 Testing Supabase database connection...\n');
  console.log('Using credentials from config/supabase.js\n');

  // Test connection
  try {
    console.log('Testing products table...');
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('  1. Tables not created - Run supabase/schema.sql in Supabase SQL Editor');
      console.log('  2. Wrong credentials - Check SUPABASE_URL and SUPABASE_ANON_KEY');
      console.log('  3. Project paused - Check your Supabase project status');
      return;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log(`📦 Products in database: ${count || 0}`);

    // Check if we need to seed data
    if (count === 0) {
      console.log('\n⚠️  Database is empty. Run supabase/seed.sql to add products.');
    }

    // Test other tables
    console.log('\nTesting other tables...');
    
    const { error: cartError } = await supabase.from('cart_items').select('count').limit(1);
    if (cartError) {
      console.log('⚠️  cart_items table not found or has issues');
    } else {
      console.log('✅ cart_items table exists');
    }

    const { error: ordersError } = await supabase.from('orders').select('count').limit(1);
    if (ordersError) {
      console.log('⚠️  orders table not found or has issues');
    } else {
      console.log('✅ orders table exists');
    }

    console.log('\n✅ Database connection test complete!');

  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('  1. Check your internet connection');
    console.log('  2. Verify Supabase project is active');
    console.log('  3. Check API credentials are correct');
  }
}

testConnection();

