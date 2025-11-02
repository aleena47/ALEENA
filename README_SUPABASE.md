# Supabase Setup Instructions

## Getting Started with Supabase

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Supabase Credentials**
   - Go to your project dashboard
   - Navigate to Settings → API
   - Copy your `Project URL` and `anon public` key

3. **Set Up Environment Variables**
   - Open the `.env` file in the root directory
   - Add your Supabase credentials:
     ```
     SUPABASE_URL=https://your-project-ref.supabase.co
     SUPABASE_ANON_KEY=your_anon_key
     ```
   - You can find these in your Supabase dashboard:
     - Go to Settings → API
     - Copy the "Project URL" for SUPABASE_URL
     - Copy the "anon public" key for SUPABASE_ANON_KEY

4. **Create Database Tables**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the SQL from `supabase/schema.sql`
   - This will create all necessary tables

5. **Seed Initial Data**
   - In the SQL Editor, run the SQL from `supabase/seed.sql`
   - This will populate your database with sample products

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Start the Server**
   ```bash
   npm start
   ```

## Database Schema

The database includes the following tables:

- **products**: Stores all product information
- **cart_items**: Stores user cart items (uses user_id or session_id)
- **orders**: Stores order information
- **order_items**: Stores individual items in orders

## Row Level Security (RLS)

RLS is enabled on all tables. The default policies allow:
- Everyone can read products
- Users can manage their own cart items
- Users can view and create their own orders

You can customize these policies in the Supabase dashboard under Authentication → Policies.

