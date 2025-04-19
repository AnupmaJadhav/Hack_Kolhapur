import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './ContactSupport.css';

const ContactSupport = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, 'support_requests'), {
        ...formData,
        timestamp: new Date(),
        status: 'new'
      });
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting support request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return React.createElement('div', { className: 'contact-support-modal' },
    React.createElement('div', { className: 'contact-support-content' },
      React.createElement('button', { 
        className: 'close-button', 
        onClick: onClose 
      }, '×'),
      React.createElement('h2', null, 'Contact Support'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'name' }, 'Name'),
          React.createElement('input', {
            type: 'text',
            id: 'name',
            name: 'name',
            value: formData.name,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'email' }, 'Email'),
          React.createElement('input', {
            type: 'email',
            id: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'subject' }, 'Subject'),
          React.createElement('input', {
            type: 'text',
            id: 'subject',
            name: 'subject',
            value: formData.subject,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'message' }, 'Message'),
          React.createElement('textarea', {
            id: 'message',
            name: 'message',
            value: formData.message,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement('button', {
          type: 'submit',
          className: 'submit-button',
          disabled: isSubmitting
        }, isSubmitting ? 'Submitting...' : 'Submit'),
        submitStatus === 'success' && React.createElement('p', { className: 'success-message' }, 'Support request submitted successfully!'),
        submitStatus === 'error' && React.createElement('p', { className: 'error-message' }, 'Error submitting support request. Please try again.')
      )
    )
  );
};

export default ContactSupport; 