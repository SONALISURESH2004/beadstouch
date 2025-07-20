import React, { useState } from 'react';
import AuthModal from './AuthModal';

const AuthButtons = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const openLogin = () => {
    setIsLogin(true);
    setShowModal(true);
  };

  const openSignup = () => {
    setIsLogin(false);
    setShowModal(true);
  };

  return (
    <div className="auth-buttons">
      <button onClick={openLogin} className="login-button">
        Login
      </button>
      <button onClick={openSignup} className="signup-button">
        Sign Up
      </button>
      
      {showModal && (
        <AuthModal 
          isLogin={isLogin} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default AuthButtons;