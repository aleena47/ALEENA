const { createClient } = require('@supabase/supabase-js');
// dotenv already loaded by server.js, but re-run safely if this file is required directly
try { require('dotenv').config(); } catch (e) {}

// Polyfill fetch for Node versions < 18 using node-fetch v2 (CommonJS)
if (typeof fetch === 'undefined') {
  try {
    // node-fetch v2 exports as module.exports
    globalThis.fetch = require('node-fetch');
    console.log('🔁 Polyfilled global fetch with node-fetch');
  } catch (e) {
    // If node-fetch not installed, client may still error later; warn the user
    console.warn('⚠️ node-fetch not available; if you run into "fetch failed" errors, run `npm install node-fetch@2`');
  }
}

// Prefer service role key on server when available, otherwise anon key
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️ Supabase credentials are missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in your .env');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

module.exports = supabase;

