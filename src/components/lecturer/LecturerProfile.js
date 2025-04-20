import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/config';
import './LecturerProfile.css';

const LecturerProfile = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    title: '',
    location: '',
    languages: '',
    qualifications: [],
    expertise: [],
    careerJourney: '',
    personalStory: '',
    teachingStyle: [],
    resources: [],
    sampleTopics: [],
    education: '',
    achievements: [],
    publications: [],
    contactInfo: {
      email: '',
      office: '',
      officeHours: ''
    }
  });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || userRole !== 'lecturer') {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const profileRef = ref(database, `lecturers/${user.uid}/profile`);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfileData(prevData => ({
            ...prevData,
            ...data
          }));
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userRole, navigate]);

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setLoading(true);
      const imageRef = storageRef(storage, `lecturer-profiles/${user.uid}/profile-image`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      const profileRef = ref(database, `lecturers/${user.uid}/profile`);
      await set(profileRef, {
        ...profileData,
        imageUrl: url,
        updatedAt: new Date().toISOString()
      });

      setImageUrl(url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      const profileRef = ref(database, `lecturers/${user.uid}/profile`);
      await set(profileRef, {
        ...profileData,
        imageUrl,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lecturer-profile">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lecturer-profile">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lecturer-profile">
      <div className="profile-header">
        <div className="profile-image-container">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">👤</div>
          )}
          {isEditing && (
            <div className="image-upload-container">
              <label className="image-upload-label">
                <span>📷</span> Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload"
                />
              </label>
            </div>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="form-input"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="form-input"
                placeholder="Professional Title"
              />
            </>
          ) : (
            <>
              <h1 className="profile-title">{profileData.fullName}</h1>
              <h2 className="profile-subtitle">{profileData.title}</h2>
            </>
          )}

          <div className="location-languages">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="form-input"
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={profileData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className="form-input"
                  placeholder="Languages"
                />
              </>
            ) : (
              <>
                {profileData.location && (
                  <div>
                    <span>📍</span> {profileData.location}
                  </div>
                )}
                {profileData.languages && (
                  <div>
                    <span>🌐</span> {profileData.languages}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="edit-button"
          disabled={saveLoading}
        >
          {isEditing ? (
            saveLoading ? '💾 Saving...' : '💾 Save Profile'
          ) : (
            <>✏️ Edit Profile</>
          )}
        </button>
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">🎓</span>
          Education & Qualifications
        </h3>
        {isEditing ? (
          <div className="form-group">
            <label className="form-label">Education</label>
            <textarea
              value={profileData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="form-textarea"
              placeholder="Enter your educational background..."
            />
            <label className="form-label">Qualifications (comma-separated)</label>
            <input
              type="text"
              value={profileData.qualifications.join(', ')}
              onChange={(e) => handleArrayInputChange('qualifications', e.target.value)}
              className="form-input"
              placeholder="e.g., PhD in Computer Science, Master's in Education"
            />
          </div>
        ) : (
          <>
            {profileData.education && <p>{profileData.education}</p>}
            <div className="expertise-tags">
              {profileData.qualifications.map((qual, index) => (
                <span key={index} className="expertise-tag">
                  <span>🎓</span> {qual}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">💼</span>
          Career Journey
        </h3>
        {isEditing ? (
          <textarea
            value={profileData.careerJourney}
            onChange={(e) => handleInputChange('careerJourney', e.target.value)}
            className="form-textarea"
            placeholder="Share your professional journey..."
          />
        ) : (
          <p>{profileData.careerJourney}</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">⭐</span>
          Areas of Expertise
        </h3>
        {isEditing ? (
          <input
            type="text"
            value={profileData.expertise.join(', ')}
            onChange={(e) => handleArrayInputChange('expertise', e.target.value)}
            className="form-input"
            placeholder="Enter areas of expertise (comma-separated)"
          />
        ) : (
          <div className="expertise-tags">
            {profileData.expertise.map((exp, index) => (
              <span key={index} className="expertise-tag">
                <span>⭐</span> {exp}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">📚</span>
          Teaching Style
        </h3>
        {isEditing ? (
          <input
            type="text"
            value={profileData.teachingStyle.join(', ')}
            onChange={(e) => handleArrayInputChange('teachingStyle', e.target.value)}
            className="form-input"
            placeholder="Enter teaching style points (comma-separated)"
          />
        ) : (
          <ul className="teaching-style-list">
            {profileData.teachingStyle.map((style, index) => (
              <li key={index} className="list-item">
                <span className="item-icon">📚</span>
                {style}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">📝</span>
          Sample Topics
        </h3>
        {isEditing ? (
          <input
            type="text"
            value={profileData.sampleTopics.join(', ')}
            onChange={(e) => handleArrayInputChange('sampleTopics', e.target.value)}
            className="form-input"
            placeholder="Enter sample topics (comma-separated)"
          />
        ) : (
          <ul className="topics-list">
            {profileData.sampleTopics.map((topic, index) => (
              <li key={index} className="list-item">
                <span className="item-icon">📝</span>
                {topic}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">
          <span className="section-icon">📞</span>
          Contact Information
        </h3>
        {isEditing ? (
          <div className="form-group">
            <input
              type="email"
              value={profileData.contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
              className="form-input"
              placeholder="Academic Email"
            />
            <input
              type="text"
              value={profileData.contactInfo.office}
              onChange={(e) => handleContactInfoChange('office', e.target.value)}
              className="form-input"
              placeholder="Office Location"
            />
            <input
              type="text"
              value={profileData.contactInfo.officeHours}
              onChange={(e) => handleContactInfoChange('officeHours', e.target.value)}
              className="form-input"
              placeholder="Office Hours"
            />
          </div>
        ) : (
          <ul className="contact-list">
            {profileData.contactInfo.email && (
              <li className="list-item">
                <span className="item-icon">📧</span>
                {profileData.contactInfo.email}
              </li>
            )}
            {profileData.contactInfo.office && (
              <li className="list-item">
                <span className="item-icon">🏢</span>
                {profileData.contactInfo.office}
              </li>
            )}
            {profileData.contactInfo.officeHours && (
              <li className="list-item">
                <span className="item-icon">⏰</span>
                {profileData.contactInfo.officeHours}
              </li>
            )}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="action-buttons">
          <button onClick={() => setIsEditing(false)} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LecturerProfile; 