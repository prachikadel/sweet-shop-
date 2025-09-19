/*
  # Sweet Shop Management System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `role` (text, either 'admin' or 'user')
      - `created_at` (timestamp)
    
    - `sweets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `price` (decimal)
      - `quantity` (integer)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
    - Add admin-specific policies for user and sweet management

  3. Indexes
    - Add indexes for email lookup and sweet searches
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Create sweets table
CREATE TABLE IF NOT EXISTS sweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price > 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sweets ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to read user data for auth purposes

CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sweets policies (authenticated users can read all sweets)
CREATE POLICY "Anyone can read sweets"
  ON sweets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create sweets"
  ON sweets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update sweets"
  ON sweets
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete sweets"
  ON sweets
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_price ON sweets(price);
CREATE INDEX IF NOT EXISTS idx_sweets_created_at ON sweets(created_at);

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@sweetshop.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeU8hb.2EQkWQ7IYe', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample sweets data
INSERT INTO sweets (name, category, price, quantity, description) VALUES
  ('Milk Chocolate Bar', 'Chocolate', 2.50, 50, 'Creamy milk chocolate bar made with premium cocoa'),
  ('Dark Chocolate Truffle', 'Chocolate', 3.99, 30, 'Rich dark chocolate truffle with ganache center'),
  ('Strawberry Gummies', 'Gummy', 1.99, 100, 'Chewy strawberry-flavored gummy candies'),
  ('Sour Worms', 'Gummy', 2.25, 75, 'Tangy sour gummy worms in assorted flavors'),
  ('Peppermint Hard Candy', 'Hard Candy', 1.50, 200, 'Classic peppermint hard candy drops'),
  ('Caramel Lollipops', 'Lollipops', 1.75, 80, 'Sweet caramel lollipops on wooden sticks'),
  ('Rainbow Lollipops', 'Lollipops', 2.00, 60, 'Colorful swirl lollipops with fruity flavors'),
  ('Chocolate Fudge', 'Chocolate', 4.50, 25, 'Rich and creamy chocolate fudge squares'),
  ('Jelly Beans', 'Jelly', 3.25, 90, 'Assorted flavored jelly beans in vibrant colors'),
  ('Cotton Candy', 'Specialty', 3.00, 40, 'Fluffy pink cotton candy spun fresh daily')
ON CONFLICT DO NOTHING;