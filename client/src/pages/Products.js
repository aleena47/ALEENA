import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    style: searchParams.get('style') || '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // Handle URL params
    const styleParam = searchParams.get('style');
    if (styleParam) {
      setFilters(prev => ({ ...prev, style: styleParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.style) {
      filtered = filtered.filter(p => p.style === filters.style);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1>Shop Our Collection</h1>
          <p>Discover fashion powered by AI</p>
        </div>
      </div>

      <div className="products-content">
        <div className="container">
          <div className="products-layout">
            <aside className="products-sidebar">
              <div className="filter-section">
                <h3>Search</h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-section">
                <h3>Category</h3>
                <button
                  className={`filter-btn ${filters.category === '' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', '')}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${filters.category === category ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="filter-section">
                <h3>Style</h3>
                <button
                  className={`filter-btn ${filters.style === '' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', '')}
                >
                  All Styles
                </button>
                <button
                  className={`filter-btn ${filters.style === 'Casual' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', 'Casual')}
                >
                  Casual
                </button>
                <button
                  className={`filter-btn ${filters.style === 'Professional' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', 'Professional')}
                >
                  Professional
                </button>
                <button
                  className={`filter-btn ${filters.style === 'Edgy' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', 'Edgy')}
                >
                  Edgy
                </button>
                <button
                  className={`filter-btn ${filters.style === 'Feminine' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', 'Feminine')}
                >
                  Feminine
                </button>
                <button
                  className={`filter-btn ${filters.style === 'Sporty' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('style', 'Sporty')}
                >
                  Sporty
                </button>
              </div>
            </aside>

            <main className="products-main">
              <div className="products-header-bar">
                <p className="products-count">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found. Try adjusting your filters.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setFilters({ category: '', style: '', search: '' })}
                    style={{ marginTop: '1rem' }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

