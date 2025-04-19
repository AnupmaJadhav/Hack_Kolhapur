import React, { useState } from 'react';
import './EntrepreneurshipHub.css';
import BusinessIdeaForm from './BusinessIdeaForm';

const EntrepreneurshipHub = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const learningResources = [
    {
      title: 'Finance Basics',
      icon: '💰',
      resources: [
        {
          type: 'pdf',
          title: 'Understanding Basic Financial Concepts',
          url: '/resources/finance-basics.pdf',
          description: 'Learn about budgeting, revenue, expenses, and profit calculation.'
        },
        {
          type: 'video',
          title: 'Managing Business Finances',
          url: '/resources/finance-video.mp4',
          description: 'Step-by-step guide on managing your business finances.'
        },
        {
          type: 'pdf',
          title: 'Financial Planning Template',
          url: '/resources/financial-template.pdf',
          description: 'Ready-to-use template for business financial planning.'
        },
        {
          type: 'link',
          title: 'Tax Basics for Small Businesses',
          url: '/resources/tax-guide',
          description: 'Essential tax knowledge for new entrepreneurs.'
        }
      ]
    },
    {
      title: 'Setting Up Shop',
      icon: '🏪',
      resources: [
        {
          type: 'pdf',
          title: 'Shop Setup Guide',
          url: '/resources/shop-setup.pdf',
          description: 'Complete guide on setting up your first shop.'
        },
        {
          type: 'video',
          title: 'Location Selection Tips',
          url: '/resources/location-tips.mp4',
          description: 'How to choose the perfect location for your business.'
        },
        {
          type: 'pdf',
          title: 'Legal Requirements Checklist',
          url: '/resources/legal-checklist.pdf',
          description: 'Essential legal requirements for starting a business.'
        },
        {
          type: 'video',
          title: 'Inventory Management Basics',
          url: '/resources/inventory-basics.mp4',
          description: 'Learn how to manage your shop inventory effectively.'
        }
      ]
    },
    {
      title: 'Government Schemes',
      icon: '📜',
      resources: [
        {
          type: 'pdf',
          title: 'Government Support Programs',
          url: '/resources/govt-schemes.pdf',
          description: 'Overview of government schemes for women entrepreneurs.'
        },
        {
          type: 'link',
          title: 'Official Government Portal',
          url: 'https://www.startupindia.gov.in/content/sih/en/women-entrepreneurs.html',
          description: 'Direct link to government resources and applications.'
        },
        {
          type: 'pdf',
          title: 'Scheme Application Guide',
          url: '/resources/scheme-application.pdf',
          description: 'Step-by-step guide to applying for government schemes.'
        }
      ]
    },
    {
      title: 'Digital Marketing',
      icon: '📱',
      resources: [
        {
          type: 'video',
          title: 'Social Media Marketing Basics',
          url: '/resources/social-media-marketing.mp4',
          description: 'Learn how to promote your business on social media.'
        },
        {
          type: 'pdf',
          title: 'Digital Marketing Strategy Guide',
          url: '/resources/digital-marketing.pdf',
          description: 'Comprehensive guide to digital marketing for small businesses.'
        },
        {
          type: 'link',
          title: 'Online Presence Checklist',
          url: '/resources/online-checklist',
          description: 'Essential steps to establish your business online.'
        }
      ]
    }
  ];

  const microLoanPortals = [
    {
      name: 'Mudra Loan Scheme',
      description: 'Government-backed loans for micro enterprises',
      url: 'https://www.mudra.org.in',
      maxAmount: '₹10,00,000',
      eligibility: 'Women entrepreneurs aged 18-65 years',
      interestRate: '8-12% per annum'
    },
    {
      name: 'SIDBI Portal',
      description: 'Small Industries Development Bank of India',
      url: 'https://www.sidbi.in',
      maxAmount: '₹25,00,000',
      eligibility: 'Small and medium enterprises',
      interestRate: '10-13% per annum'
    },
    {
      name: 'Mahila Udyam Nidhi',
      description: 'Special scheme for women entrepreneurs',
      url: 'https://www.sidbi.in/en/products',
      maxAmount: '₹15,00,000',
      eligibility: 'Women-owned businesses',
      interestRate: '9-11% per annum'
    },
    {
      name: 'Stand-Up India',
      description: 'Empowering women and SC/ST entrepreneurs',
      url: 'https://www.standupmitra.in',
      maxAmount: '₹1,00,00,000',
      eligibility: 'Women and SC/ST entrepreneurs',
      interestRate: '8-11% per annum'
    }
  ];

  const successStories = [
    {
      name: "Priya's Handicrafts",
      description: "Started with a small loan of ₹50,000, now running a successful handicraft export business.",
      revenue: "₹25 lakhs annually",
      journey: "From home-based business to international exports",
      tips: ["Start small but dream big", "Focus on quality", "Build strong networks"]
    },
    {
      name: "Green Foods Co-op",
      description: "A women's cooperative selling organic products, started by 5 friends.",
      revenue: "₹15 lakhs annually",
      journey: "Local farmer's market to retail chain supplies",
      tips: ["Collaborate with others", "Understand your market", "Maintain consistency"]
    },
    {
      name: "Tech Training Center",
      description: "Digital skills training center for rural women.",
      revenue: "₹40 lakhs annually",
      journey: "Single classroom to multiple centers across district",
      tips: ["Identify local needs", "Invest in quality equipment", "Build community trust"]
    }
  ];

  return (
    <div className="entrepreneurship-hub">
      <header className="hub-header">
        <h1>Entrepreneurship Hub</h1>
        <p>Your gateway to starting and growing your own business</p>
      </header>

      <nav className="hub-navigation">
        <button 
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-button ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Learning Resources
        </button>
        <button 
          className={`nav-button ${activeTab === 'submit-idea' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit-idea')}
        >
          Submit Business Idea
        </button>
        <button 
          className={`nav-button ${activeTab === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          Microloan Portals
        </button>
        <button 
          className={`nav-button ${activeTab === 'success-stories' ? 'active' : ''}`}
          onClick={() => setActiveTab('success-stories')}
        >
          Success Stories
        </button>
      </nav>

      <div className="hub-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Welcome to the Entrepreneurship Hub</h2>
            <p>This platform is designed to help you start and grow your own business. We provide:</p>
            <ul>
              <li>Comprehensive learning resources on business fundamentals</li>
              <li>Step-by-step guides for setting up your business</li>
              <li>Access to government schemes and support programs</li>
              <li>Microloan opportunities with detailed eligibility criteria</li>
              <li>Business idea submission and expert feedback</li>
              <li>Digital marketing and online presence guidance</li>
              <li>Inspiring success stories from women entrepreneurs</li>
              <li>Network building opportunities with other entrepreneurs</li>
            </ul>
            <div className="quick-stats">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Successful Businesses</p>
              </div>
              <div className="stat-item">
                <h3>₹2Cr+</h3>
                <p>Loans Facilitated</p>
              </div>
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Women Empowered</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            {learningResources.map((category, index) => (
              <div key={index} className="resource-category">
                <h2>{category.icon} {category.title}</h2>
                <div className="resource-grid">
                  {category.resources.map((resource, idx) => (
                    <div key={idx} className="resource-card">
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                         className="resource-link">
                        {resource.type === 'pdf' ? '📄 View PDF' :
                         resource.type === 'video' ? '🎥 Watch Video' :
                         '🔗 Visit Link'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submit-idea' && (
          <BusinessIdeaForm />
        )}

        {activeTab === 'loans' && (
          <div className="loans-section">
            <h2>Microloan Opportunities</h2>
            <div className="loan-portal-grid">
              {microLoanPortals.map((portal, index) => (
                <div key={index} className="loan-card">
                  <h3>{portal.name}</h3>
                  <p>{portal.description}</p>
                  <div className="loan-details">
                    <p className="loan-amount">Maximum amount: {portal.maxAmount}</p>
                    <p className="loan-eligibility">Eligibility: {portal.eligibility}</p>
                    <p className="loan-interest">Interest Rate: {portal.interestRate}</p>
                  </div>
                  <a href={portal.url} target="_blank" rel="noopener noreferrer" 
                     className="loan-link">
                    Visit Portal
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'success-stories' && (
          <div className="success-stories-section">
            <h2>Success Stories</h2>
            <div className="stories-grid">
              {successStories.map((story, index) => (
                <div key={index} className="story-card">
                  <h3>{story.name}</h3>
                  <p className="story-description">{story.description}</p>
                  <div className="story-details">
                    <p className="story-revenue">Annual Revenue: {story.revenue}</p>
                    <p className="story-journey">{story.journey}</p>
                  </div>
                  <div className="story-tips">
                    <h4>Key Tips:</h4>
                    <ul>
                      {story.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurshipHub; 