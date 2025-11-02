import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState({
    preferences: '',
    budget: '',
    occasion: '',
    style: ''
  });

  const handleGetRecommendations = async () => {
    try {
      const response = await axios.post('/api/ai/recommendations', {
        preferences: formData.preferences.split(',').map(p => p.trim()).filter(Boolean),
        budget: formData.budget ? parseFloat(formData.budget) : null,
        occasion: formData.occasion,
        style: formData.style
      });
      setRecommendations(response.data);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Style with
            <span className="gradient-text"> ZAR</span>
          </h1>
          <p className="hero-subtitle">
            Get personalized recommendations powered by artificial intelligence
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <button className="btn btn-secondary" onClick={() => setShowRecommendations(!showRecommendations)}>
              Get AI Recommendations
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            👔✨
          </div>
        </div>
      </section>

      {showRecommendations && (
        <section className="ai-recommendations">
          <div className="container">
            <h2>AI-Powered Recommendations</h2>
            <div className="recommendation-form">
              <input
                type="text"
                placeholder="Preferences (e.g., comfortable, stylish)"
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
              />
              <input
                type="number"
                placeholder="Budget ($)"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              >
                <option value="">Select Occasion</option>
                <option value="work">Work</option>
                <option value="party">Party</option>
                <option value="casual">Casual</option>
                <option value="sport">Sport</option>
              </select>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              >
                <option value="">Select Style</option>
                <option value="Casual">Casual</option>
                <option value="Professional">Professional</option>
                <option value="Edgy">Edgy</option>
                <option value="Feminine">Feminine</option>
                <option value="Sporty">Sporty</option>
              </select>
              <button className="btn btn-primary" onClick={handleGetRecommendations}>
                Get Recommendations
              </button>
            </div>

            {recommendations.length > 0 && (
              <div className="recommendations-grid">
                {recommendations.map(product => (
                  <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="features">
        <div className="container">
          <h2>Why Choose ZAR?</h2>
          <div className="features-grid">
            <Link to="/products" className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Recommendations</h3>
              <p>Get personalized product suggestions based on your preferences and style</p>
            </Link>
            <div className="feature-card" onClick={() => document.querySelector('.chatbot-toggle')?.click()}>
              <div className="feature-icon">💬</div>
              <h3>24/7 AI Assistant</h3>
              <p>Chat with our AI fashion assistant for styling advice and support</p>
            </div>
            <Link to="/products?style=Professional" className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Style Advisor</h3>
              <p>Receive expert styling tips tailored to your body type and preferences</p>
            </Link>
            <Link to="/products" className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find exactly what you're looking for with intelligent search capabilities</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Upgrade Your Wardrobe?</h2>
          <p>Let AI help you discover your perfect style</p>
          <Link to="/products" className="btn btn-primary btn-large">
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

