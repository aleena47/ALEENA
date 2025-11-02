import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About ZAR</h1>
          <p>Where Technology Meets Style</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              ZAR was born from a simple idea: making fashion accessible, personalized, and effortless. 
              We combine cutting-edge artificial intelligence with curated fashion selections to help you discover 
              your perfect style.
            </p>
            <p>
              Founded in 2024, we've revolutionized the online shopping experience by integrating AI technology 
              that learns your preferences, understands your needs, and recommends products that truly match 
              your style.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              To empower everyone to express their unique style through intelligent fashion recommendations, 
              making shopping easier, faster, and more enjoyable. We believe fashion should be accessible to 
              everyone, and AI is the tool that makes this possible.
            </p>
          </div>

          <div className="about-features">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <h3>AI-Powered</h3>
                <p>Advanced AI algorithms that understand your style preferences</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <h3>Curated Collections</h3>
                <p>Carefully selected products from trusted brands</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚚</div>
                <h3>Fast Shipping</h3>
                <p>Quick and reliable delivery to your doorstep</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💳</div>
                <h3>Easy Shopping</h3>
                <p>Seamless checkout process with secure payments</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Personalized</h3>
                <p>Recommendations tailored specifically for you</p>
              </div>
            </div>
          </div>

          <div className="about-team">
            <h2>Meet the Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👨‍💼</div>
                <h3>Alex Johnson</h3>
                <p className="member-role">CEO & Founder</p>
                <p>Passionate about fashion and technology</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍💻</div>
                <h3>Sarah Chen</h3>
                <p className="member-role">CTO</p>
                <p>AI and machine learning expert</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👨‍🎨</div>
                <h3>Michael Ross</h3>
                <p className="member-role">Head of Design</p>
                <p>Bringing style to the digital world</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍💼</div>
                <h3>Emma Davis</h3>
                <p className="member-role">Fashion Curator</p>
                <p>Expert in trends and styling</p>
              </div>
            </div>
          </div>

          <div className="about-cta">
            <h2>Ready to Transform Your Style?</h2>
            <p>Join thousands of satisfied customers who have discovered their perfect look with ZAR</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
              <Link to="/" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

