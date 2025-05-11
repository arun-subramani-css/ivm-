import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products for the current user
        const productsQuery = query(
          collection(db, 'products'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(productsQuery);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Set low stock products
        const lowStock = products.filter(product => product.quantity < 5);
        setLowStockProducts(lowStock);

        // Process category data
        const categoryMap = products.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = {
              count: 0,
              sales: 0
            };
          }
          acc[product.category].count += 1;
          acc[product.category].sales += (product.price * product.quantity) || 0;
          return acc;
        }, {});

        const categoryData = Object.entries(categoryMap).map(([name, data]) => ({
          name,
          count: data.count,
          sales: data.sales
        }));

        setCategoryData(categoryData);

        // Process top products
        const productsWithSales = products.map(product => ({
          ...product,
          sales: (product.price * product.quantity) || 0
        }));

        const sortedProducts = productsWithSales
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5); // Get top 5 products

        setTopProducts(sortedProducts);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="home-page">
      <div className="header">
        <h1>Inventory Dashboard</h1>
        <Link to="/stock" className="add-button">
          Add Product
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-value">{lowStockProducts.length}</span>
          <span className="stat-label">Low Stock Items</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">
            {lowStockProducts.filter(p => p.quantity === 0).length}
          </span>
          <span className="stat-label">Out of Stock</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{categoryData.length}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2>Low Stock Alert</h2>
            <Link to="/stock" className="view-link">View All</Link>
          </div>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : lowStockProducts.length === 0 ? (
            <div className="empty">All items are well stocked!</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`badge ${product.quantity === 0 ? 'red' : 'yellow'}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td>
                        <Link to="/stock" className="button">
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Category Overview</h2>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((category, index) => (
                    <tr key={index}>
                      <td>{category.name}</td>
                      <td>{category.count}</td>
                      <td>${category.sales.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Top Products</h2>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.sales.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${product.quantity < 10 ? 'yellow' : 'green'}`}>
                          {product.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default Home;
