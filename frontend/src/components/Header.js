import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1 className="logo">
        <span className="logo-main">SafeNotes</span>
        </h1>
        <p class= "tagline">Share. Secure. Self-Destruct.</p>
      </div>
    </header>
  );
};

export default Header;
