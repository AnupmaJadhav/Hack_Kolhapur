import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import About from './components/About';
import MentorDirectory from './components/mentorship/MentorDirectory';
import BookingPage from './components/mentorship/BookingPage';
import UserDashboard from './components/dashboard/UserDashboard';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import EntrepreneurshipHub from './components/entrepreneurship/EntrepreneurshipHub';
import SupportButton from './components/support/SupportButton.js';
import AddYourContent from './components/content/AddYourContent.js';

const AppContent = () => {
  const { showAuthModal, setShowAuthModal } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mentors" element={<MentorDirectory />} />
        <Route path="/booking/:mentorId" element={<BookingPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/entrepreneurship" element={<EntrepreneurshipHub />} />
        <Route path="/add-content" element={<AddYourContent />} />
      </Routes>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
      <SupportButton />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
