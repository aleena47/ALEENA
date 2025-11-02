# ZAR - AI-Powered E-Commerce Fashion Platform

<div align="center">

![ZAR Fashion](https://img.shields.io/badge/Fashion-E--Commerce-667eea?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-764ba2?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

**A cutting-edge AI-integrated e-commerce platform revolutionizing the online fashion shopping experience**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📖 Overview

ZAR is a modern, full-stack e-commerce platform specializing in fashion and clothing retail. The platform leverages artificial intelligence to provide personalized shopping experiences, intelligent product recommendations, and 24/7 AI-powered customer assistance. Built with React and Node.js, ZAR offers a seamless, responsive shopping experience across all devices.

### Key Highlights

- 🤖 **Advanced AI Integration** - Powered by Google Gemini 2.5 Flash Pro for intelligent recommendations and chatbot assistance
- 🛒 **Complete E-Commerce Solution** - Product catalog, shopping cart, user authentication, and order management
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations and intuitive navigation
- 🔐 **Secure Authentication** - JWT-based user authentication with secure password hashing
- 🗄️ **Scalable Database** - Supabase PostgreSQL integration with Row Level Security
- ⚡ **Production Ready** - Optimized build, error handling, and comprehensive API structure

---

## ✨ Features

### 🤖 AI-Powered Features

#### Intelligent Product Recommendations
- **Context-Aware Suggestions**: Get personalized product recommendations based on:
  - User preferences and style
  - Budget constraints
  - Occasion (work, party, casual, sport)
  - Body type and measurements
- **Smart Filtering**: Advanced product filtering by category, style, price range, and search queries
- **Gemini AI Integration**: Utilizes Google's Gemini 2.5 Flash Pro model for intelligent product analysis and matching

#### AI Fashion Chatbot
- **24/7 Virtual Assistant**: Interactive chatbot that helps customers with:
  - Product sizing and fit questions
  - Style advice and recommendations
  - Shipping and delivery information
  - Return and refund policies
  - General fashion queries
- **Conversation History**: Maintains context across multiple interactions for natural conversations
- **Contextual Suggestions**: Provides relevant action buttons based on conversation flow

#### Style Advisor
- **Personalized Styling Tips**: Receive expert advice tailored to:
  - Body type (petite, tall, regular)
  - Personal style preferences
  - Specific occasions
  - Budget considerations
- **Curated Recommendations**: AI-suggested products matching your style profile

### 🛍️ E-Commerce Features

#### Product Management
- **Comprehensive Catalog**: Browse through diverse fashion categories:
  - Tops and T-shirts
  - Bottoms (Jeans, Pants, Shorts)
  - Outerwear (Jackets, Blazers, Coats)
  - Dresses
  - Shoes
  - Accessories
- **Detailed Product Pages**: 
  - High-quality product images
  - Multiple size options
  - Color variations
  - Detailed descriptions
  - Price information
- **Smart Search**: Full-text search across product names, descriptions, and categories
- **Category Filtering**: Filter products by category, style, and price range

#### Shopping Cart
- **Persistent Cart**: Shopping cart data persisted across sessions
- **Real-time Updates**: Cart quantities and totals update instantly
- **Multiple Items**: Add multiple products with different sizes and colors
- **Cart Management**: Easily update quantities or remove items

#### User Authentication & Profiles
- **Secure Sign Up/Login**: Email and password-based authentication
- **JWT Token Authentication**: Secure token-based session management
- **User Profiles**: 
  - Personal information management
  - Order history tracking
  - Wishlist functionality
  - Style preferences

#### Order Management
- **Order Tracking**: View order history and status
- **Order Details**: Detailed breakdown of each order including items, quantities, and totals
- **Order Status**: Track orders through pending, shipped, and delivered states

### 🎨 User Interface

#### Design Features
- **Modern, Clean Design**: Sleek gradient themes and smooth transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use header with search, cart, and user menu
- **Smooth Animations**: Polished UI animations and hover effects
- **Accessible**: WCAG-compliant design with proper semantic HTML

#### Pages
- **Homepage**: Featured products, collections, and AI recommendation showcase
- **Product Listing**: Grid view with filtering and sorting options
- **Product Detail**: Comprehensive product information with image gallery
- **Shopping Cart**: Review and manage cart items before checkout
- **Collections**: Curated product collections by style and theme
- **About**: Brand story and company information
- **Profile**: User dashboard with account management

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework for building interactive components |
| **React Router DOM** | 6.20.0 | Client-side routing and navigation |
| **Axios** | 1.6.0 | HTTP client for API communication |
| **React Icons** | 4.12.0 | Comprehensive icon library |
| **CSS3** | - | Modern styling with gradients and animations |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **JSON Web Token** | 9.0.0 | Secure authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing and encryption |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.3.1 | Environment variable management |

### Database & Cloud Services

| Service | Purpose |
|---------|---------|
| **Supabase** | PostgreSQL database with Row Level Security |
| **Google Gemini 2.5 Flash Pro** | AI model for recommendations and chatbot |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart server during development |
| **React Scripts** | Build tooling for React applications |

---

## 📁 Project Structure

```
FCP/
├── client/                          # React frontend application
│   ├── public/                      # Static files
│   │   ├── index.html              # HTML template
│   │   └── manifest.json            # PWA manifest
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Header.js            # Navigation header
│   │   │   ├── AIChatbot.js         # AI chatbot component
│   │   │   └── ErrorBoundary.js     # Error handling
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.js              # Homepage
│   │   │   ├── Products.js         # Product listing
│   │   │   ├── ProductDetail.js    # Product details
│   │   │   ├── Cart.js             # Shopping cart
│   │   │   ├── Collections.js      # Product collections
│   │   │   ├── About.js            # About page
│   │   │   ├── Profile.js          # User profile
│   │   │   ├── Login.js            # Login page
│   │   │   └── Signup.js           # Signup page
│   │   ├── context/                 # React Context providers
│   │   │   └── CartContext.js      # Shopping cart state
│   │   ├── auth.js                  # Authentication utilities
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # Global styles
│   │   └── index.js                 # Entry point
│   └── package.json                 # Frontend dependencies
│
├── config/                          # Configuration files
│   ├── supabase.js                  # Supabase client setup
│   └── gemini.js                    # Gemini AI configuration
│
├── supabase/                        # Database schema and scripts
│   ├── schema.sql                   # Complete database schema
│   ├── seed.sql                     # Sample data seeding
│   └── users_table.sql              # Users table definition
│
├── scripts/                         # Utility scripts
│   └── seed_supabase.js             # Database seeding script
│
├── server.js                        # Express server and API routes
├── package.json                     # Backend dependencies
├── .env                             # Environment variables (create this)
├── README.md                        # This file
└── README_SUPABASE.md               # Supabase setup guide
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase Account** (for database) - [Sign up](https://supabase.com)
- **Google Gemini API Key** (optional, for AI features) - [Get API Key](https://aistudio.google.com/app/apikey)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FCP
```

### Step 2: Install Dependencies

#### Install Backend Dependencies
```bash
npm install
```

#### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-client
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# JWT Secret (use a strong random string)
JWT_SECRET=your_secure_random_secret_key_here

# Google Gemini API (Optional - for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Node Environment
NODE_ENV=development
```

#### Getting Supabase Credentials:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon public** key → `SUPABASE_ANON_KEY`

### Step 4: Database Setup

#### Option A: Using SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/schema.sql`
5. Click **Run** to create all tables
6. (Optional) Run `supabase/seed.sql` to add sample products

#### Option B: Using Seeding Script

```bash
npm run seed:supabase
```

This will automatically create tables and seed initial data.

### Step 5: Start the Application

#### Development Mode

**Terminal 1 - Backend Server:**
```bash
npm start
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm start
```
Frontend runs on: `http://localhost:3000`

#### Production Mode

Build the React application:
```bash
npm run build
```

Start the server (serves both API and frontend):
```bash
NODE_ENV=production npm start
```

Visit: `http://localhost:5000`

---

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `GET /api/auth/me`
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Product Endpoints

#### `GET /api/products`
Get all products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "Tops", "Bottoms")
- `style` (optional): Filter by style (e.g., "Casual", "Professional")
- `search` (optional): Search term for product name/description

**Example:**
```
GET /api/products?category=Tops&style=Casual&search=shirt
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Classic White T-Shirt",
    "category": "Tops",
    "price": 29.99,
    "image": "https://...",
    "description": "Premium cotton t-shirt",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White", "Black", "Gray"],
    "style": "Casual"
  }
]
```

#### `GET /api/products/:id`
Get a single product by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Classic White T-Shirt",
  "category": "Tops",
  "price": 29.99,
  "image": "https://...",
  "description": "Premium cotton t-shirt with comfortable fit",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["White", "Black", "Gray"],
  "style": "Casual"
}
```

#### `GET /api/categories`
Get all available product categories.

**Response (200 OK):**
```json
["Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"]
```

### AI Endpoints

#### `POST /api/ai/recommendations`
Get AI-powered product recommendations.

**Request Body:**
```json
{
  "preferences": ["comfortable", "stylish"],
  "budget": 100,
  "occasion": "work",
  "style": "Professional"
}
```

**Response (200 OK):**
```json
[
  {
    "id": 6,
    "name": "Formal Blazer",
    "category": "Outerwear",
    "price": 149.99,
    ...
  }
]
```

#### `POST /api/ai/chat`
Chat with AI fashion assistant.

**Request Body:**
```json
{
  "message": "What sizes do you have?",
  "conversationHistory": []
}
```

**Response (200 OK):**
```json
{
  "message": "We offer a wide range of sizes from XS to XL, and shoe sizes from 6 to 12. Would you like me to help you find your perfect fit?",
  "suggestions": [
    "Yes, please",
    "Show size guide",
    "Continue shopping"
  ]
}
```

#### `POST /api/ai/style-advisor`
Get personalized style advice.

**Request Body:**
```json
{
  "bodyType": "petite",
  "preferences": ["modern", "casual"],
  "occasion": "work"
}
```

**Response (200 OK):**
```json
{
  "bodyType": "petite",
  "recommendations": [
    {
      "id": 1,
      "name": "Classic White T-Shirt",
      ...
    }
  ],
  "tips": [
    "Choose high-waisted pieces to elongate your frame",
    "Opt for fitted clothing to avoid overwhelming your frame"
  ]
}
```

### Cart Endpoints

#### `GET /api/cart/:userId`
Get user's shopping cart items.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Classic White T-Shirt",
    "price": 29.99,
    "size": "M",
    "color": "White",
    "quantity": 2
  }
]
```

#### `POST /api/cart`
Add item to cart or update quantity.

**Request Body:**
```json
{
  "userId": 1,
  "productId": 1,
  "size": "M",
  "color": "White",
  "quantity": 2
}
```

#### `DELETE /api/cart/:userId/:itemId`
Remove item from cart.

**Query Parameters:**
- `size`: Item size
- `color`: Item color

#### `PUT /api/cart/:userId/:itemId`
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3,
  "size": "M",
  "color": "White"
}
```

### Health Check

#### `GET /api/health`
Check server and database connectivity.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "productCount": 18,
  "gemini": "configured"
}
```

---

## 🗄️ Database Schema

### Tables

#### `users`
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key (auto-increment) |
| `email` | TEXT | Unique email address |
| `password_hash` | TEXT | Bcrypt hashed password |
| `name` | TEXT | User's full name |
| `created_at` | TIMESTAMP | Account creation timestamp |

#### `products`
Stores product catalog.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `name` | VARCHAR(255) | Product name |
| `category` | VARCHAR(100) | Product category |
| `price` | DECIMAL(10,2) | Product price |
| `image` | TEXT | Product image URL |
| `description` | TEXT | Product description |
| `sizes` | JSONB | Available sizes array |
| `colors` | JSONB | Available colors array |
| `style` | VARCHAR(50) | Style type |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `cart_items`
Stores shopping cart items.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `user_id` | VARCHAR(255) | User identifier |
| `product_id` | INTEGER | Foreign key to products |
| `size` | VARCHAR(50) | Selected size |
| `color` | VARCHAR(50) | Selected color |
| `quantity` | INTEGER | Item quantity |
| `created_at` | TIMESTAMP | Addition timestamp |

#### `orders`
Stores order information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `user_id` | VARCHAR(255) | User identifier |
| `total` | DECIMAL(10,2) | Order total |
| `status` | VARCHAR(50) | Order status |
| `created_at` | TIMESTAMP | Order creation timestamp |

#### `order_items`
Stores individual items in orders.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `order_id` | INTEGER | Foreign key to orders |
| `product_id` | INTEGER | Foreign key to products |
| `size` | VARCHAR(50) | Item size |
| `color` | VARCHAR(50) | Item color |
| `quantity` | INTEGER | Item quantity |
| `price` | DECIMAL(10,2) | Item price at time of order |

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Row Level Security**: Supabase RLS policies protect database access
- **CORS Protection**: Configured CORS to prevent unauthorized cross-origin requests
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Protection**: Parameterized queries prevent SQL injection attacks
- **Environment Variables**: Sensitive data stored in `.env` file (not committed to version control)

---

## 🎯 Key Features Implementation

### AI Integration Architecture

The platform uses Google Gemini 2.5 Flash Pro for:
- **Natural Language Processing**: Understanding user queries and conversation context
- **Product Analysis**: Analyzing product features and matching with user preferences
- **Personalized Recommendations**: Machine learning-based product suggestions
- **Contextual Responses**: Maintaining conversation history for natural interactions

### Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcrypt
3. User data stored in Supabase with RLS policies
4. JWT token generated and sent to client
5. Token stored in localStorage
6. Token included in Authorization header for protected routes
7. Server verifies token on each request

### Shopping Cart Implementation

- Uses React Context API for global cart state
- Cart data synced with backend database
- Persistent storage across browser sessions
- Real-time quantity and total calculations
- Optimistic UI updates for better UX

---

## 🚀 Deployment

### Production Build

```bash
# Build React application
npm run build

# Set production environment
export NODE_ENV=production

# Start server
npm start
```

### Environment Variables for Production

Ensure all production environment variables are set:
- `NODE_ENV=production`
- `PORT` (your server port)
- `SUPABASE_URL` (production Supabase URL)
- `SUPABASE_SERVICE_ROLE_KEY` (production key)
- `JWT_SECRET` (strong random secret)
- `GEMINI_API_KEY` (if using AI features)

### Recommended Hosting Platforms

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS Elastic Beanstalk, or DigitalOcean
- **Database**: Supabase (already configured)

---

## 📸 Screenshots

> **Note**: Add screenshots of your application here showing:
> - Homepage with featured products
> - Product listing page with filters
> - Product detail page
> - Shopping cart
> - User profile dashboard
> - AI chatbot interface

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Product search functionality
- [ ] Add to cart and cart management
- [ ] User profile access and updates
- [ ] AI chatbot interactions
- [ ] AI product recommendations
- [ ] Style advisor functionality
- [ ] Responsive design on mobile devices
- [ ] Error handling and validation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design compatibility

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Gemini**: AI model for intelligent recommendations and chatbot
- **Supabase**: Database and backend infrastructure
- **React Team**: Excellent frontend framework
- **Express.js**: Robust backend framework
- **Unsplash**: Product images used in the demo

---

## 📧 Contact & Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your Email/Contact Information]

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications for order updates
- [ ] Product reviews and ratings system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile application (React Native)
- [ ] Social media integration
- [ ] Wishlist sharing functionality
- [ ] Virtual try-on features using AR
- [ ] AI-powered image search
- [ ] Personalized email marketing campaigns

---

<div align="center">

**Built with ❤️ using React and Node.js**

⭐ Star this repository if you find it helpful!

</div>
