import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './AddYourContent.css';

const AddYourContent = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'lecture',
    file: null,
    thumbnail: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser || userRole !== 'lecturer') {
      navigate('/');
    }
  }, [currentUser, userRole, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'content'), {
        ...formData,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setFormData({
        title: '',
        description: '',
        contentType: 'lecture',
        file: null,
        thumbnail: null
      });

      alert('Content submitted successfully!');
    } catch (err) {
      setError('Error submitting content. Please try again.');
      console.error('Error submitting content:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser || userRole !== 'lecturer') {
    return null;
  }

  return React.createElement('div', { className: 'add-content-container' },
    React.createElement('h1', null, 'Add Your Content'),
    React.createElement('form', { onSubmit: handleSubmit, className: 'content-form' },
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'title' }, 'Title'),
        React.createElement('input', {
          type: 'text',
          id: 'title',
          name: 'title',
          value: formData.title,
          onChange: handleChange,
          required: true,
          placeholder: 'Enter content title'
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'description' }, 'Description'),
        React.createElement('textarea', {
          id: 'description',
          name: 'description',
          value: formData.description,
          onChange: handleChange,
          required: true,
          placeholder: 'Enter content description'
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'contentType' }, 'Content Type'),
        React.createElement('select', {
          id: 'contentType',
          name: 'contentType',
          value: formData.contentType,
          onChange: handleChange,
          required: true
        },
          React.createElement('option', { value: 'lecture' }, 'Lecture'),
          React.createElement('option', { value: 'assignment' }, 'Assignment'),
          React.createElement('option', { value: 'resource' }, 'Resource')
        )
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'file' }, 'Content File'),
        React.createElement('input', {
          type: 'file',
          id: 'file',
          name: 'file',
          onChange: handleChange,
          required: true,
          accept: '.pdf,.doc,.docx,.ppt,.pptx'
        })
      ),
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'thumbnail' }, 'Thumbnail Image'),
        React.createElement('input', {
          type: 'file',
          id: 'thumbnail',
          name: 'thumbnail',
          onChange: handleChange,
          accept: 'image/*'
        })
      ),
      error && React.createElement('div', { className: 'error-message' }, error),
      React.createElement('button', {
        type: 'submit',
        className: 'submit-button',
        disabled: isSubmitting
      }, isSubmitting ? 'Submitting...' : 'Submit Content')
    )
  );
};

export default AddYourContent; 