import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { isAuthenticated } from '../auth';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status on mount
    const checkAuth = () => {
      try {
        setAuthenticated(isAuthenticated());
      } catch (e) {
        console.error('Auth check failed', e);
        setAuthenticated(false);
      }
    };
    checkAuth();
    
    // Update auth status when localStorage changes (for same-tab auth changes)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Listen for custom auth events
    try {
      window.addEventListener('auth-change', checkAuth);
      window.addEventListener('storage', handleStorageChange);
    } catch (e) {
      console.warn('Event listener setup failed', e);
    }
    
    return () => {
      try {
        window.removeEventListener('auth-change', checkAuth);
        window.removeEventListener('storage', handleStorageChange);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const cartCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">ZAR</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          {!authenticated && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          <button className="search-btn" onClick={() => navigate('/products')}>
            <FaSearch />
          </button>
          <Link to="/cart" className="cart-btn">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {authenticated && (
            <button className="user-btn" onClick={() => navigate('/profile')}>
              <FaUser />
            </button>
          )}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

