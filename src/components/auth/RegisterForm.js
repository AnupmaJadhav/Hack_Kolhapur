import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthForms.css';

const RegisterForm = ({ onSuccess }) => {
  const { register, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role is user (rural girl)
    fullName: '',
    phone: '',
    // Additional fields for mentors
    expertise: '',
    experience: '',
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error('Password should be at least 6 characters long');
      }

      // Prepare user data based on role
      const userData = {
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role
      };

      // Add mentor-specific fields if role is mentor
      if (formData.role === 'mentor') {
        userData.expertise = formData.expertise;
        userData.experience = formData.experience;
        userData.bio = formData.bio;
        userData.status = 'pending'; // Mentors need approval
      }

      await register(formData.email, formData.password, formData.role, userData);
      onSuccess?.();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register as {formData.role === 'mentor' ? 'a Mentor' : 'a User'}</h2>
      
      <div className="form-group">
        <label>
          I want to register as:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-control"
          >
            <option value="user">Rural Girl (User)</option>
            <option value="mentor">Mentor</option>
          </select>
        </label>
      </div>

      <div className="form-group">
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-control"
          />
        </label>
      </div>

      {formData.role === 'mentor' && (
        <>
          <div className="form-group">
            <label>
              Area of Expertise:
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
                className="form-control"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Years of Experience:
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="form-control"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                className="form-control"
                rows="4"
              />
            </label>
          </div>
        </>
      )}

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm; 