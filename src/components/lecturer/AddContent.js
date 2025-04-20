import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, push } from 'firebase/database';
import { database } from '../../firebase/config';
import './AddContent.css';

const AddContent = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('article');
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
      
      setSuccess('Content added successfully!');
      setTitle('');
      setContent('');
      setContentType('article');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to add content. Please try again.');
      console.error('Error adding content:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== 'lecturer') {
    return null;
  }

  return (
    <div className="add-content-container">
      <h1>Add New Content</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="add-content-form">
        <div className="form-group">
          <label htmlFor="contentType">Content Type</label>
          <select 
            id="contentType" 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
            required
          >
            <option value="article">Article</option>
            <option value="course">Course</option>
            <option value="resource">Resource</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here"
            rows="10"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Content'}
        </button>
      </form>
    </div>
  );
};

export default AddContent; 