import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { FaCalendar, FaClock, FaBook, FaStar, FaUser, FaGraduationCap, FaQuestionCircle, FaLock } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { ref, get } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = ref(db, `courses/${courseId}`);
        const snapshot = await get(courseRef);
        
        if (snapshot.exists()) {
          setCourse(snapshot.val());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading || userLoading) {
    return <div className="course-detail-loading">Loading course details...</div>;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div className="auth-required">
        <FaLock className="lock-icon" />
        <h2>Authentication Required</h2>
        <p>Please log in to view course details</p>
        <button 
          className="login-button"
          onClick={() => navigate('/login', { state: { from: `/course/${courseId}` } })}
        >
          Log In to Continue
        </button>
      </div>
    );
  }

  if (!course) {
    return <div className="course-detail">Course not found</div>;
  }

  // Sample session times (you can replace these with actual data from your database)
  const sessions = [
    { id: 1, time: '10:00 AM - 11:30 AM', day: 'Monday', topic: 'Introduction' },
    { id: 2, time: '2:00 PM - 3:30 PM', day: 'Wednesday', topic: 'Core Concepts' },
    { id: 3, time: '10:00 AM - 11:30 AM', day: 'Friday', topic: 'Advanced Topics' },
  ];

  // Sample quiz information
  const quizzes = [
    { id: 1, title: 'Module 1 Assessment', questions: 15, duration: '30 mins' },
    { id: 2, title: 'Mid-Course Evaluation', questions: 20, duration: '45 mins' },
    { id: 3, title: 'Final Assessment', questions: 30, duration: '60 mins' },
  ];

  // Sample success stories
  const successStories = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Tech Solutions Inc.',
      story: 'After completing this course, I landed my dream job as a senior developer.',
      image: 'https://source.unsplash.com/random/400x300?portrait=1'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'Innovation Labs',
      story: 'The skills I learned helped me start my own successful tech company.',
      image: 'https://source.unsplash.com/random/400x300?portrait=2'
    },
  ];

  const handleStartCourse = () => {
    // Navigate to course content or first lesson
    navigate(`/course/${courseId}/learn`);
  };

  return (
    <div className="course-detail">
      <header className="course-header">
        <h1>{course.title}</h1>
        <div className="course-meta">
          <span><FaUser /> {course.instructor}</span>
          <span><FaStar /> {course.rating} Rating</span>
          <span><FaGraduationCap /> {course.enrolled || 0} Students</span>
          <span><FaClock /> {course.duration}</span>
        </div>
        <button className="start-course-button" onClick={handleStartCourse}>
          Start Course
        </button>
      </header>

      <div className="course-content">
        <section className="mentor-section">
          <h2>Meet Your Mentor</h2>
          <div className="mentor-profile">
            <img 
              src={course.instructorImage || 'https://source.unsplash.com/random/400x400?portrait'} 
              alt={course.instructor} 
              className="mentor-image"
            />
            <div className="mentor-info">
              <h3>{course.instructor}</h3>
              <p className="mentor-title">{course.instructorTitle || 'Senior Instructor'}</p>
              <p className="mentor-bio">
                {course.instructorBio || 
                  'An experienced professional with over 10 years of industry experience, specializing in delivering high-quality educational content and mentoring students to achieve their career goals.'}
              </p>
            </div>
          </div>
        </section>

        <section className="session-section">
          <h2>Session Schedule</h2>
          <div className="session-grid">
            {sessions.map(session => (
              <div key={session.id} className="session-card">
                <FaCalendar className="session-icon" />
                <h4>{session.day}</h4>
                <p className="session-time">{session.time}</p>
                <p className="session-topic">{session.topic}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="quiz-section">
          <h2>Course Assessments</h2>
          <div className="quiz-grid">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <FaQuestionCircle className="quiz-icon" />
                <h4>{quiz.title}</h4>
                <p>{quiz.questions} Questions</p>
                <p>{quiz.duration}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="success-stories">
          <h2>Success Stories</h2>
          <div className="stories-grid">
            {successStories.map(story => (
              <div key={story.id} className="story-card">
                <img src={story.image} alt={story.name} className="story-image" />
                <div className="story-content">
                  <h4>{story.name}</h4>
                  <p className="business-name">{story.company}</p>
                  <p className="story-text">{story.story}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetail; 