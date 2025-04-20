import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/config';
import CourseStats from './CourseStats';
import './AddContent.css';

const AddContent = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentItems, setContentItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    title: '',
    description: '',
    file: null,
    type: 'video', // or 'pdf'
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if not a lecturer
  React.useEffect(() => {
    if (userRole !== 'lecturer') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentItem(prev => ({
        ...prev,
        file,
        type: file.type.includes('pdf') ? 'pdf' : 'video'
      }));
    }
  };

  const handleAddContentItem = () => {
    if (!currentItem.title || !currentItem.description || !currentItem.file) {
      setError('Please fill in all fields for the content item');
      return;
    }

    setContentItems(prev => [...prev, { ...currentItem, order: prev.length }]);
    setCurrentItem({
      title: '',
      description: '',
      file: null,
      type: 'video',
      order: contentItems.length + 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || contentItems.length === 0) {
      setError('Please fill in all fields and add at least one content item');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create course entry in database
      const courseRef = ref(database, 'courses');
      const newCourseRef = push(courseRef);
      const courseId = newCourseRef.key;

      // Upload files and create content items
      const uploadedContentItems = await Promise.all(
        contentItems.map(async (item, index) => {
          const fileRef = storageRef(storage, `courses/${courseId}/${item.file.name}`);
          await uploadBytes(fileRef, item.file);
          const downloadURL = await getDownloadURL(fileRef);

          return {
            title: item.title,
            description: item.description,
            type: item.type,
            url: downloadURL,
            order: index
          };
        })
      );

      // Save course data
      await set(newCourseRef, {
        title,
        description,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        content: uploadedContentItems,
        status: 'pending'
      });
      
      setSuccess('Course added successfully!');
      setTitle('');
      setDescription('');
      setContentItems([]);
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
            <label htmlFor="description">Course Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              rows="4"
              required
            />
          </div>

          <div className="content-items-section">
            <h3>Course Content Items</h3>
            
            {contentItems.map((item, index) => (
              <div key={index} className="content-item-preview">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <span className="content-type-badge">{item.type}</span>
              </div>
            ))}

            <div className="add-content-item-form">
              <h4>Add New Content Item</h4>
              <div className="form-group">
                <label htmlFor="itemTitle">Item Title</label>
                <input
                  type="text"
                  id="itemTitle"
                  value={currentItem.title}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content item title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemDescription">Item Description</label>
                <textarea
                  id="itemDescription"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter content item description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemFile">Upload File (PDF or Video)</label>
                <input
                  type="file"
                  id="itemFile"
                  accept=".pdf,.mp4,.mov,.avi"
                  onChange={handleFileChange}
                />
              </div>

              <button
                type="button"
                className="add-item-button"
                onClick={handleAddContentItem}
              >
                Add Content Item
              </button>
            </div>
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
              {isSubmitting ? 'Adding Course...' : 'Add Course'}
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