import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { isAuthenticated } from '../auth';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();
  
  // No modal state needed - navigating to separate page

  // Checkout button removed as requested

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="cart-item">
                <Link to={`/products/${item.id}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="cart-item-details">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="cart-item-price">${item.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            
            {/* SIMPLE CHECKOUT BUTTON */}
            <button>PROCEED TO CHECKOUT</button>
            <button>CHECKOUT NOW</button>
            <button>BUY NOW</button>
            
            <button 
              className="checkout-btn-main"
              onClick={() => {
                console.log('🛒 CHECKOUT BUTTON CLICKED!');
                alert('Going to checkout page!');
                navigate('/checkout');
              }}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'block',
                visibility: 'visible',
                opacity: '1',
                zIndex: '999'
              }}
            >
              🛒 Proceed to Checkout
            </button>
            
            {/* BACKUP BUTTON */}
            <div 
              onClick={() => window.location.href = '/checkout'}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '1rem',
                background: '#28a745',
                color: 'white',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              ✅ BACKUP CHECKOUT (Click if above doesn't work)
            </div>
            
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Cart;


