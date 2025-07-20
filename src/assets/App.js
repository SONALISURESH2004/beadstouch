import "./App.css";
import React, { useState, useEffect } from 'react';
import QuizSection from './quizsection';
import Dashboard from './dashboard';
import Chatbot from './chatbot';
import FingerCounter from './FingerCounter'; // ✅ Import the new component

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = {
      username: "abacusLearner",
      joinDate: "June 2024",
      totalCourses: 7,
      completedCourses: 3,
      totalQuizzes: 15,
      completedQuizzes: 8,
      accuracy: 82,
      level: "Beginner"
    };

    setTimeout(() => {
      setUserData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <div className="navbar-brand slide-in-left">BeadsTouch</div>
        <ul className="nav-links">
          {['home', 'courses', 'quiz', 'chatbot', 'dashboard', 'fingercounter'].map(tab => (
            <li
              key={tab}
              className={activeTab === tab ? 'active pulse' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {{
                home: 'Home',
                courses: 'Courses',
                quiz: 'Quiz',
                chatbot: 'Math Helper',
                dashboard: 'Progress',
                fingercounter: 'Finger Counter'
              }[tab]}
            </li>
          ))}
        </ul>
        <div className="auth-buttons">
          <button onClick={() => openAuthModal('login')} className="auth-btn login-btn hover-grow">Login</button>
          <button onClick={() => openAuthModal('signup')} className="auth-btn signup-btn hover-grow">Sign Up</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="home-section fade-in">
            <h1 className="slide-in-top">Welcome to the Playground of Abacus</h1>
            <p className="slide-in-bottom">Learn and skill up with us, one bead at a time!!</p>
            <button className="cta-button hover-grow">Get Started</button>

            <section className="purpose-section">
              <h1 className="slide-in-left">Purpose</h1>
              <p className="slide-in-right">
                Our website is designed to make abacus learning accessible, fun, and interactive for kids and beginners.
                Whether you're a parent, teacher, or student, our digital abacus tools and games help sharpen mental math skills with ease.
              </p>
              <button className="cta-button hover-grow">Explore Us</button>

              <div className="abacus-animation-container">
                <div className="abacus-beads">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bead bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>

              <section className="benefits-section slide-in-bottom">
                <h2>Why Learn Abacus?</h2>
                <p>
                  Abacus is a proven tool to enhance concentration, memory, and calculation speed.
                  It's especially helpful for children in building a strong foundation in arithmetic.
                </p>
              </section>

              <section className="feedback-section slide-in-top">
                <h2>We Value Your Feedback</h2>
                <p>Your thoughts help us make abacus learning more fun and effective. Share your experience below!</p>
                <form className="feedback-form">
                  <input type="text" placeholder="Your Name" className="feedback-input" required />
                  <select className="feedback-input">
                    <option value="">Rate Us</option>
                  </select>
                </form>
              </section>
            </section>
          </div>
        )}

        {activeTab === 'quiz' && <QuizSection />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'chatbot' && <Chatbot />}
        {activeTab === 'fingercounter' && <FingerCounter />} {/* ✅ New Finger Counter section */}
      </main>
    </div>
  );
};

export default App;
