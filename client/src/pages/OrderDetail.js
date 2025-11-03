import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios, { isAuthenticated } from '../auth';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        // First try to get from API
        const res = await axios.get('/api/auth/me');
        if (res.data.user) {
          const userId = res.data.user.id;
          
          // Try database first
          try {
            const ordersRes = await axios.get(`/api/orders/${userId}`);
            const dbOrder = ordersRes.data.find(o => o.id === parseInt(orderId));
            
            if (dbOrder) {
              // If order_items don't have complete product info, fetch products separately
              if (dbOrder.order_items && dbOrder.order_items.length > 0) {
                const itemsWithProducts = await Promise.all(
                  dbOrder.order_items.map(async (item) => {
                    if (!item.products || !item.products.image) {
                      try {
                        const productRes = await axios.get(`/api/products/${item.product_id}`);
                        return {
                          ...item,
                          products: productRes.data
                        };
                      } catch (err) {
                        console.log('Could not fetch product details for item:', item.product_id);
                        return item;
                      }
                    }
                    return item;
                  })
                );
                dbOrder.order_items = itemsWithProducts;
              }
              
              setOrder(dbOrder);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('Database orders not available, checking localStorage');
          }
          
          // Fallback to localStorage
          const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
          const localOrder = demoOrders.find(o => o.id === parseInt(orderId) && o.user_id === userId);
          
          if (localOrder) {
            setOrder(localOrder);
          } else {
            // Create a demo order if none exists (for testing purposes)
            const demoOrder = {
              id: parseInt(orderId),
              user_id: userId,
              total: 89.99,
              status: 'pending',
              created_at: new Date().toISOString(),
              items: [
                {
                  id: 1,
                  name: "Classic White T-Shirt",
                  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                  price: 29.99,
                  size: "M",
                  color: "White",
                  quantity: 1,
                  category: "Tops"
                },
                {
                  id: 2,
                  name: "Slim Fit Denim Jeans",
                  image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
                  price: 59.99,
                  size: "32",
                  color: "Blue",
                  quantity: 1,
                  category: "Bottoms"
                }
              ],
              shippingInfo: {
                fullName: "Demo User",
                address: "123 Demo Street",
                city: "Demo City",
                state: "Demo State",
                zipCode: "12345",
                country: "Demo Country",
                email: "demo@example.com",
                phone: "+1 (555) 123-4567"
              },
              paymentMethod: "Cash on Delivery (COD)"
            };
            setOrder(demoOrder);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '3rem' }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-not-found">
            <h1>Order Not Found</h1>
            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
              Order ID: {orderId}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/profile" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Back to Profile
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'delivered':
        return <FaCheckCircle />;
      case 'shipped':
        return <FaTruck />;
      default:
        return <FaBox />;
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <FaArrowLeft /> Back to Profile
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Order #{order.id}</h1>
            <p className="order-date">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className={`order-status-badge ${getStatusClass(order.status)}`}>
            {getStatusIcon(order.status)}
            <span>{order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}</span>
          </div>
        </div>

        <div className="order-detail-layout">
          <div className="order-items-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {(order.items || order.order_items || []).length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  <p>No items found in this order.</p>
                  <p style={{ fontSize: '0.9rem' }}>Order structure: {JSON.stringify(Object.keys(order))}</p>
                </div>
              ) : (order.items || order.order_items || []).map((item, index) => {
                // Handle both demo orders (items) and database orders (order_items)
                let product, itemPrice, itemSize, itemColor, itemQuantity;
                
                if (item.products) {
                  // Database order structure: order_items with nested products
                  product = item.products;
                  itemPrice = item.price || product.price;
                  itemSize = item.size;
                  itemColor = item.color;
                  itemQuantity = item.quantity;
                } else if (item.name) {
                  // Demo order structure: items are products themselves
                  product = item;
                  itemPrice = item.price;
                  itemSize = item.size;
                  itemColor = item.color;
                  itemQuantity = item.quantity;
                } else {
                  // Fallback: try to extract what we can
                  product = item;
                  itemPrice = item.price || 0;
                  itemSize = item.size || 'N/A';
                  itemColor = item.color || 'N/A';
                  itemQuantity = item.quantity || 1;
                }

                // Ensure we have a valid product with required fields
                if (!product || !product.name) {
                  return null;
                }

                return (
                  <div key={index} className="order-item-card">
                    <img 
                      src={product.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                    <div className="order-item-info">
                      <h3>{product.name}</h3>
                      <p className="item-details">
                        Size: {itemSize} | Color: {itemColor}
                      </p>
                      <p className="item-quantity">Quantity: {itemQuantity}</p>
                      <p className="item-category">{product.category || ''}</p>
                    </div>
                    <div className="order-item-price">
                      ${(itemPrice * itemQuantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="order-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-info-section">
            <div className="info-card">
              <h3>Shipping Information</h3>
              {order.shippingInfo ? (
                <>
                  <p><strong>{order.shippingInfo.fullName}</strong></p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                  <p>{order.shippingInfo.country}</p>
                  <p className="contact-info">
                    <strong>Email:</strong> {order.shippingInfo.email}
                  </p>
                  <p className="contact-info">
                    <strong>Phone:</strong> {order.shippingInfo.phone}
                  </p>
                </>
              ) : (
                <p>Shipping information not available</p>
              )}
            </div>

            <div className="info-card">
              <h3>Payment Method</h3>
              <div className="payment-method-display">
                <span className="payment-icon">💵</span>
                <div>
                  <strong>{order.paymentMethod || 'Cash on Delivery (COD)'}</strong>
                  <p>Pay with cash when your order is delivered</p>
                </div>
              </div>
              <div className="cod-reminder">
                <p>💡 Please keep <strong>${parseFloat(order.total).toFixed(2)}</strong> ready for payment upon delivery</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Order Status</h3>
              <div className="status-timeline">
                <div className={`timeline-step ${order.status ? 'completed' : ''}`}>
                  <div className="step-icon">✓</div>
                  <div className="step-info">
                    <strong>Order Placed</strong>
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`timeline-step ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}`}>
                  <div className="step-icon">📦</div>
                  <div className="step-info">
                    <strong>Processing</strong>
                    <p>{order.status === 'shipped' || order.status === 'delivered' ? 'Completed' : 'In Progress'}</p>
                  </div>
                </div>
                <div className={`timeline-step ${order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}`}>
                  <div className="step-icon">🚚</div>
                  <div className="step-info">
                    <strong>Shipped</strong>
                    <p>{order.status === 'shipped' || order.status === 'delivered' ? 'On the way' : 'Pending'}</p>
                  </div>
                </div>
                <div className={`timeline-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                  <div className="step-icon">✅</div>
                  <div className="step-info">
                    <strong>Delivered</strong>
                    <p>{order.status === 'delivered' ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-actions">
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                Print Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
