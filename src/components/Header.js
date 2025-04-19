import React from 'react';
import './Header.css';

const Header = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    'Digital Literacy',
    'Entrepreneurship',
    'Handicrafts & Arts',
    'Agriculture & Sustainability',
    'Health & Wellness',
    'Financial Skills',
    'Language Learning',
    'Leadership & Communication'
  ];

  return (
    <div className="header">
      <div className="header-content">
        <h1>Empowering Rural Girls Through Skills</h1>
        <p>Access quality education and skill development courses designed specifically for rural girls to build a brighter future.</p>
      </div>
      <div className="categories">
        <nav>
          <button 
            className={`category-button ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategorySelect(null)}
          >
            All Courses
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header; 