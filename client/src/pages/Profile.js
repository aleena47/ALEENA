import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios, { clearToken, isAuthenticated } from '../auth';
import './Profile.css';

const Profile = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    created_at: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.user) {
          const user = res.data.user;
          setUserData({
            name: user.name || 'User',
            email: user.email || '',
            memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          clearToken();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate('/');
    window.location.reload(); // Refresh to update Header
  };

  // Static data for orders, wishlist, etc. (can be fetched from API later)
  const profileData = {
    orders: [
      { id: 1, date: '2024-01-15', total: 129.99, status: 'Delivered', items: 2 },
      { id: 2, date: '2024-01-10', total: 79.99, status: 'Shipped', items: 1 },
      { id: 3, date: '2024-01-05', total: 199.99, status: 'Delivered', items: 1 }
    ],
    wishlist: (cartItems || []).slice(0, 3),
    preferences: {
      favoriteStyle: 'Casual',
      favoriteCategory: 'Tops',
      budget: '$50-$100'
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingBag /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <h1>My Account</h1>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          <div className="profile-layout">
            <aside className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <FaUser />
                </div>
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
                <p className="member-since">Member since {userData.memberSince}</p>
              </div>

              <nav className="profile-nav">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button className="profile-nav-item logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </nav>
            </aside>

            <main className="profile-main">
              {activeTab === 'overview' && (
                <div className="profile-section">
                  <h2>Account Overview</h2>
                  <div className="overview-stats">
                    <div className="stat-card">
                      <div className="stat-number">{profileData.orders.length}</div>
                      <div className="stat-label">Total Orders</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{cartItems.length}</div>
                      <div className="stat-label">Cart Items</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{profileData.wishlist.length}</div>
                      <div className="stat-label">Wishlist Items</div>
                    </div>
                  </div>

                  <div className="preferences-section">
                    <h3>Your Preferences</h3>
                    <div className="preferences-grid">
                      <div className="preference-item">
                        <strong>Favorite Style:</strong> {profileData.preferences.favoriteStyle}
                      </div>
                      <div className="preference-item">
                        <strong>Favorite Category:</strong> {profileData.preferences.favoriteCategory}
                      </div>
                      <div className="preference-item">
                        <strong>Budget Range:</strong> {profileData.preferences.budget}
                      </div>
                    </div>
                  </div>

                  <div className="quick-actions">
                    <Link to="/products" className="action-btn">
                      Continue Shopping
                    </Link>
                    <Link to="/cart" className="action-btn secondary">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="profile-section">
                  <h2>Order History</h2>
                  {profileData.orders.length > 0 ? (
                    <div className="orders-list">
                      {profileData.orders.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-header">
                            <div>
                              <strong>Order #{order.id}</strong>
                              <p className="order-date">{order.date}</p>
                            </div>
                            <div className="order-status">{order.status}</div>
                          </div>
                          <div className="order-details">
                            <p>{order.items} item(s) • Total: ${order.total}</p>
                            <Link to={`/orders/${order.id}`} className="order-link">
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No orders yet. Start shopping!</p>
                      <Link to="/products" className="btn btn-primary">Browse Products</Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="profile-section">
                  <h2>My Wishlist</h2>
                  {profileData.wishlist.length > 0 ? (
                    <div className="wishlist-grid">
                      {profileData.wishlist.map((item, index) => (
                        <div key={index} className="wishlist-item">
                          <img src={item.image} alt={item.name} />
                          <h3>{item.name}</h3>
                          <p>${item.price}</p>
                          <Link to={`/products/${item.id}`} className="wishlist-btn">
                            View Product
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>Your wishlist is empty</p>
                      <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="profile-section">
                  <h2>Account Settings</h2>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" defaultValue={userData.name} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" defaultValue={userData.email} />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="form-group">
                      <label>Shipping Address</label>
                      <textarea placeholder="Enter your shipping address" rows="3"></textarea>
                    </div>
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


