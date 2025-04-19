import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../data/courses';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === parseInt(id));
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (!course) {
    return <div>Course not found</div>;
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
    const content = course.content[currentContentIndex];
    if (content.type === 'video') {
      return (
        <div className="video-container">
          <iframe
            src={content.url}
            title={content.title}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    } else if (content.type === 'pdf') {
      return (
        <div className="pdf-container">
          <embed src={content.url} type="application/pdf" width="100%" height="600px" />
        </div>
      );
    }
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
      <h1>{course.title}</h1>
      <div className="course-meta">
        <span className="language">Language: {course.language}</span>
        <span className="level">Level: {course.level}</span>
      </div>
      
      <div className="content-navigation">
        {course.content.map((item, index) => (
          <button
            key={index}
            className={`nav-button ${currentContentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentContentIndex(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="content-display">
        {renderContent()}
      </div>

      <div className="quiz-section">
        <h2>Course Quiz</h2>
        {renderQuiz()}
      </div>
    </div>
  );
};

export default CourseDetail; 