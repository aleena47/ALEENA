#!/usr/bin/env node
/**
 * Complete database setup script
 * Creates all tables and seeds initial data
 */
require('dotenv').config();

// Polyfill fetch for Node < 18
if (typeof fetch === 'undefined') {
  try {
    globalThis.fetch = require('node-fetch');
    console.log('🔁 Polyfilled fetch with node-fetch');
  } catch (e) {
    console.warn('⚠️ node-fetch not available');
  }
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Sample products data
const products = [
  {
    name: "Classic White T-Shirt",
    category: "Tops",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Premium cotton t-shirt with comfortable fit",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    style: "Casual"
  },
  {
    name: "Slim Fit Denim Jeans",
    category: "Bottoms",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    description: "Classic denim jeans with modern slim fit",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    style: "Casual"
  },
  {
    name: "Leather Jacket",
    category: "Outerwear",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    description: "Genuine leather jacket with classic design",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    style: "Edgy"
  },
  {
    name: "Summer Dress",
    category: "Dresses",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    description: "Light and airy summer dress perfect for warm weather",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Blue", "Pink"],
    style: "Feminine"
  },
  {
    name: "Running Shoes",
    category: "Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    description: "Comfortable running shoes with excellent support",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Red"],
    style: "Sporty"
  },
  {
    name: "Formal Blazer",
    category: "Outerwear",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1594938291221-94f313ab01a6?w=500",
    description: "Elegant blazer for professional occasions",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black", "Gray"],
    style: "Professional"
  },
  {
    name: "Yoga Pants",
    category: "Bottoms",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500",
    description: "Comfortable and flexible yoga pants",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    style: "Athletic"
  },
  {
    name: "Silk Scarf",
    category: "Accessories",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500",
    description: "Luxurious silk scarf with elegant patterns",
    sizes: ["One Size"],
    colors: ["Multicolor", "Blue", "Red"],
    style: "Elegant"
  }
];

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (testError) {
      if (testError.message.includes('does not exist') || testError.message.includes('schema cache')) {
        console.log('⚠️  Tables do not exist. They need to be created via Supabase SQL Editor.');
        console.log('\n📋 INSTRUCTIONS:');
        console.log('1. Go to: https://app.supabase.com');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Create a new query');
        console.log('5. Copy and paste the contents of: FCP/supabase/schema.sql');
        console.log('6. Click "Run" to create all tables');
        console.log('7. Run this script again to seed data\n');
        process.exit(1);
      }
      throw testError;
    }

    console.log('✅ Connected to Supabase\n');

    // Insert products
    console.log('2️⃣ Inserting products...');
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      console.error('❌ Error inserting products:', error.message);
      throw error;
    }

    console.log(`✅ Successfully inserted ${data.length} products\n`);

    // Verify
    console.log('3️⃣ Verifying data...');
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Total products in database: ${count}\n`);
    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
