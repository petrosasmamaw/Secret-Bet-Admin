import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../Slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
    const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
      .then(() => {
        navigate('/dashboard');
      });
  };

  return (
    <div className="page">
      <h1 className="page-header">Admin <span>Login</span></h1>
      <p className="page-description">Access the admin panel by logging in.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
