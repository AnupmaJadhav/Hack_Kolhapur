import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MentorDirectory.css';

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Education Specialist",
    specialization: "Digital Literacy & Computer Science",
    experience: "12+ years in Education",
    languages: ["English", "Hindi"],
    availability: "Weekdays Evening",
    expertise: [
      "Basic Computer Skills",
      "Online Safety",
      "Digital Communication",
      "Career Guidance"
    ],
    bio: "Passionate about empowering rural girls through digital education and career mentoring."
  },
  {
    id: 2,
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Women's Rights Advocate",
    specialization: "Career Development & Leadership",
    experience: "8+ years in Social Work",
    languages: ["Hindi", "English", "Marathi"],
    availability: "Flexible Hours",
    expertise: [
      "Women Empowerment",
      "Leadership Skills",
      "Career Planning",
      "Self-Development"
    ],
    bio: "Dedicated to helping young women discover their potential and achieve their dreams."
  },
  {
    id: 3,
    name: "Meera Patel",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Rural Development Expert",
    specialization: "Skill Development & Entrepreneurship",
    experience: "10+ years in Rural Development",
    languages: ["Hindi", "Gujarati", "English"],
    availability: "Weekends",
    expertise: [
      "Entrepreneurship",
      "Financial Literacy",
      "Skill Development",
      "Rural Business"
    ],
    bio: "Helping rural communities grow through education and entrepreneurship development."
  },
  {
    id: 4,
    name: "Anjali Desai",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Agricultural Scientist",
    specialization: "Sustainable Farming & Technology",
    experience: "15+ years in Agricultural Science",
    languages: ["Hindi", "Gujarati", "English"],
    availability: "Morning Hours",
    expertise: [
      "Sustainable Farming",
      "Agricultural Technology",
      "Organic Farming",
      "Farm Management"
    ],
    bio: "Empowering rural communities with modern agricultural knowledge and sustainable practices."
  },
  {
    id: 5,
    name: "Dr. Lakshmi Rao",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Healthcare Educator",
    specialization: "Women's Health & Wellness",
    experience: "20+ years in Healthcare",
    languages: ["Telugu", "Hindi", "English"],
    availability: "Afternoons",
    expertise: [
      "Women's Health",
      "Nutrition Education",
      "Mental Health Awareness",
      "Community Health"
    ],
    bio: "Committed to improving rural healthcare awareness and women's wellness education."
  },
  {
    id: 6,
    name: "Ritu Verma",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Digital Marketing Expert",
    specialization: "Social Media & Online Business",
    experience: "7+ years in Digital Marketing",
    languages: ["Hindi", "English", "Punjabi"],
    availability: "Evening Hours",
    expertise: [
      "Social Media Marketing",
      "Online Business Setup",
      "Digital Branding",
      "E-commerce Basics"
    ],
    bio: "Helping rural entrepreneurs establish their digital presence and grow their businesses online."
  },
  {
    id: 7,
    name: "Sunita Kumari",
    image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Handicraft Expert",
    specialization: "Traditional Arts & E-commerce",
    experience: "25+ years in Handicrafts",
    languages: ["Hindi", "Bhojpuri", "English"],
    availability: "Flexible Hours",
    expertise: [
      "Traditional Crafts",
      "Business Development",
      "Online Selling",
      "Quality Control"
    ],
    bio: "Preserving traditional arts while helping artisans reach global markets through digital platforms."
  },
  {
    id: 8,
    name: "Maya Reddy",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    profession: "Education Technology Specialist",
    specialization: "Remote Learning & Digital Tools",
    experience: "5+ years in EdTech",
    languages: ["Telugu", "English", "Hindi", "Kannada"],
    availability: "Weekends",
    expertise: [
      "Online Learning",
      "Educational Apps",
      "Digital Resources",
      "Study Skills"
    ],
    bio: "Making quality education accessible through technology and innovative learning solutions."
  }
];

const MentorDirectory = () => {
  const navigate = useNavigate();
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Get unique expertise areas from all mentors
  const expertiseAreas = [...new Set(mentors.flatMap(mentor => 
    mentor.expertise.map(exp => exp.toLowerCase())
  ))].sort();

  // Get unique languages from all mentors
  const languages = [...new Set(mentors.flatMap(mentor => 
    mentor.languages.map(lang => lang.toLowerCase())
  ))].sort();

  const handleRequestSession = (mentorId) => {
    navigate(`/booking/${mentorId}`);
  };

  // Filter mentors based on selected criteria
  const filteredMentors = mentors.filter(mentor => {
    const matchesExpertise = !selectedExpertise || 
      mentor.expertise.some(exp => exp.toLowerCase().includes(selectedExpertise.toLowerCase()));
    
    const matchesLanguage = !selectedLanguage ||
      mentor.languages.some(lang => lang.toLowerCase() === selectedLanguage.toLowerCase());
    
    return matchesExpertise && matchesLanguage;
  });

  return (
    <div className="mentor-directory">
      <div className="directory-header">
        <h1>Connect with Expert Mentors</h1>
        <p>Find guidance from experienced mentors who are passionate about supporting rural education and development</p>
      </div>

      <div className="mentor-filters">
        <select 
          className="filter-select"
          value={selectedExpertise}
          onChange={(e) => setSelectedExpertise(e.target.value)}
        >
          <option value="">All Expertise Areas</option>
          {expertiseAreas.map(expertise => (
            <option key={expertise} value={expertise}>
              {expertise.charAt(0).toUpperCase() + expertise.slice(1)}
            </option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map(language => (
            <option key={language} value={language}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredMentors.length === 0 ? (
        <div className="no-results">
          <p>No mentors found matching your criteria. Please try different filters.</p>
        </div>
      ) : (
        <div className="mentor-grid">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-image">
                <img src={mentor.image} alt={mentor.name} />
                <span className="availability-badge">{mentor.availability}</span>
              </div>
              
              <div className="mentor-info">
                <h2>{mentor.name}</h2>
                <p className="profession">{mentor.profession}</p>
                <p className="specialization">{mentor.specialization}</p>
                
                <div className="languages">
                  <h3>Languages</h3>
                  <div className="language-tags">
                    {mentor.languages.map((lang, index) => (
                      <span key={index} className="tag">{lang}</span>
                    ))}
                  </div>
                </div>

                <div className="expertise">
                  <h3>Areas of Expertise</h3>
                  <ul>
                    {mentor.expertise.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <p className="bio">{mentor.bio}</p>

                <button
                  className="request-session-btn"
                  onClick={() => handleRequestSession(mentor.id)}
                >
                  Request Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorDirectory; 