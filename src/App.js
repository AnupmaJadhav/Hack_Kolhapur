import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import SupportButton from './components/support/SupportButton';
import AddContent from './components/lecturer/AddContent';
import LecturerProfile from './components/lecturer/LecturerProfile';

// Protected Route Component
const ProtectedRoute = ({ element, allowedRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Error Boundary Component
class ErrorBoundaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', margin: '20px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <h2>Something went wrong</h2>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const { showAuthModal, setShowAuthModal } = useAuth();

  return (
    <div className="App">
      <ErrorBoundaryComponent>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/mentors" 
            element={
              <ProtectedRoute 
                element={<MentorDirectory />} 
                allowedRole="user" 
              />
            } 
          />
          <Route 
            path="/booking/:mentorId" 
            element={
              <ProtectedRoute 
                element={<BookingPage />} 
                allowedRole="user" 
              />
            } 
          />
          <Route 
            path="/entrepreneurship" 
            element={
              <ProtectedRoute 
                element={<EntrepreneurshipHub />} 
                allowedRole="user" 
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={<UserDashboard />} allowedRole="user" />} 
          />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route 
            path="/add-content" 
            element={<ProtectedRoute element={<AddContent />} allowedRole="lecturer" />} 
          />
          <Route 
            path="/lecturer-profile" 
            element={<ProtectedRoute element={<LecturerProfile />} allowedRole="lecturer" />} 
          />
        </Routes>

        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        )}
        <SupportButton />
      </ErrorBoundaryComponent>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ErrorBoundaryComponent>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundaryComponent>
    </Router>
  );
};

export default App;
