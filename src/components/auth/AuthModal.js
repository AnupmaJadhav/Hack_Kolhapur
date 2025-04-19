import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''    
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Here you would typically make an API call to register
      // For now, we'll simulate a successful registration
      login({
        name: formData.name,
        email: formData.email
      });
    } else {
      // Here you would typically make an API call to login
      // For now, we'll simulate a successful login
      login({
        email: formData.email
      });
    }
    
    onClose();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              required
            />
          </div>
          
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <button type="submit" className="submit-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        
        <p className="toggle-mode">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="toggle-button">
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal; 