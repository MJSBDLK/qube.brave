import React from 'react';
import { usePathname } from 'next/navigation';

export default function Header({ onMenuToggle, sidebarOpen }) {
  const pathname = usePathname();
  
  // Get the page title based on the current route
  const getPageTitle = () => {
    if (pathname === '/') return 'qube.brave';
    if (pathname === '/ramps') return 'qube.brave/ramps';
    // Add more routes as needed
    return `qube.brave${pathname}`;
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Left side - Hamburger + Title */}
        <div className="header-left">
          <button 
            className="hamburger-btn" 
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <div className={`hamburger-icon ${sidebarOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <h1 className="brand-text">{getPageTitle()}</h1>
        </div>

        {/* Right side - Actions */}
        <div className="header-actions">
          <button className="header-btn" aria-label="Search">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          
          {/* User Profile - shown when we implement auth */}
          <div className="header-user" style={{ display: 'none' }}>
            <div className="user-avatar">Q</div>
            <div className="user-info">
              <div className="user-name">Quinn Davis</div>
              <div className="user-status">Online</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
