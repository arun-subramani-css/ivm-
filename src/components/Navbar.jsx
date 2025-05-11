import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Inventory Dashboard</Link>
      </div>
      <div className="navbar-menu">
        {currentUser && (
          <>
            <Link to="/" className="navbar-item">Home</Link>
            <Link to="/stock" className="navbar-item">Stock</Link>
            <Link to="/analytics" className="navbar-item">Analytics</Link>
          </>
        )}
      </div>
      <div className="navbar-end">
        {currentUser ? (
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
