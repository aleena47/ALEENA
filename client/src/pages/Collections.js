import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Collections.css';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('/api/products');
      const products = response.data;
      
      // Group products by style to create collections
      const styleGroups = {};
      products.forEach(product => {
        if (!styleGroups[product.style]) {
          styleGroups[product.style] = [];
        }
        styleGroups[product.style].push(product);
      });

      const collectionsData = Object.keys(styleGroups).map(style => ({
        id: style.toLowerCase(),
        name: `${style} Collection`,
        style: style,
        description: `Discover our curated ${style.toLowerCase()} fashion collection`,
        image: styleGroups[style][0]?.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
        productCount: styleGroups[style].length,
        products: styleGroups[style].slice(0, 4)
      }));

      setCollections(collectionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      // Use dummy data if API fails
      setCollections([
        {
          id: 'casual',
          name: 'Casual Collection',
          style: 'Casual',
          description: 'Comfortable and stylish everyday wear',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
          productCount: 8,
          products: []
        },
        {
          id: 'professional',
          name: 'Professional Collection',
          style: 'Professional',
          description: 'Elegant workwear for the modern professional',
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500',
          productCount: 5,
          products: []
        },
        {
          id: 'edgy',
          name: 'Edgy Collection',
          style: 'Edgy',
          description: 'Bold and stylish pieces for the fashion-forward',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
          productCount: 3,
          products: []
        }
      ]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="collections-loading">
        <div className="loader">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="collections-page">
      <div className="collections-header">
        <div className="container">
          <h1>Our Collections</h1>
          <p>Explore curated fashion collections for every style</p>
        </div>
      </div>

      <div className="collections-content">
        <div className="container">
          <div className="collections-grid">
            {collections.map(collection => (
              <Link
                key={collection.id}
                to={`/products?style=${collection.style}`}
                className="collection-card"
              >
                <div className="collection-image">
                  <img src={collection.image} alt={collection.name} />
                  <div className="collection-overlay">
                    <span className="collection-count">{collection.productCount} Items</span>
                  </div>
                </div>
                <div className="collection-info">
                  <h2>{collection.name}</h2>
                  <p>{collection.description}</p>
                  <button className="collection-btn">Explore →</button>
                </div>
              </Link>
            ))}
          </div>

          {collections.length === 0 && (
            <div className="no-collections">
              <p>No collections available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;


