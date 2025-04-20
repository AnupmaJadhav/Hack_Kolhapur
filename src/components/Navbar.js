import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { logout, isAuthenticated, user, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = (e) => {
    e.preventDefault();
    setIsProfileOpen(!isProfileOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsProfileOpen(false);
  };

  const handleAddContentClick = () => {
    navigate('/add-content');
    setIsProfileOpen(false);
  };

  const handleLecturerProfileClick = () => {
    navigate('/lecturer-profile');
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo" onClick={closeMenu}>Women_Empowerment</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" className="nav-link" onClick={closeMenu}>Home</Link></li>
        {(!isAuthenticated || userRole === 'user') && (
          <>
            <li><Link to="/mentors" className="nav-link" onClick={closeMenu}>MentorConnect</Link></li>
            <li><Link to="/entrepreneurship" className="nav-link" onClick={closeMenu}>Entrepreneurship</Link></li>
          </>
        )}
        {isAuthenticated && userRole === 'lecturer' && (
          <li>
            <Link to="/add-content" className="nav-link" onClick={closeMenu}>
              <span className="menu-icon">📝</span> Add Content
            </Link>
          </li>
        )}
        {isAuthenticated && (
          <li className="profile-dropdown-container" ref={profileDropdownRef}>
            <button className="nav-link profile-link" onClick={toggleProfile}>
              <div className="profile-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="11" />
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20 C4 17 8 15 12 15 C16 15 20 17 20 20" />
                </svg>
              </div>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="11" />
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20 C4 17 8 15 12 15 C16 15 20 17 20 20" />
                      </svg>
                    </div>
                    <div className="profile-details">
                      <h3>{user?.name || 'User'}</h3>
                      <p>{user?.email || 'user@example.com'}</p>
                      <p className="user-role">{userRole || 'User'}</p>
                    </div>
                  </div>
                </div>
                <div className="profile-menu">
                  {userRole === 'user' && (
                    <button className="profile-menu-item" onClick={handleDashboardClick}>
                      <span className="menu-icon">📊</span>
                      Dashboard
                    </button>
                  )}
                  {userRole === 'lecturer' && (
                    <>
                      <button className="profile-menu-item" onClick={handleLecturerProfileClick}>
                        <span className="menu-icon">👤</span>
                        Lecturer Profile
                      </button>
                      <button className="profile-menu-item" onClick={handleAddContentClick}>
                        <span className="menu-icon">📝</span>
                        Add Content
                      </button>
                    </>
                  )}
                  <button className="profile-menu-item" onClick={handleLogout}>
                    <span className="menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 