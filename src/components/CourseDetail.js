import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { lecturerId, courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchCourse = () => {
      const courseRef = ref(database, `courses/${lecturerId}/${courseId}`);
      
      onValue(courseRef, (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            setCourse(data);
          } else {
            setError('Course not found');
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching course:', err);
          setError('Failed to load course. Please try again later.');
          setLoading(false);
        }
      }, (error) => {
        console.error('Error fetching course:', error);
        setError('Failed to load course. Please try again later.');
        setLoading(false);
      });
    };

    if (lecturerId && courseId) {
      fetchCourse();
    }
  }, [lecturerId, courseId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error || 'Course not found'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const handleQuizStart = () => {
    setQuizStarted(true);
    setQuizAnswers(new Array(course.quiz.length).fill(null));
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    const correctAnswers = course.quiz.reduce((count, question, index) => {
      return count + (question.correctAnswer === quizAnswers[index] ? 1 : 0);
    }, 0);
    setScore((correctAnswers / course.quiz.length) * 100);
    setQuizCompleted(true);
  };

  const renderContent = () => {
    if (!course.content || course.content.length === 0) {
      return <div className="no-content">No content available for this course.</div>;
    }

    const content = course.content[currentContentIndex];
    if (content.type === 'video') {
      return (
        <div className="video-container">
          <video
            src={content.dataUrl}
            controls
            className="video-player"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (content.type === 'pdf') {
      return (
        <div className="pdf-container">
          <iframe
            src={content.dataUrl}
            title={content.title}
            className="pdf-viewer"
          />
        </div>
      );
    }
    return <div>Unsupported content type</div>;
  };

  const renderQuiz = () => {
    if (!quizStarted) {
      return (
        <button className="start-quiz-button" onClick={handleQuizStart}>
          Start Quiz
        </button>
      );
    }

    if (quizCompleted) {
      return (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <p>Your score: {score}%</p>
          {score >= 70 && (
            <button className="certificate-button" onClick={() => window.print()}>
              Download Certificate
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="quiz-container">
        {course.quiz.map((question, questionIndex) => (
          <div key={questionIndex} className="question">
            <h3>{question.question}</h3>
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option">
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    checked={quizAnswers[questionIndex] === optionIndex}
                    onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button 
          className="submit-quiz-button"
          onClick={handleQuizSubmit}
          disabled={quizAnswers.includes(null)}
        >
          Submit Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-meta">
          <span className="author">By: {course.authorName}</span>
          <span className="date">Added: {new Date(course.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="course-content">
        <div className="content-navigation">
          {course.content && course.content.map((item, index) => (
            <button
              key={index}
              className={`nav-button ${currentContentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentContentIndex(index)}
            >
              <span className="content-type-icon">
                {item.type === 'video' ? '🎥' : '📄'}
              </span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="content-display">
          {renderContent()}
        </div>

        <div className="content-description">
          {course.content && course.content[currentContentIndex] && (
            <>
              <h3>{course.content[currentContentIndex].title}</h3>
              <p>{course.content[currentContentIndex].description}</p>
            </>
          )}
        </div>
      </div>

      <div className="course-description">
        <h2>About this Course</h2>
        <p>{course.description}</p>
      </div>

      <div className="quiz-section">
        <h2>Course Quiz</h2>
        {renderQuiz()}
      </div>
    </div>
  );
};

export default CourseDetail; 