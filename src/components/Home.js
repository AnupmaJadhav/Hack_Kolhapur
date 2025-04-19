import React, { useState } from 'react';
import CourseList from './CourseList';
import AuthModal from './auth/AuthModal';
import heroImage from '../assets/hero-girl.svg';
import './Home.css';

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Empowering Rural Girls Through Digital Learning</h1>
            <p>Access quality education and skill development courses designed specifically for rural communities.</p>
            <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Girl learning on computer" />
          </div>
        </div>
      </div>

      <CourseList />

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p className="mission-description">Our mission is to make quality education accessible to everyone. We believe in the power of personalized learning and mentorship to transform lives and careers.</p>
        
        <div className="mission-cards">
          <div className="mission-card">
            <h3>Expert-Led Learning</h3>
            <p>Learn from industry professionals with years of real-world experience.</p>
          </div>
          <div className="mission-card">
            <h3>Personalized Guidance</h3>
            <p>Get one-on-one mentorship tailored to your learning goals.</p>
          </div>
          <div className="mission-card">
            <h3>Diverse Expertise</h3>
            <p>Access mentors across various fields of technology and design.</p>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
    </div>
  );
};

export default Home; 