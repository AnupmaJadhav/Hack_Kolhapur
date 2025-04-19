import React, { useState } from 'react';
import './MentorList.css';

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Senior Data Scientist",
    specialization: "Machine Learning & AI",
    experience: "12+ years in Data Science",
    courses: [
      "Introduction to Machine Learning",
      "Advanced Neural Networks",
      "Data Visualization Mastery"
    ],
    availability: "Available for mentoring"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Software Architect",
    specialization: "Cloud Computing & DevOps",
    experience: "15+ years in Software Development",
    courses: [
      "Cloud Architecture Fundamentals",
      "Microservices Design Patterns",
      "DevOps Best Practices"
    ],
    availability: "Limited availability"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "UX/UI Design Lead",
    specialization: "User Experience & Interface Design",
    experience: "8+ years in Design",
    courses: [
      "UX Research Methods",
      "Design Systems",
      "Prototyping with Figma"
    ],
    availability: "Available for mentoring"
  }
];

const MentorList = () => {
  const [connectionRequests, setConnectionRequests] = useState(new Set());

  const handleConnect = (mentorId) => {
    setConnectionRequests(prev => {
      const newRequests = new Set(prev);
      newRequests.add(mentorId);
      return newRequests;
    });
  };

  return (
    <section className="mentor-section">
      <div className="mentor-header">
        <h2>Connect with Expert Mentors</h2>
        <p>Learn from industry professionals who are passionate about sharing their knowledge and experience</p>
      </div>
      
      <div className="mentor-grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-image">
              <img src={mentor.image} alt={mentor.name} />
              <span className="availability-badge">{mentor.availability}</span>
            </div>
            
            <div className="mentor-info">
              <h3>{mentor.name}</h3>
              <p className="profession">{mentor.profession}</p>
              <p className="specialization">{mentor.specialization}</p>
              <p className="experience">{mentor.experience}</p>
              
              <div className="courses-section">
                <strong>Courses & Content:</strong>
                <ul>
                  {mentor.courses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              </div>

              <button
                className={`connect-button ${connectionRequests.has(mentor.id) ? 'requested' : ''}`}
                onClick={() => handleConnect(mentor.id)}
                disabled={connectionRequests.has(mentor.id)}
              >
                {connectionRequests.has(mentor.id) 
                  ? 'Request Sent' 
                  : 'Send Request to Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorList; 