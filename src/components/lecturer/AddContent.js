import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import CourseStats from './CourseStats';
import './AddContent.css';
import { saveFile } from '../../utils/fileSystem';

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
  const [courses, setCourses] = useState([]);

  // Redirect if not authenticated or not a lecturer
  useEffect(() => {
    if (!user || userRole !== 'lecturer') {
      navigate('/');
      return;
    }
  }, [user, userRole, navigate]);

  // Fetch existing courses for this lecturer
  useEffect(() => {
    if (user?.uid) {
      const coursesRef = ref(database, 'courses');
      const unsubscribe = onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val();
        if (coursesData) {
          const coursesList = Object.keys(coursesData).map((key) => ({
            id: key,
            ...coursesData[key]
          })).filter(course => course.authorId === user.uid);
          
          setCourses(coursesList);
        }
      });
      
      return () => unsubscribe();
    }
  }, [user]);

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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication and role
    if (!user || userRole !== 'lecturer') {
      setError('You must be authenticated as a lecturer to add content');
      return;
    }
    
    if (!title.trim() || !description.trim() || contentItems.length === 0) {
      setError('Please fill in all fields and add at least one content item');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create course entry in database under the lecturer's UID
      const courseRef = ref(database, `courses/${user.uid}`);
      const newCourseRef = push(courseRef);
      const courseId = newCourseRef.key;

      // Process files and create content items
      const uploadedContentItems = [];
      
      for (let i = 0; i < contentItems.length; i++) {
        const item = contentItems[i];
        setUploadProgress(((i + 1) / contentItems.length) * 100);
        
        try {
          // Generate a unique file name to avoid conflicts
          const timestamp = Date.now();
          const originalName = item.file.name;
          const fileName = `${originalName.split('.')[0]}-${timestamp}.${originalName.split('.').pop()}`;
          
          // Process file (in browser environment, this just prepares metadata)
          const fileData = await saveFile(item.file, courseId, fileName);
          
          // Create a reader to get the file content for Base64 encoding
          const reader = new FileReader();
          
          // Wrap the file reading in a promise
          const fileContent = await new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(item.file);
          });
          
          uploadedContentItems.push({
            title: item.title,
            description: item.description,
            type: item.type,
            fileUrl: fileData.relativePath,
            fileName: originalName,
            order: i,
            dataUrl: item.file.size < 5000000 ? fileContent : null
          });
        } catch (err) {
          console.error(`Error processing file ${i}:`, err);
          throw new Error(`Failed to process file ${item.file.name}`);
        }
      }

      // Save course data under the lecturer's own node
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
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    
    } catch (err) {
      setError(`Failed to add course: ${err.message}`);
      console.error('Error adding course:', err);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const removeContentItem = (index) => {
    setContentItems(prev => prev.filter((_, i) => i !== index));
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
            
            {contentItems.length > 0 && (
              <div className="content-items-list">
                {contentItems.map((item, index) => (
                  <div key={index} className="content-item-preview">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <span className="content-type-badge">{item.type}</span>
                    <p className="file-name">{item.file.name}</p>
                    <button 
                      type="button" 
                      className="remove-item-button"
                      onClick={() => removeContentItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                {currentItem.file && (
                  <p className="file-info">Selected: {currentItem.file.name}</p>
                )}
              </div>

              <button
                type="button"
                className="add-item-button"
                onClick={handleAddContentItem}
                disabled={!currentItem.title || !currentItem.description || !currentItem.file}
              >
                Add Content Item
              </button>
            </div>
          </div>
          
          {uploadProgress > 0 && (
            <div className="upload-progress-container">
              <div className="upload-progress-bar" 
                   style={{ width: `${uploadProgress}%` }}>
                {Math.round(uploadProgress)}%
              </div>
            </div>
          )}
          
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
              disabled={isSubmitting || contentItems.length === 0}
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