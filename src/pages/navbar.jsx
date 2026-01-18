import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Slices/authSlice';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Secret Bet Admin</div>
      <button
        className="navbar-toggle"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/bets" className="nav-link">Bets</Link>
            <Link to="/deposit" className="nav-link">Deposit</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/withdraw" className="nav-link">Withdraw</Link>
            <button onClick={handleLogout} className="nav-link btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
