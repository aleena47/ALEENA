# Database Setup Guide

## Current Status: ❌ Tables NOT Created

Your Supabase database is connected, but the tables have not been created yet.

## Why Tables Are Not Created

Supabase requires SQL DDL (Data Definition Language) statements to be executed through their SQL Editor for security reasons. This cannot be done programmatically via the API.

## 🚀 Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://app.supabase.com**
2. Sign in to your account
3. Select your project: **ilhljwosmgdluwusawbc**
4. Click **"SQL Editor"** in the left sidebar
5. Click **"New Query"** button

### Step 2: Create Tables

1. Open the file: `FCP/supabase/schema.sql` in your code editor
2. Copy the **entire contents** (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned"**

### Step 3: Seed Products Data

After tables are created, run this command in your terminal:

```bash
npm run seed:products
```

This will insert 8 sample products into your database.

## 📋 What Tables Will Be Created

1. **products** - Product catalog (name, price, images, sizes, colors, etc.)
2. **users** - User accounts with authentication
3. **cart_items** - Shopping cart items
4. **orders** - Order records
5. **order_items** - Items within orders

Plus indexes and Row Level Security policies for data protection.

## ✅ Verify Setup

After running the SQL, check if tables exist:

```bash
npm run check:db
```

Or visit your app and check the health endpoint:
- http://localhost:5000/api/health

You should see `"productCount": 8` after seeding.

## 🔧 Alternative: Manual Product Insertion

If you prefer to insert products manually via SQL Editor:

1. After creating tables with `schema.sql`
2. Open `FCP/supabase/seed.sql`
3. Copy and paste into SQL Editor
4. Run the query

## 🆘 Troubleshooting

### "Could not find the table 'public.products'"
- Tables haven't been created yet
- Follow Step 1 & 2 above

### "Permission denied"
- Make sure you're using SUPABASE_SERVICE_ROLE_KEY in .env
- Check that RLS policies are created (they're in schema.sql)

### "Relation already exists"
- Tables are already created! 
- Just run: `npm run seed:products`

## 📊 Current Database Info

- **Supabase URL**: https://ilhljwosmgdluwusawbc.supabase.co
- **Project ID**: ilhljwosmgdluwusawbc
- **Status**: Connected ✅
- **Tables**: Not created ❌
- **Products**: 0

## 🎯 After Setup

Once tables are created and seeded, your app will:
- Display real products from database
- Store user accounts in database
- Persist shopping cart items
- Track orders and order history

Currently, the app uses **fallback in-memory data**, so it works but data isn't persisted.
