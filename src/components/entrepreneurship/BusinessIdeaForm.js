import React, { useState } from 'react';
import './BusinessIdeaForm.css';

const BusinessIdeaForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    targetMarket: '',
    requiredResources: '',
    expectedCost: '',
    timeline: '',
    challenges: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="success-message">
        <h2>🎉 Thank you for submitting your business idea!</h2>
        <p>Our team will review your proposal and provide feedback soon.</p>
        <button onClick={() => setIsSubmitted(false)} className="submit-another-btn">
          Submit Another Idea
        </button>
      </div>
    );
  }

  return (
    <div className="business-idea-form">
      <h2>Submit Your Business Idea</h2>
      <p className="form-description">
        Share your business idea with us and receive expert feedback to help you get started.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Business Idea Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Give your business idea a catchy name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Business Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="retail">Retail</option>
            <option value="services">Services</option>
            <option value="food">Food & Beverages</option>
            <option value="handicrafts">Handicrafts</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Business Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your business idea in detail"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetMarket">Target Market</label>
          <textarea
            id="targetMarket"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            required
            placeholder="Who are your potential customers?"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="requiredResources">Required Resources</label>
          <textarea
            id="requiredResources"
            name="requiredResources"
            value={formData.requiredResources}
            onChange={handleChange}
            required
            placeholder="What resources (equipment, skills, etc.) will you need?"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedCost">Expected Initial Investment</label>
          <input
            type="text"
            id="expectedCost"
            name="expectedCost"
            value={formData.expectedCost}
            onChange={handleChange}
            required
            placeholder="Estimated amount in INR"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeline">Implementation Timeline</label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
            placeholder="How long will it take to start? (e.g., 3 months)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="challenges">Anticipated Challenges</label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            required
            placeholder="What challenges do you expect to face?"
            rows="3"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Business Idea
        </button>
      </form>
    </div>
  );
};

export default BusinessIdeaForm; 