import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios, { isAuthenticated } from '../auth';
import { FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    // For demo purposes, allow checkout without authentication
    if (!isAuthenticated()) {
      console.log('🟡 User not authenticated, but allowing demo checkout');
      // Set demo user data
      setUserData({ id: 'demo', name: 'Demo User', email: 'demo@example.com' });
      setShippingInfo(prev => ({
        ...prev,
        fullName: 'Demo User',
        email: 'demo@example.com'
      }));
    } else {
      // Fetch user data to pre-fill form
      const fetchUserData = async () => {
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data.user) {
            setUserData(res.data.user);
            setShippingInfo(prev => ({
              ...prev,
              fullName: res.data.user.name || '',
              email: res.data.user.email || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to demo data
          setUserData({ id: 'demo', name: 'Demo User', email: 'demo@example.com' });
          setShippingInfo(prev => ({
            ...prev,
            fullName: 'Demo User',
            email: 'demo@example.com'
          }));
        }
      };

      fetchUserData();
    }

    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
      return;
    }
  }, [navigate, cartItems.length, orderPlaced]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const total = calculateTotal();
      
      // Create order
      const orderData = {
        userId: userData?.id || 'guest',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        total: total,
        shippingInfo: shippingInfo,
        paymentMethod: 'COD'
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data) {
        setOrderId(response.data.id);
        setOrderPlaced(true);
        
        // Store order in localStorage for demo mode
        const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
        const newOrder = {
          ...response.data,
          items: cartItems,
          shippingInfo: shippingInfo,
          paymentMethod: 'COD'
        };
        existingOrders.push(newOrder);
        localStorage.setItem('demo_orders', JSON.stringify(existingOrders));
        
        // Clear cart after successful order
        clearCart();
        
        // Scroll to top to show success message
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-number">Order #{orderId}</p>
            <p className="success-message">
              Thank you for your order! We'll send you a confirmation email shortly.
            </p>
            <div className="order-details-box">
              <h3>Delivery Information</h3>
              <p><strong>Name:</strong> {shippingInfo.fullName}</p>
              <p><strong>Email:</strong> {shippingInfo.email}</p>
              <p><strong>Phone:</strong> {shippingInfo.phone}</p>
              <p><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
              <p className="cod-note">💵 Please keep ${calculateTotal().toFixed(2)} ready for payment upon delivery</p>
            </div>
            <div className="success-actions">
              <button onClick={() => navigate('/profile')} className="btn btn-primary">
                View Orders
              </button>
              <button onClick={() => navigate('/products')} className="btn btn-secondary">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">
          <FaShoppingBag /> Checkout
        </h1>

        <div className="checkout-layout">
          <div className="checkout-form-section">
            <form onSubmit={handlePlaceOrder}>
              <div className="form-section">
                <h2>Shipping Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-method-box">
                  <div className="payment-option selected">
                    <input type="radio" id="cod" name="payment" checked readOnly />
                    <label htmlFor="cod">
                      <strong>💵 Cash on Delivery (COD)</strong>
                      <p>Pay with cash when your order is delivered</p>
                    </label>
                  </div>
                  <p className="payment-note">
                    This is a demo checkout. Only COD payment is available for testing purposes.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-place-order"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Color: {item.color}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="cod-info">
                <p>💵 <strong>Cash on Delivery</strong></p>
                <p>Please keep exact amount ready for payment upon delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
