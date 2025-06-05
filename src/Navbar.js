import React from 'react';
import AuthButtons from './AuthButtons';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Your other nav items */}
      <div className="nav-right">
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;