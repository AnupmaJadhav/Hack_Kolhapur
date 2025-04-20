import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, push } from 'firebase/database';
import { database } from '../../firebase/config';
import CourseStats from './CourseStats';
import './AddContent.css';

const AddContent = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('course');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not a lecturer
  React.useEffect(() => {
    if (userRole !== 'lecturer') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const contentRef = ref(database, 'content');
      await push(contentRef, {
        title,
        content,
        contentType,
        authorId: user.uid,
        authorName: user.name,
        createdAt: new Date().toISOString(),
        status: 'pending' // For admin approval if needed
      });
      
      setSuccess('Course added successfully!');
      setTitle('');
      setContent('');
      setContentType('course');
      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to add course. Please try again.');
      console.error('Error adding course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== 'lecturer') {
    return null;
  }

  return (
    <div className="add-content-container">
      <h1>Course Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="add-course-button-container">
        <button 
          className="add-course-button"
          onClick={() => setShowForm(true)}
        >
          <span className="button-icon">➕</span>
          Add New Course
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="add-content-form">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Course Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter course content, objectives, and description"
              rows="10"
              required
            />
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      ) : (
        <CourseStats userId={user?.uid} />
      )}
    </div>
  );
};

export default AddContent; 