import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import Header from './Header';
import './CourseList.css';

const CourseList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCourses = selectedCategory
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  return (
    <div>
      <Header onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="course-list">
        <h2>
          {selectedCategory ? `${selectedCategory} Courses` : 'All Available Courses'}
          <span className="course-count">({filteredCourses.length} courses)</span>
        </h2>
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
              <div className="course-info">
                <h3>{course.title}</h3>
                <div className="course-meta">
                  <span className="language">Language: {course.language}</span>
                  <span className="level">Level: {course.level}</span>
                </div>
                <p>{course.description}</p>
                <Link to={`/course/${course.id}`} className="course-button">
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <div className="no-courses">
            <p>No courses available in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList; 