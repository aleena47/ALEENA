require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const supabase = require('./config/supabase');
const { chatWithGemini, getAIRecommendations, getStyleAdvice, getProductContext } = require('./config/gemini');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Auth utilities
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_env';

function generateToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(req, res, next){
  const h = req.headers.authorization || '';
  const match = h.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'Missing token' });
  const token = match[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Mock in-memory user storage (fallback when database is not available)
const mockUsers = new Map(); // email -> { id, email, password_hash, name, created_at }
let mockUserIdCounter = 1;

function useMockStorage() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  // Use mock if Supabase is not configured
  return !SUPABASE_URL || !SUPABASE_KEY;
}

async function mockUserExists(email) {
  return mockUsers.has(email.toLowerCase());
}

async function mockGetUser(email) {
  return mockUsers.get(email.toLowerCase()) || null;
}

async function mockCreateUser(email, password_hash, name) {
  const id = mockUserIdCounter++;
  const user = {
    id,
    email: email.toLowerCase(),
    password_hash,
    name: name || null,
    created_at: new Date().toISOString()
  };
  mockUsers.set(email.toLowerCase(), user);
  return user;
}

async function mockGetUserById(id) {
  for (const user of mockUsers.values()) {
    if (user.id === parseInt(id)) {
      return user;
    }
  }
  return null;
}

// Serve static files from React app (serve build if available, regardless of NODE_ENV)
const buildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Sample product data (fallback if Supabase fails)
const productsFallback = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
    name: "Silk Scarf",
    category: "Accessories",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500",
    description: "Luxurious silk scarf with elegant patterns",
    sizes: ["One Size"],
    colors: ["Multicolor", "Blue", "Red"],
    style: "Elegant"
  },
  {
    id: 9,
    name: "Wool Coat",
    category: "Outerwear",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    description: "Warm and stylish wool coat for winter",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    style: "Professional"
  },
  {
    id: 10,
    name: "Casual Sneakers",
    category: "Shoes",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
    description: "Comfortable everyday sneakers",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    style: "Casual"
  },
  {
    id: 11,
    name: "Cargo Pants",
    category: "Bottoms",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
    description: "Functional cargo pants with multiple pockets",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Black", "Olive"],
    style: "Casual"
  },
  {
    id: 12,
    name: "Polo Shirt",
    category: "Tops",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    description: "Classic polo shirt for smart casual wear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Navy", "Red", "Blue"],
    style: "Casual"
  },
  {
    id: 13,
    name: "Maxi Dress",
    category: "Dresses",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    description: "Elegant maxi dress perfect for any occasion",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Blue", "Floral"],
    style: "Feminine"
  },
  {
    id: 14,
    name: "Baseball Cap",
    category: "Accessories",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
    description: "Classic baseball cap with adjustable strap",
    sizes: ["One Size"],
    colors: ["Black", "White", "Navy", "Red"],
    style: "Casual"
  },
  {
    id: 15,
    name: "Hoodie",
    category: "Tops",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    description: "Comfortable cotton hoodie",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Navy"],
    style: "Casual"
  },
  {
    id: 16,
    name: "High Heels",
    category: "Shoes",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
    description: "Elegant high heels for formal events",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Black", "Nude", "Red"],
    style: "Elegant"
  },
  {
    id: 17,
    name: "Shorts",
    category: "Bottoms",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    description: "Comfortable summer shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Khaki", "Navy", "Black"],
    style: "Casual"
  },
  {
    id: 18,
    name: "Sunglasses",
    category: "Accessories",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    description: "Stylish sunglasses with UV protection",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tortoise"],
    style: "Edgy"
  }
];

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, style, search } = req.query;
    
    // Always try Supabase first
    let products = [];
    let error = null;

    try {
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (style) {
        query = query.eq('style', style);
      }

      const result = await query;
      products = result.data || [];
      error = result.error;

      if (error) {
        console.error('Supabase error:', error);
        // Fallback to in-memory data
        let filteredProducts = [...productsFallback];
        if (category) filteredProducts = filteredProducts.filter(p => p.category === category);
        if (style) filteredProducts = filteredProducts.filter(p => p.style === style);
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower)) ||
            p.category.toLowerCase().includes(searchLower)
          );
        }
        return res.json(filteredProducts);
      }
    } catch (err) {
      console.error('Database query error:', err);
      error = err;
    }

    // If no products from DB or error, use fallback
    if (products.length === 0 && error) {
      let filteredProducts = [...productsFallback];
      if (category) filteredProducts = filteredProducts.filter(p => p.category === category);
      if (style) filteredProducts = filteredProducts.filter(p => p.style === style);
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower)) ||
          p.category.toLowerCase().includes(searchLower)
        );
      }
      return res.json(filteredProducts);
    }

    let filteredProducts = products;

    // Client-side search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Convert JSONB arrays back to JavaScript arrays
    filteredProducts = filteredProducts.map(p => ({
      ...p,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
    }));

    res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    let product = null;
    let error = null;

    try {
      const result = await supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(req.params.id))
        .single();
      product = result.data;
      error = result.error;
    } catch (err) {
      error = err;
    }

    if (error || !product) {
      // Fallback to in-memory data
      const fallbackProduct = productsFallback.find(p => p.id === parseInt(req.params.id));
      if (fallbackProduct) {
        return res.json(fallbackProduct);
      }
      return res.status(404).json({ error: 'Product not found' });
    }

    // Convert JSONB arrays back to JavaScript arrays
    const formattedProduct = {
      ...product,
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
      colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    let categories = [];

    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('category');

      if (!error && products && products.length > 0) {
        categories = [...new Set(products.map(p => p.category))];
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }

    // Fallback to in-memory data if Supabase fails
    if (categories.length === 0) {
      categories = [...new Set(productsFallback.map(p => p.category))];
    }

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// --- Authentication endpoints (simple email/password with JWT) ---
// POST /api/auth/signup { email, password, name }
// DEMO MODE: Accepts any email, no duplicate checking
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    // Use mock storage always for demo
    console.log('📦 Creating/updating user (any email accepted)');
    
    // If user exists, update them; otherwise create new
    const existingUser = await mockGetUser(email);
    let user;
    
    if (existingUser) {
      // Update existing user
      const password_hash = password ? await bcrypt.hash(password, 10) : existingUser.password_hash;
      user = {
        id: existingUser.id,
        email: email.toLowerCase(),
        password_hash,
        name: name || existingUser.name,
        created_at: existingUser.created_at
      };
      mockUsers.set(email.toLowerCase(), user);
    } else {
      // Create new user
      const password_hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('demo123', 10);
      user = await mockCreateUser(email, password_hash, name);
    }
    
    const token = generateToken({ id: user.id, email: user.email });
    return res.status(201).json({ 
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at }, 
      token 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      error: 'Signup failed: ' + (err.message || String(err))
    });
  }
});

// POST /api/auth/login { email, password }
// DEMO MODE: Accepts ANY credentials, no password checking
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔵 Login request received:', req.body);
    const { email, password } = req.body;
    
    // Accept email or any string - make it even more permissive
    if (!email || email.trim() === '') {
      console.log('⚠️ No email provided, using default');
      const defaultEmail = `user${Date.now()}@demo.com`;
      const password_hash = await bcrypt.hash('demo123', 10);
      const user = await mockCreateUser(defaultEmail, password_hash, 'Demo User');
      const token = generateToken({ id: user.id, email: user.email });
      return res.json({ 
        user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at }, 
        token 
      });
    }
    
    // Use mock storage always for demo
    console.log('📦 Logging in (any credentials accepted):', email);
    
    // Get or create user
    let user = await mockGetUser(email);
    
    if (!user) {
      // Create user if doesn't exist (auto-signup)
      console.log('📦 User not found, creating new user:', email);
      const password_hash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('demo123', 10);
      user = await mockCreateUser(email, password_hash, 'User');
    }
    
    // Always succeed - no password checking
    const token = generateToken({ id: user.id, email: user.email });
    console.log('✅ Login successful for:', email);
    return res.json({ 
      user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at }, 
      token 
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    console.error('Error stack:', err.stack);
    // Even on error, create a demo user and return token
    try {
      const demoEmail = `error_user_${Date.now()}@demo.com`;
      const password_hash = await bcrypt.hash('demo123', 10);
      const user = await mockCreateUser(demoEmail, password_hash, 'Demo User');
      const token = generateToken({ id: user.id, email: user.email });
      console.log('✅ Created demo user due to error');
      return res.json({ 
        user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at }, 
        token 
      });
    } catch (fallbackErr) {
      console.error('❌ Fallback also failed:', fallbackErr);
      res.status(500).json({ error: 'Login failed', details: String(err && err.message ? err.message : err) });
    }
  }
});

// GET /api/auth/me  (requires Authorization: Bearer <token>)
// DEMO MODE: Always uses mock storage
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    
    // Always use mock storage for demo
    const user = await mockGetUserById(id);
    if (!user) {
      // If user not found, return basic info from token
      return res.json({ 
        user: { 
          id: req.user.id, 
          email: req.user.email, 
          name: req.user.email, 
          created_at: new Date().toISOString() 
        } 
      });
    }
    
    return res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        created_at: user.created_at 
      } 
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// GET /api/auth/users  (protected list of users)
app.get('/api/auth/users', verifyToken, async (req, res) => {
  try {
    // return all users without password_hash
    const { data, error } = await supabase.from('users').select('id,email,name,created_at');
    if (error) return res.status(500).json({ error: 'Database error', details: String(error.message || error) });
    res.json(data || []);
  } catch (err) {
    console.error('Users list error:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// AI-powered recommendation endpoint
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { preferences, budget, occasion, style } = req.body;
    
    // Fetch products from Supabase
    let allProducts = productsFallback;

    try {
      const { data: productsData, error } = await supabase.from('products').select('*');
      if (!error && productsData && productsData.length > 0) {
        allProducts = productsData;
      } else if (error) {
        console.error('Supabase error:', error);
      }
    } catch (err) {
      console.error('Error fetching products for recommendations:', err);
    }

    // Convert JSONB arrays back to JavaScript arrays
    allProducts = allProducts.map(p => ({
      ...p,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (Array.isArray(p.sizes) ? p.sizes : []),
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (Array.isArray(p.colors) ? p.colors : [])
    }));

    // If Gemini didn't return recommendations, use fallback logic
    if (!recommendations || recommendations.length === 0) {
      recommendations = [...allProducts];

      if (budget) {
        recommendations = recommendations.filter(p => p.price <= budget);
      }

      if (occasion) {
        const occasionStyles = {
          'work': ['Professional', 'Casual'],
          'party': ['Edgy', 'Feminine', 'Elegant'],
          'casual': ['Casual', 'Sporty'],
          'sport': ['Athletic', 'Sporty']
        };
        const styles = occasionStyles[occasion.toLowerCase()] || [];
        recommendations = recommendations.filter(p => styles.includes(p.style));
      }

      if (style) {
        recommendations = recommendations.filter(p => p.style === style);
      }

      // Sort by relevance
      recommendations = recommendations
        .sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;

          if (preferences && preferences.length > 0) {
            preferences.forEach(pref => {
              if (a.name.toLowerCase().includes(pref.toLowerCase()) ||
                  (a.description && a.description.toLowerCase().includes(pref.toLowerCase()))) scoreA++;
              if (b.name.toLowerCase().includes(pref.toLowerCase()) ||
                  (b.description && b.description.toLowerCase().includes(pref.toLowerCase()))) scoreB++;
            });
          }

          return scoreB - scoreA;
        })
        .slice(0, 6);
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// AI Chatbot endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Get product context for Gemini
    const productContext = await getProductContext(supabase);
    
    // Try Gemini first
    const geminiResponse = await chatWithGemini(message, conversationHistory, productContext);

    if (geminiResponse) {
      // Generate intelligent suggestions based on both user message and AI response
      let suggestions = [];
      const lowerMessage = message.toLowerCase();
      const lowerResponse = geminiResponse.toLowerCase();
      
      // Check what the conversation is about
      if (lowerMessage.includes('party') || lowerMessage.includes('event') || lowerMessage.includes('occasion')) {
        suggestions = ["Show me dresses", "What about shoes?", "Accessories too", "View all products"];
      } else if (lowerMessage.includes('summer') || lowerMessage.includes('beach') || lowerMessage.includes('casual')) {
        suggestions = ["Show casual wear", "Summer dresses", "Comfortable shoes", "Browse all"];
      } else if (lowerMessage.includes('work') || lowerMessage.includes('professional') || lowerMessage.includes('office')) {
        suggestions = ["Show blazers", "Professional attire", "Work shoes", "View collection"];
      } else if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerResponse.includes('size')) {
        suggestions = ["Yes, help me", "Show size guide", "Continue shopping"];
      } else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerResponse.includes('return')) {
        suggestions = ["Return policy", "Start return", "Contact support"];
      } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerResponse.includes('shipping')) {
        suggestions = ["Track order", "Shipping options", "Delivery time"];
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
        suggestions = ["Under $50", "$50-$100", "Over $100", "View all"];
      } else if (lowerResponse.includes('recommend') || lowerResponse.includes('suggest') || lowerResponse.includes('options')) {
        suggestions = ["Show me more", "Different style", "View products", "Tell me more"];
      } else {
        // Default helpful suggestions
        suggestions = ["Browse products", "Get recommendations", "Size help", "Shipping info"];
      }

      return res.json({
        message: geminiResponse,
        suggestions: suggestions
      });
    }

    // Fallback to rule-based logic
    const lowerMessage = message.toLowerCase();
    let response = {
      message: "",
      suggestions: []
    };

    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      response.message = "I can help you find the perfect size! Our size guide is available on each product page. Would you like me to recommend a size based on your measurements?";
      response.suggestions = ["Yes, please", "Show size guide", "Continue shopping"];
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      response.message = "We offer a 30-day return policy! You can return items in their original condition for a full refund. Would you like help with processing a return?";
      response.suggestions = ["Start return", "Check return policy", "Need more help"];
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      response.message = "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days. Express shipping (2-3 days) is available for an additional $10.";
      response.suggestions = ["Check order status", "Track package", "Shipping options"];
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      response.message = "I'd love to help you find the perfect outfit! What's the occasion? (work, party, casual, sport)";
      response.suggestions = ["Work", "Party", "Casual", "Sport"];
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      response.message = "Our prices range from $29.99 to $199.99. We frequently have sales and promotions! Would you like to see items in a specific price range?";
      response.suggestions = ["Under $50", "$50-$100", "Over $100", "View all"];
    } else {
      response.message = "I'm here to help with your fashion needs! I can assist with size recommendations, styling advice, returns, shipping, and product suggestions. What would you like to know?";
      response.suggestions = ["Product recommendations", "Size help", "Shipping info", "Returns"];
    }

    res.json(response);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// AI Style Advisor endpoint
app.post('/api/ai/style-advisor', async (req, res) => {
  try {
    const { bodyType, preferences, occasion } = req.body;

    // Fetch products from Supabase
    let products = productsFallback;

    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*');
      
      if (!error && productsData && productsData.length > 0) {
        products = productsData;
      } else if (error) {
        console.error('Supabase error:', error);
      }
    } catch (err) {
      console.error('Error fetching products for style advisor:', err);
    }

    // Convert JSONB arrays back to JavaScript arrays
    products = products.map(p => ({
      ...p,
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (Array.isArray(p.sizes) ? p.sizes : []),
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (Array.isArray(p.colors) ? p.colors : [])
    }));

    // Try Gemini AI for style advice
    const aiAdvice = await getStyleAdvice(bodyType, preferences, occasion, products);

    if (aiAdvice) {
      return res.json(aiAdvice);
    }

    // Fallback to rule-based logic
    const styleAdvice = {
      bodyType: bodyType || "regular",
      recommendations: [],
      tips: []
    };

    if (bodyType === "petite") {
      styleAdvice.tips.push("Choose high-waisted pieces to elongate your frame");
      styleAdvice.tips.push("Opt for fitted clothing to avoid overwhelming your frame");
      styleAdvice.recommendations = products.filter(p => 
        p.category === "Tops" || p.category === "Dresses"
      ).slice(0, 3);
    } else if (bodyType === "tall") {
      styleAdvice.tips.push("Longer silhouettes will complement your height");
      styleAdvice.tips.push("Experiment with layering for visual interest");
      styleAdvice.recommendations = products.filter(p => 
        p.category === "Outerwear" || p.category === "Dresses"
      ).slice(0, 3);
    } else {
      styleAdvice.tips.push("Balance is key - pair fitted with loose pieces");
      styleAdvice.tips.push("Create vertical lines with your outfits to appear taller");
      styleAdvice.recommendations = products.slice(0, 3);
    }

    if (occasion) {
      styleAdvice.tips.push(`For ${occasion}, consider pieces that reflect your personal style while being appropriate for the setting.`);
    }

    res.json(styleAdvice);
  } catch (error) {
    console.error('Error getting style advice:', error);
    res.status(500).json({ error: 'Failed to get style advice' });
  }
});

// Cart management endpoints
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    // Format cart items
    const formattedCart = (cartItems || []).map(item => ({
      ...item.products,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      sizes: typeof item.products.sizes === 'string' ? JSON.parse(item.products.sizes) : item.products.sizes,
      colors: typeof item.products.colors === 'string' ? JSON.parse(item.products.colors) : item.products.colors
    }));

    res.json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, size, color, quantity } = req.body;

    // Check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + (quantity || 1) })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          size,
          color,
          quantity: quantity || 1
        })
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/api/cart/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { size, color } = req.query;

    let query = supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', itemId);

    if (size) query = query.eq('size', size);
    if (color) query = query.eq('color', color);

    const { error } = await query;

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

app.put('/api/cart/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity, size, color } = req.body;

    let query = supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', itemId);

    if (size) query = query.eq('size', size);
    if (color) query = query.eq('color', color);

    const { data, error } = await query.select().single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Orders endpoints
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error);
      // Return empty array if table doesn't exist or error
      return res.json([]);
    }

    res.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.json([]); // Return empty array on error
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, shippingInfo, paymentMethod } = req.body;

    // For demo: If database tables don't exist, return mock order
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total: total,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        // If table doesn't exist, return mock order for demo
        if (orderError.message && orderError.message.includes('does not exist')) {
          console.log('📦 Demo mode: Orders table not created, returning mock order');
          const mockOrder = {
            id: Math.floor(Math.random() * 10000),
            user_id: userId,
            total: total,
            status: 'pending',
            created_at: new Date().toISOString(),
            shippingInfo: shippingInfo,
            paymentMethod: paymentMethod
          };
          return res.json(mockOrder);
        }
        throw orderError;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear user's cart after successful order
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      res.json(order);
    } catch (dbError) {
      // Fallback for demo mode
      console.log('📦 Demo mode: Database error, returning mock order');
      const mockOrder = {
        id: Math.floor(Math.random() * 10000),
        user_id: userId,
        total: total,
        status: 'pending',
        created_at: new Date().toISOString(),
        shippingInfo: shippingInfo,
        paymentMethod: paymentMethod
      };
      return res.json(mockOrder);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Database connection test endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'unknown',
    gemini: 'unknown'
  };

  // Test Supabase connection
  try {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) {
      health.database = 'disconnected';
      health.databaseError = error.message;
    } else {
      health.database = 'connected';
      health.productCount = count || 0;
    }
  } catch (error) {
    health.database = 'error';
    health.databaseError = error.message;
  }

  
  // Test Gemini connection
  try {
    const { model } = require('./config/gemini');
    health.gemini = model ? 'configured' : 'not_configured';
  } catch (error) {
    health.gemini = 'error';
    health.geminiError = error.message;
  }

  res.json(health);
});

// Quick Supabase connectivity test (top-level)
app.get('/api/supatest', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.json({ ok: true, sampleCount: Array.isArray(data) ? data.length : 0 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// Serve React app for all other routes (catch-all for React Router)
// MUST be after all API routes
const buildIndexPath = path.join(__dirname, 'client', 'build', 'index.html');
if (fs.existsSync(buildIndexPath)) {
  app.get('*', (req, res) => {
    // Don't interfere with API routes (shouldn't happen if route order is correct)
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
      return;
    }
    res.sendFile(buildIndexPath);
  });
} else {
  // Fallback if build doesn't exist - start React dev server instead
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      res.send(`
        <html>
          <head><title>Route Not Found</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>React App Not Built</h1>
            <p>Please run one of these options:</p>
            <h3>Option 1: Build React app</h3>
            <pre style="background: #f5f5f5; padding: 20px; display: inline-block; border-radius: 5px; text-align: left;">
cd client && npm run build
            </pre>
            <h3>Option 2: Start React dev server</h3>
            <p>Run in a separate terminal:</p>
            <pre style="background: #f5f5f5; padding: 20px; display: inline-block; border-radius: 5px; text-align: left;">
cd client && npm start
            </pre>
            <p>Then visit: <a href="http://localhost:3000">http://localhost:3000</a></p>
            <p>API routes are available at <code>/api/*</code></p>
          </body>
        </html>
      `);
    }
  });
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the website`);
  
  // Test database connection on startup
  try {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (error) {
      console.error('⚠️  Supabase connection error:', error.message);
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('💡 Tables not found. Run supabase/schema.sql in Supabase SQL Editor');
        console.log('💡 Visit: https://app.supabase.com → Your Project → SQL Editor');
      } else {
        console.log('💡 Check your Supabase project status');
      }
    } else {
      console.log(`✅ Supabase connected successfully!`);
      console.log(`📦 Products in database: ${count || 0}`);
      if (count === 0) {
        console.log('💡 Database is empty. Run supabase/seed.sql in Supabase SQL Editor to add products.');
      }
    }
  } catch (error) {
    console.error('⚠️  Database connection test failed:', error.message);
  }

  // Test Gemini connection
  try {
    const { model } = require('./config/gemini');
    if (model) {
      console.log('✅ Gemini 2.5 Flash Pro initialized');
    } else {
      console.log('⚠️  Gemini not configured (GEMINI_API_KEY missing in .env)');
    }
  } catch (error) {
    console.log('⚠️  Gemini initialization check failed');
  }
});

// --- SQL schema for initial setup ---
// create users table
// CREATE TABLE IF NOT EXISTS users (
//   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   password_hash TEXT NOT NULL,
//   name TEXT,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
// );

