-- Seed products data
INSERT INTO products (name, category, price, image, description, sizes, colors, style) VALUES
('Classic White T-Shirt', 'Tops', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Premium cotton t-shirt with comfortable fit', '["S", "M", "L", "XL"]'::jsonb, '["White", "Black", "Gray"]'::jsonb, 'Casual'),
('Slim Fit Denim Jeans', 'Bottoms', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'Classic denim jeans with modern slim fit', '["28", "30", "32", "34", "36"]'::jsonb, '["Blue", "Black"]'::jsonb, 'Casual'),
('Leather Jacket', 'Outerwear', 199.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 'Genuine leather jacket with classic design', '["S", "M", "L", "XL"]'::jsonb, '["Black", "Brown"]'::jsonb, 'Edgy'),
('Summer Dress', 'Dresses', 59.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 'Light and airy summer dress perfect for warm weather', '["XS", "S", "M", "L"]'::jsonb, '["Floral", "Blue", "Pink"]'::jsonb, 'Feminine'),
('Running Shoes', 'Shoes', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Comfortable running shoes with excellent support', '["7", "8", "9", "10", "11", "12"]'::jsonb, '["White", "Black", "Red"]'::jsonb, 'Sporty'),
('Formal Blazer', 'Outerwear', 149.99, 'https://images.unsplash.com/photo-1594938291221-94f313ab01a6?w=500', 'Elegant blazer for professional occasions', '["S", "M", "L", "XL"]'::jsonb, '["Navy", "Black", "Gray"]'::jsonb, 'Professional'),
('Yoga Pants', 'Bottoms', 49.99, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500', 'Comfortable and flexible yoga pants', '["XS", "S", "M", "L", "XL"]'::jsonb, '["Black", "Gray", "Navy"]'::jsonb, 'Athletic'),
('Silk Scarf', 'Accessories', 39.99, 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500', 'Luxurious silk scarf with elegant patterns', '["One Size"]'::jsonb, '["Multicolor", "Blue", "Red"]'::jsonb, 'Elegant'),
('Wool Coat', 'Outerwear', 249.99, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', 'Warm and stylish wool coat for winter', '["S", "M", "L", "XL"]'::jsonb, '["Black", "Gray", "Navy"]'::jsonb, 'Professional'),
('Casual Sneakers', 'Shoes', 89.99, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500', 'Comfortable everyday sneakers', '["7", "8", "9", "10", "11", "12"]'::jsonb, '["White", "Black", "Gray"]'::jsonb, 'Casual'),
('Cargo Pants', 'Bottoms', 69.99, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 'Functional cargo pants with multiple pockets', '["28", "30", "32", "34", "36"]'::jsonb, '["Khaki", "Black", "Olive"]'::jsonb, 'Casual'),
('Polo Shirt', 'Tops', 39.99, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', 'Classic polo shirt for smart casual wear', '["S", "M", "L", "XL"]'::jsonb, '["White", "Navy", "Red", "Blue"]'::jsonb, 'Casual'),
('Maxi Dress', 'Dresses', 79.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 'Elegant maxi dress perfect for any occasion', '["XS", "S", "M", "L"]'::jsonb, '["Black", "Red", "Blue", "Floral"]'::jsonb, 'Feminine'),
('Baseball Cap', 'Accessories', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 'Classic baseball cap with adjustable strap', '["One Size"]'::jsonb, '["Black", "White", "Navy", "Red"]'::jsonb, 'Casual'),
('Hoodie', 'Tops', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'Comfortable cotton hoodie', '["S", "M", "L", "XL"]'::jsonb, '["Gray", "Black", "Navy"]'::jsonb, 'Casual'),
('High Heels', 'Shoes', 99.99, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', 'Elegant high heels for formal events', '["6", "7", "8", "9", "10"]'::jsonb, '["Black", "Nude", "Red"]'::jsonb, 'Elegant'),
('Shorts', 'Bottoms', 34.99, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 'Comfortable summer shorts', '["S", "M", "L", "XL"]'::jsonb, '["Khaki", "Navy", "Black"]'::jsonb, 'Casual'),
('Sunglasses', 'Accessories', 49.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Stylish sunglasses with UV protection', '["One Size"]'::jsonb, '["Black", "Brown", "Tortoise"]'::jsonb, 'Edgy')
ON CONFLICT DO NOTHING;


