import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Left side - Keep minimal or empty */}
        <div className="footer-left">
          {/* Could add version info or leave empty */}
        </div>

        {/* Center - Minimal links */}
        <div className="footer-center">
          <nav className="footer-nav">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Report Bug</a>
          </nav>
        </div>

        {/* Right side - Empty for now */}
        <div className="footer-right">
          {/* Removed system status until we implement monitoring */}
        </div>
      </div>
    </footer>
  );
}
