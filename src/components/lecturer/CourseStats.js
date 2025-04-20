import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { ref, query, orderByChild, get } from 'firebase/database';
import { database } from '../../firebase/config';
import './CourseStats.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TIME_PERIODS = {
  WEEK: '7 Days',
  MONTH: '30 Days',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  YEAR: '1 Year'
};

const CourseStats = ({ userId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS.MONTH);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalViews: 0,
    averageRating: 0,
    completionRate: 0,
    recentCourses: [],
    categoryDistribution: {}
  });

  const getDaysForPeriod = (period) => {
    switch (period) {
      case TIME_PERIODS.WEEK:
        return 7;
      case TIME_PERIODS.MONTH:
        return 30;
      case TIME_PERIODS.THREE_MONTHS:
        return 90;
      case TIME_PERIODS.SIX_MONTHS:
        return 180;
      case TIME_PERIODS.YEAR:
        return 365;
      default:
        return 30;
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const contentRef = ref(database, 'content');
        const contentQuery = query(contentRef, orderByChild('authorId'));
        const snapshot = await get(contentQuery);
        
        if (snapshot.exists()) {
          const courses = [];
          const categories = {};
          let totalViews = 0;
          let totalRating = 0;
          let ratedCourses = 0;
          let completedCourses = 0;

          snapshot.forEach((childSnapshot) => {
            const course = childSnapshot.val();
            if (course.contentType === 'course') {
              courses.push({
                ...course,
                createdAt: new Date(course.createdAt)
              });

              // Calculate statistics
              totalViews += course.views || 0;
              if (course.rating) {
                totalRating += course.rating;
                ratedCourses++;
              }
              if (course.completionRate) {
                completedCourses += course.completionRate;
              }
              
              // Category distribution
              if (course.category) {
                categories[course.category] = (categories[course.category] || 0) + 1;
              }
            }
          });

          // Sort courses by date for recent courses
          const recentCourses = [...courses]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

          setStats({
            totalCourses: courses.length,
            totalViews,
            averageRating: ratedCourses ? (totalRating / ratedCourses).toFixed(1) : 0,
            completionRate: courses.length ? (completedCourses / courses.length).toFixed(1) : 0,
            recentCourses,
            categoryDistribution: categories
          });

          // Process time period data
          const days = getDaysForPeriod(selectedPeriod);
          const lastDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);
          
          const stats = Array(days).fill(0);
          
          courses.forEach(course => {
            if (course.createdAt >= startDate) {
              const dayIndex = days - 1 - Math.floor((lastDate - course.createdAt) / (1000 * 60 * 60 * 24));
              if (dayIndex >= 0 && dayIndex < days) {
                stats[dayIndex]++;
              }
            }
          });

          setChartData(stats);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [userId, selectedPeriod]);

  const getDateLabels = (days) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(days > 90 && { year: '2-digit' })
      });
    });
  };

  const combinedChartData = {
    labels: getDateLabels(getDaysForPeriod(selectedPeriod)),
    datasets: [
      {
        label: `Course Uploads (${selectedPeriod})`,
        data: chartData,
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            return `Uploads: ${context.parsed.y} courses`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          },
          autoSkip: true,
          maxTicksLimit: 20
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return <div className="stats-loading">Loading statistics...</div>;
  }

  return (
    <div className="course-stats">
      {/* Quick Stats Section */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h4>Total Courses</h4>
            <div className="stat-value">{stats.totalCourses}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h4>Total Views</h4>
            <div className="stat-value">{stats.totalViews}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h4>Average Rating</h4>
            <div className="stat-value">{stats.averageRating}/5</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h4>Completion Rate</h4>
            <div className="stat-value">{stats.completionRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="stats-card main-chart">
        <div className="stats-header">
          <h3>Course Statistics</h3>
          <select 
            className="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {Object.values(TIME_PERIODS).map((period) => (
              <option key={period} value={period}>
                Last {period}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          <Line data={combinedChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Courses Section */}
      <div className="stats-row">
        <div className="stats-card recent-courses">
          <h3>Recent Courses</h3>
          <div className="course-list">
            {stats.recentCourses.map((course, index) => (
              <div key={index} className="recent-course-item">
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <p>{new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="course-stats">
                  <span>👁️ {course.views || 0}</span>
                  <span>⭐ {course.rating || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution Section */}
        <div className="stats-card category-distribution">
          <h3>Course Categories</h3>
          <div className="category-list">
            {Object.entries(stats.categoryDistribution).map(([category, count], index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count} courses</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{ 
                      width: `${(count / stats.totalCourses) * 100}%`,
                      backgroundColor: `hsl(${index * 50}, 70%, 60%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStats; 