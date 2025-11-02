# QUICK FIX FOR SIGNUP "DB ERROR"

## Option 1: Create the Users Table (Most Likely Fix)

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run this SQL:**
   ```sql
   -- Create users table for authentication
   CREATE TABLE IF NOT EXISTS users (
     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Create index
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;

   -- Create policy for service role (allows server-side operations)
   CREATE POLICY "Service role can manage users" ON users
     FOR ALL USING (true) WITH CHECK (true);
   ```

4. **Click "Run"**

## Option 2: Create .env File (If Missing)

1. **Create `.env` file in the root folder** (`C:\Users\DELL\Downloads\FCP\.env`)

2. **Add these lines:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Get your credentials:**
   - Go to https://app.supabase.com
   - Select your project
   - Go to Settings → API
   - Copy "Project URL" → use for `SUPABASE_URL`
   - Copy "service_role" key → use for `SUPABASE_SERVICE_ROLE_KEY`

4. **Restart your server:**
   ```powershell
   npm start
   ```

## Option 3: Run Full Schema (If Tables Are Missing)

Run the entire `supabase/schema.sql` file in Supabase SQL Editor.

This will create all tables including users.

