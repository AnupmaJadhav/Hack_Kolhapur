import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import Header from './Header';
import './CourseList.css';

const CourseList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = () => {
      const coursesRef = ref(database, 'courses');
      
      onValue(coursesRef, (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            // Transform the nested structure into a flat array of courses
            const coursesArray = Object.entries(data).flatMap(([lecturerId, lecturerCourses]) => 
              Object.entries(lecturerCourses).map(([courseId, course]) => ({
                id: courseId,
                lecturerId,
                ...course
              }))
            ).filter(course => course.status === 'published'); // Only show published courses
            setCourses(coursesArray);
          } else {
            setCourses([]);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError('Failed to load courses. Please try again later.');
          setLoading(false);
        }
      }, (error) => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      });
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
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
    <div className="course-list-container">
      <Header onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="course-list">
        <h2>
          {selectedCategory ? `${selectedCategory} Courses` : 'All Available Courses'}
          <span className="course-count">({filteredCourses.length} courses)</span>
        </h2>
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="default-thumbnail">
                    <span className="thumbnail-icon">📚</span>
                  </div>
                )}
              </div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <div className="course-meta">
                  <span className="author">By: {course.authorName}</span>
                  <span className="date">Added: {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-footer">
                  <span className="category-tag">{course.category}</span>
                  <Link to={`/course/${course.lecturerId}/${course.id}`} className="course-button">
                    View Course
                  </Link>
                </div>
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