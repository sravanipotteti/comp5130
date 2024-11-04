import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1 className="logo">
        <span className="logo-main">PrivNote</span>
        </h1>
        <p className="tagline">Send notes that will self-destruct after being read.</p>
      </div>
    </header>
  );
};

export default Header;
