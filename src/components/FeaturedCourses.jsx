import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaClock, FaEye, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import './FeaturedCourses.css';

const FeaturedCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const featuredCourses = [
    {
      id: 1,
      title: 'Digital Skills for Women Entrepreneurs',
      instructor: 'Sarah Johnson',
      instructorTitle: 'Digital Marketing Expert & Women Entrepreneurship Coach',
      rating: 4.9,
      reviews: 850,
      students: 5200,
      duration: '6 weeks',
      hours: '30 hours',
      level: 'Beginner',
      views: 12000,
      image: 'https://images.unsplash.com/photo-1571624436279-b272aff752b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Digital Skills',
      description: 'Master essential digital skills for business success. Learn social media marketing, e-commerce, and online business management.',
      skills: ['Social Media Marketing', 'E-commerce', 'Digital Marketing', 'Business Planning', 'Online Branding'],
      certificate: true
    },
    {
      id: 2,
      title: 'Financial Literacy for Women',
      instructor: 'Maria Garcia',
      instructorTitle: 'Financial Advisor & Women Empowerment Advocate',
      rating: 4.8,
      reviews: 720,
      students: 4800,
      duration: '8 weeks',
      hours: '40 hours',
      level: 'Beginner',
      views: 15000,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Finance',
      description: 'Build strong financial foundations. Learn budgeting, investing, and business financial management tailored for women entrepreneurs.',
      skills: ['Budgeting', 'Investment Planning', 'Financial Management', 'Risk Assessment', 'Business Finance'],
      certificate: true
    },
    {
      id: 3,
      title: 'Women in Tech: Coding Fundamentals',
      instructor: 'Emily Chen',
      instructorTitle: 'Senior Software Engineer & Tech Mentor',
      rating: 4.9,
      reviews: 650,
      students: 3800,
      duration: '10 weeks',
      hours: '50 hours',
      level: 'Beginner',
      views: 11000,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Technology',
      description: 'Start your journey in tech. Learn programming basics, web development, and gain confidence in the tech industry.',
      skills: ['HTML/CSS', 'JavaScript', 'Web Development', 'Problem Solving', 'Git Basics'],
      certificate: true
    },
    {
      id: 4,
      title: 'Leadership Skills for Women',
      instructor: 'Dr. Lisa Thompson',
      instructorTitle: 'Leadership Coach & DEI Consultant',
      rating: 4.8,
      reviews: 580,
      students: 3500,
      duration: '6 weeks',
      hours: '30 hours',
      level: 'Intermediate',
      views: 9000,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Leadership',
      description: 'Develop essential leadership skills. Master communication, team management, and confidence building in professional settings.',
      skills: ['Leadership', 'Communication', 'Team Management', 'Negotiation', 'Public Speaking'],
      certificate: true
    },
    {
      id: 5,
      title: 'Rural Business Development',
      instructor: 'Priya Patel',
      instructorTitle: 'Rural Development Expert & Social Entrepreneur',
      rating: 4.7,
      reviews: 420,
      students: 2800,
      duration: '8 weeks',
      hours: '40 hours',
      level: 'Beginner',
      views: 8500,
      image: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Entrepreneurship',
      description: 'Learn to start and grow businesses in rural areas. Focus on local resources, community engagement, and sustainable practices.',
      skills: ['Business Planning', 'Community Development', 'Resource Management', 'Marketing', 'Sustainability'],
      certificate: true
    },
    {
      id: 6,
      title: 'Digital Literacy Fundamentals',
      instructor: 'Amanda Rodriguez',
      instructorTitle: 'Digital Education Specialist',
      rating: 4.9,
      reviews: 890,
      students: 6200,
      duration: '4 weeks',
      hours: '20 hours',
      level: 'Beginner',
      views: 16000,
      image: 'https://images.unsplash.com/photo-1573496799515-eebf6a3f03d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Digital Skills',
      description: 'Master basic digital skills essential for today\'s world. Learn computer basics, internet usage, and online safety.',
      skills: ['Computer Basics', 'Internet Skills', 'Online Safety', 'Email Communication', 'Digital Tools'],
      certificate: true
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setCourses(featuredCourses);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>Empowering Courses</h2>
            <p>Discover courses designed to empower women in digital skills, entrepreneurship, and leadership</p>
          </div>
          <div className="courses-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="course-card loading">
                <div className="course-image loading"></div>
                <div className="course-content">
                  <div className="course-title loading"></div>
                  <div className="instructor-info loading"></div>
                  <div className="course-description loading"></div>
                  <div className="course-meta loading"></div>
                  <div className="skills-tags loading"></div>
                  <div className="course-footer loading"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-courses">
      <div className="container">
        <div className="section-header">
          <h2>Empowering Courses</h2>
          <p>Discover courses designed to empower women in digital skills, entrepreneurship, and leadership</p>
        </div>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <span className="category-badge">{course.category}</span>
                <span className="level-badge">{course.level}</span>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="instructor-info">
                  <p className="instructor-name">By {course.instructor}</p>
                  <p className="instructor-title">{course.instructorTitle}</p>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <div className="meta-item">
                    <FaStar className="meta-icon" />
                    <span>{course.rating} ({course.reviews} reviews)</span>
                  </div>
                  <div className="meta-item">
                    <FaUsers className="meta-icon" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{course.duration} • {course.hours}</span>
                  </div>
                  <div className="meta-item">
                    <FaEye className="meta-icon" />
                    <span>{course.views} views</span>
                  </div>
                </div>
                <div className="skills-tags">
                  {course.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="course-footer">
                  {course.certificate && (
                    <div className="certificate-badge">
                      <FaCertificate className="certificate-icon" />
                      <span>Certificate Available</span>
                    </div>
                  )}
                  <Link to={`/course/${course.id}`} className="view-course-btn">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses; 