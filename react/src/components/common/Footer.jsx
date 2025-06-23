// src/components/common/Footer.js
import React from 'react';
import '../../styles/common.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} SurveyX. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy test</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;