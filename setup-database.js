// Script to set up Supabase database with tables and seed data
const supabase = require('./config/supabase');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  try {
    // Read schema SQL
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    const seedPath = path.join(__dirname, 'supabase', 'seed.sql');

    if (!fs.existsSync(schemaPath)) {
      console.error('❌ schema.sql not found at:', schemaPath);
      return;
    }

    if (!fs.existsSync(seedPath)) {
      console.error('❌ seed.sql not found at:', seedPath);
      return;
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('📋 Instructions:');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project: ilhljwosmgdluwusawbc');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the SQL below:\n');
    console.log('='.repeat(60));
    console.log('SCHEMA (Run this first):');
    console.log('='.repeat(60));
    console.log(schemaSQL);
    console.log('\n' + '='.repeat(60));
    console.log('SEED DATA (Run this after schema):');
    console.log('='.repeat(60));
    console.log(seedSQL);
    console.log('\n' + '='.repeat(60));

    // Test connection
    console.log('\n🔍 Testing connection...');
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\n⚠️  Tables not created yet.');
        console.log('Please run the schema.sql in Supabase SQL Editor first.');
      } else {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.log(`✅ Connection successful!`);
      console.log(`📦 Current products in database: ${count || 0}`);
      
      if (count === 0) {
        console.log('\n💡 Database is empty. Run seed.sql to add products.');
      } else {
        console.log('\n✅ Database already has products!');
      }
    }

  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

setupDatabase();


