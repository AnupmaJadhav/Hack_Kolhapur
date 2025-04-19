import React from 'react';
import './UserDashboard.css';

// Mock user data (replace with actual API call)
const userData = {
  name: "Priya Sharma",
  role: "Student",
  email: "priya.sharma@example.com",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
  progress: 65,
  completedCourses: 3,
  totalCourses: 5,
  mentoringSessions: [
    {
      id: 1,
      mentorName: "Dr. Sarah Johnson",
      date: "2024-02-15",
      topic: "Digital Literacy Basics",
      status: "completed"
    },
    {
      id: 2,
      mentorName: "Priya Sharma",
      date: "2024-02-20",
      topic: "Career Planning Workshop",
      status: "completed"
    },
    {
      id: 3,
      mentorName: "Meera Patel",
      date: "2024-03-01",
      topic: "Entrepreneurship Basics",
      status: "upcoming"
    }
  ],
  certificates: [
    {
      id: 1,
      title: "Digital Literacy Fundamentals",
      issueDate: "2024-01-15",
      issuer: "Rural Education Initiative",
      image: "certificate-badge-1.png"
    },
    {
      id: 2,
      title: "Women's Leadership Program",
      issueDate: "2024-02-10",
      issuer: "Women Empowerment Council",
      image: "certificate-badge-2.png"
    }
  ]
};

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={userData.avatar} alt={userData.name} />
          </div>
          <div className="profile-info">
            <h1>{userData.name}</h1>
            <p className="role">{userData.role}</p>
            <p className="email">{userData.email}</p>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Progress Section */}
        <section className="progress-section dashboard-card">
          <h2>Learning Progress</h2>
          <div className="progress-stats">
            <div className="progress-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2b6cb0"
                  strokeWidth="2"
                  strokeDasharray={`${userData.progress}, 100`}
                />
                <text x="18" y="20.35" className="percentage">{userData.progress}%</text>
              </svg>
            </div>
            <div className="progress-details">
              <p>Completed Courses: {userData.completedCourses}</p>
              <p>Total Courses: {userData.totalCourses}</p>
            </div>
          </div>
        </section>

        {/* Mentorship History Section */}
        <section className="mentorship-section dashboard-card">
          <h2>Mentorship Sessions</h2>
          <div className="session-list">
            {userData.mentoringSessions.map(session => (
              <div key={session.id} className={`session-card ${session.status}`}>
                <div className="session-info">
                  <h3>{session.topic}</h3>
                  <p className="mentor">with {session.mentorName}</p>
                  <p className="date">{new Date(session.date).toLocaleDateString()}</p>
                </div>
                <span className="status-badge">{session.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates Section */}
        <section className="certificates-section dashboard-card">
          <h2>Certificates Earned</h2>
          <div className="certificate-grid">
            {userData.certificates.map(certificate => (
              <div key={certificate.id} className="certificate-card">
                <div className="certificate-icon">
                  🏆
                </div>
                <div className="certificate-info">
                  <h3>{certificate.title}</h3>
                  <p className="issuer">{certificate.issuer}</p>
                  <p className="date">Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                </div>
                <button className="view-certificate-btn">View Certificate</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard; 