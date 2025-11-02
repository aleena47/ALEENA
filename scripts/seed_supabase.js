#!/usr/bin/env node
/*
  Safe Supabase seeder script.
  - Uses SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY from .env
  - Upserts brands and products into `brands` and `products` tables if they exist
  - Detects common errors (missing tables, auth) and prints next steps

  Run: node scripts/seed_supabase.js
*/
require('dotenv').config();
// Polyfill fetch in case Node < 18 — do this before creating the Supabase client
if (typeof fetch === 'undefined') {
  try {
    globalThis.fetch = require('node-fetch');
    console.log('🔁 Polyfilled global fetch in seeder with node-fetch');
  } catch (e) {
    console.warn('⚠️ node-fetch not installed. If you see "fetch failed" errors, run: npm install node-fetch@2');
  }
}
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const brands = [
  { id: 'adiddda', name: 'Adiddda' },
  { id: 'shein', name: 'Shein' },
  { id: 'zara', name: 'Zara' }
];

const products = [
  { id: 'a1', brand: 'adiddda', title: 'Adiddda Sport Tee', price: 29.99, image: '/images/adiddda-tee.svg', description: 'Sport tee', sizes: ['S','M','L'], colors: ['Black','White'], style: 'Sport' },
  { id: 'a2', brand: 'adiddda', title: 'Adiddda Running Shorts', price: 34.99, image: '/images/adiddda-shorts.svg', description: 'Running shorts', sizes: ['M','L'], colors: ['Blue'], style: 'Sport' },
  { id: 's1', brand: 'shein', title: 'Shein Floral Dress', price: 24.99, image: '/images/shein-dress.svg', description: 'Floral dress', sizes: ['S','M'], colors: ['Floral'], style: 'Casual' },
  { id: 's2', brand: 'shein', title: 'Shein Casual Top', price: 14.99, image: '/images/shein-top.svg', description: 'Casual top', sizes: ['S','M','L'], colors: ['White'], style: 'Casual' },
  { id: 'z1', brand: 'zara', title: 'Zara Leather Jacket', price: 119.99, image: '/images/zara-jacket.svg', description: 'Leather jacket', sizes: ['M','L'], colors: ['Black'], style: 'Edgy' },
  { id: 'z2', brand: 'zara', title: 'Zara Slim Jeans', price: 49.99, image: '/images/zara-jeans.svg', description: 'Slim jeans', sizes: ['30','32'], colors: ['Blue'], style: 'Casual' }
];

async function tableExists(tableName) {
  try {
    const result = await supabase.from(tableName).select('1').limit(1);
    // supabase returns { data, error }
    if (result.error) return { ok: false, error: result.error };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
}

async function upsertBrands() {
  console.log('Upserting brands...');
  const { data, error } = await supabase.from('brands').upsert(brands, { onConflict: 'id' }).select();
  if (error) throw error;
  console.log('Brands upserted:', data.length || data);
}

async function upsertProducts() {
  console.log('Upserting products...');
  // Ensure sizes/colors are JSON (Supabase JSONB)
  const prepared = products.map(p => ({ ...p, sizes: p.sizes, colors: p.colors }));
  const { data, error } = await supabase.from('products').upsert(prepared, { onConflict: 'id' }).select();
  if (error) throw error;
  console.log('Products upserted:', data.length || data);
}

async function run() {
  console.log('Checking tables...');
  const brandsCheck = await tableExists('brands');
  const productsCheck = await tableExists('products');

  if (!brandsCheck.ok || !productsCheck.ok) {
    console.error('One or more tables are not accessible. Details:');
    if (!brandsCheck.ok) console.error('brands table error:', brandsCheck.error && brandsCheck.error.message ? brandsCheck.error.message : brandsCheck.error);
    if (!productsCheck.ok) console.error('products table error:', productsCheck.error && productsCheck.error.message ? productsCheck.error.message : productsCheck.error);
    console.error('\nPossible causes:\n - Tables not created in Supabase (run supabase/schema.sql)\n - Wrong Supabase project or credentials\n - RLS/policies blocking inserts with anon key (use service role key)\n - Network/TLS/proxy issues from this machine to Supabase\n');
    // If the error was a TypeError: fetch failed, provide targeted guidance
    const errMsg = (brandsCheck.error && brandsCheck.error.message) || (productsCheck.error && productsCheck.error.message) || '';
    if (errMsg.toLowerCase().includes('fetch failed') || errMsg.toLowerCase().includes('network')) {
      console.error('\nHint: "fetch failed" usually means Node does not have a global fetch (Node < 18) or network/TLS/proxy is blocking requests.');
      console.error(' - If Node < 18, run: npm install node-fetch@2 and retry.');
      console.error(' - If behind a corporate proxy or VPN, ensure network allows outgoing HTTPS to your Supabase URL.');
    }
    process.exit(1);
  }

  try {
    await upsertBrands();
    await upsertProducts();
    console.log('\nSeeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    if (err.message && err.message.toLowerCase().includes('permission')) {
      console.error('Permission error: ensure you are using SUPABASE_SERVICE_ROLE_KEY for server-side seeding.');
    }
    process.exit(1);
  }
}

run();
