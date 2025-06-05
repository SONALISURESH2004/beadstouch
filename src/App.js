import "./App.css";
import React, { useState } from 'react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${authType} form submitted:`, formData);
    closeAuthModal();
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">BeadsTouch</div>
        <ul className="nav-links">
          <li 
            className={activeTab === 'home' ? 'active' : ''}
            onClick={() => setActiveTab('home')}
          >
            Home
          </li>
          <li 
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </li>
          <li 
            className={activeTab === 'quiz' ? 'active' : ''}
            onClick={() => setActiveTab('quiz')}
          >
            Quiz
          </li>
          <li 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
        </ul>
        
        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button 
            onClick={() => openAuthModal('login')} 
            className="auth-btn login-btn"
          >
            Login
          </button>
          <button 
            onClick={() => openAuthModal('signup')} 
            className="auth-btn signup-btn"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="home-section">
            <h1>Welcome to the playground of Abacus</h1>
            <p>Learn and skillup with us, one bead at a time!!</p>
            <button className="cta-button">Get Started</button>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>Our Molecules</h2>
            <div className="course-cards">
              <div className="course-card">
                <h3>Level-1</h3>
                <p>Play with abacus</p>
              </div>
              <div className="course-card">
                <h3>Level-2</h3>
                <p>Its 1 to 5</p>
              </div>
              <div className="course-card">
                <h3>Level-3</h3>
                <p>From 6 to 10</p>
              </div>
              <div className="course-card">
                <h3>Level-4</h3>
                <p>Digits and its rules</p>
              </div>
              <div className="course-card">
                <h3>Level-5</h3>
                <p>10's and 100's</p>
              </div>
              <div className="course-card">
                <h3>Level-6</h3>
                <p>Two digits</p>
              </div>
              <div className="course-card">
                <h3>Level-7</h3>
                <p>Three digits</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="quiz-section">
            <h2>Test Your Knowledge</h2>
            <div className="quiz-card">
              <p>Ready to challenge yourself?</p>
              <button className="quiz-button">Start Quiz</button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <h2>Progress</h2>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 BeadsTouch. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeAuthModal}>×</button>
            <h2>{authType === 'login' ? 'Login' : 'Sign Up'}</h2>
            
            <form onSubmit={handleSubmit}>
              {authType === 'signup' && (
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                {authType === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-switch">
              {authType === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setAuthType('signup')}
                    className="switch-btn"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setAuthType('login')}
                    className="switch-btn"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;