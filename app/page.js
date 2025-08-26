// app/page.js
'use client'
import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedUpdate, setExpandedUpdate] = useState(null);

  const toggleSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleUpdate = (index) => {
    setExpandedUpdate(expandedUpdate === index ? null : index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updates = [
    {
      date: 'Dec 15, 2024',
      title: 'Gradient Ramps Tool Released',
      badge: 'New Tool',
      badgeType: 'teal',
      content: (
        <>
          <p className="text-body text-secondary u-mb-lg">
            Built a comprehensive gradient generation tool with multiple interpolation methods, custom color stops, and export options. Perfect for creating smooth color transitions for design work.
          </p>
          <div className="u-flex u-gap-md">
            <a href="/tools/gradient-ramps" className="c-button c-button--primary">Try It Out</a>
            <a href="#" className="c-button c-button--ghost">View Source</a>
          </div>
        </>
      )
    },
    {
      date: 'Dec 10, 2024',
      title: 'Design System Overhaul',
      badge: 'Enhancement',
      badgeType: 'gold',
      content: (
        <>
          <p className="text-body text-secondary u-mb-lg">
            Completely rebuilt the design system with a harmonious desaturated color palette inspired by River.com. Added comprehensive component library with proper dark theme support and smooth interactions.
          </p>
          <div className="u-flex u-gap-md">
            <a href="#" className="c-button c-button--ghost">View Documentation</a>
          </div>
        </>
      )
    },
    {
      date: 'Coming Soon',
      title: 'Brands Master Spreadsheet',
      badge: 'In Progress',
      badgeType: 'gold',
      content: (
        <p className="text-body text-secondary u-mb-lg">
          Working on a comprehensive brand tracking system with advanced search, filtering, and data visualization. Will include brand guidelines, asset libraries, and usage tracking.
        </p>
      )
    }
  ];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#f8f9fa',
      backgroundColor: '#0a0e1a',
      minHeight: '100vh',
      display: 'flex'
    }}>
      <style jsx>{`
        :root {
          --color-primary: #6b73a3;
          --color-primary-hover: #4a5178;
          --color-secondary: #5a9b94;
          --color-accent: #d4af37;
          --color-accent-soft: #f6d186;
          
          --bg-primary: #0a0e1a;
          --bg-secondary: #111827;
          --bg-tertiary: #1f2937;
          --bg-elevated: #374151;
          
          --text-primary: #f8f9fa;
          --text-secondary: #e9ecef;
          --text-muted: #9ca3af;
          --text-subtle: #6b7280;
          
          --border-primary: #374151;
          --border-secondary: #4b5563;
          --border-accent: #6b73a3;
          
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          
          --space-xs: 0.25rem;
          --space-sm: 0.5rem;
          --space-md: 1rem;
          --space-lg: 1.5rem;
          --space-xl: 2rem;
          --space-2xl: 3rem;
          --space-3xl: 4rem;
          
          --radius-sm: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --radius-xl: 0.75rem;
          --radius-full: 9999px;
          
          --transition-fast: 150ms ease-out;
          --transition-normal: 250ms ease-out;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Typography */
        .text-display {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .text-title-2 {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.25;
        }

        .text-title-3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .text-body {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.6;
        }

        .text-body-sm {
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
        }

        .text-caption {
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: 0.025em;
        }

        /* Text Colors */
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        .text-teal { color: #5a9b94; }
        .text-gold { color: #d4af37; }

        /* Layout */
        .sidebar {
          width: 280px;
          min-height: 100vh;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-primary);
          padding: var(--space-xl);
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
          z-index: 100;
          transition: transform var(--transition-normal);
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: var(--space-2xl);
          max-width: 1200px;
        }

        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: var(--space-lg);
          left: var(--space-lg);
          z-index: 101;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--space-sm);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mobile-menu-btn:hover {
          background-color: var(--bg-elevated);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 99;
        }

        /* Cards */
        .c-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        /* Buttons */
        .c-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          user-select: none;
        }

        .c-button--primary {
          background-color: var(--color-primary);
          color: var(--text-primary);
          border-color: var(--color-primary);
        }

        .c-button--primary:hover {
          background-color: var(--color-primary-hover);
          border-color: var(--color-primary-hover);
          transform: translateY(-1px);
        }

        .c-button--ghost {
          background-color: transparent;
          color: var(--text-secondary);
          border-color: transparent;
        }

        .c-button--ghost:hover {
          background-color: var(--bg-elevated);
          color: var(--text-primary);
        }

        /* Navigation */
        .nav-brand {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-2xl);
        }

        .nav-section {
          margin-bottom: var(--space-xl);
        }

        .nav-section-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
          margin-bottom: var(--space-md);
        }

        .nav-list {
          list-style: none;
        }

        .nav-item {
          margin-bottom: var(--space-sm);
        }

        .nav-link {
          display: block;
          padding: var(--space-sm) var(--space-md);
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .nav-link:hover,
        .nav-link--active {
          color: var(--text-primary);
          background-color: var(--bg-elevated);
        }

        .nav-link--coming-soon {
          color: var(--text-subtle);
          cursor: default;
          opacity: 0.6;
        }

        .nav-link--coming-soon:hover {
          background-color: transparent;
          color: var(--text-subtle);
        }

        /* Hero Header */
        .hero-header {
          text-align: center;
          padding: var(--space-3xl) 0;
        }

        .superheader {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        /* Updates Component */
        .updates-section {
          margin-bottom: var(--space-3xl);
        }

        .update-item {
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
          overflow: hidden;
        }

        .update-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          background-color: var(--bg-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .update-header:hover {
          background-color: var(--bg-elevated);
        }

        .update-meta {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .update-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .update-title {
          font-weight: 600;
          color: var(--text-primary);
        }

        .update-chevron {
          width: 20px;
          height: 20px;
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .update-content {
          padding: 0 var(--space-lg);
          max-height: 0;
          overflow: hidden;
          transition: all var(--transition-normal);
        }

        .update-content.expanded {
          max-height: 500px;
          padding: 0 var(--space-lg) var(--space-lg);
        }

        .update-chevron.rotated {
          transform: rotate(180deg);
        }

        /* Badges */
        .c-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1;
        }

        .c-badge--teal {
          background-color: rgba(90, 155, 148, 0.15);
          color: #a5d6d0;
        }

        .c-badge--gold {
          background-color: rgba(212, 175, 55, 0.15);
          color: #f6d186;
        }

        /* Utility classes */
        .u-flex { display: flex; }
        .u-items-center { align-items: center; }
        .u-justify-between { justify-content: space-between; }
        .u-gap-md { gap: var(--space-md); }
        .u-gap-lg { gap: var(--space-lg); }
        .u-mb-lg { margin-bottom: var(--space-lg); }
        .u-mb-xl { margin-bottom: var(--space-xl); }
        .u-mb-sm { margin-bottom: var(--space-sm); }

        /* Responsive */
        @media (max-width: 1200px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar-overlay.show {
            display: block;
          }
          
          .main-content {
            margin-left: 0;
            padding: var(--space-lg);
            padding-top: calc(var(--space-3xl) + var(--space-lg));
          }
          
          .text-display {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="nav-brand">Utility Platform</div>
        
        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#" className="nav-link nav-link--active">Home</a>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Tools</div>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/tools/gradient-ramps" className="nav-link">Gradient Ramps</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link nav-link--coming-soon">Brands Master Spreadsheet</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Header */}
        <header className="hero-header u-mb-xl">
          <div className="superheader text-caption text-teal u-mb-sm">Stellar and Baller</div>
          <h1 className="text-display u-mb-lg">Quinn Davis</h1>
          <p className="text-body text-secondary">
            A collection of personal utilities, tools, and experiments. Self-hosted on the home server for maximum performance and direct access to local services.
          </p>
        </header>

        {/* Updates Section */}
        <section className="updates-section">
          <h2 className="text-title-2 u-mb-lg">Latest Updates</h2>
          
          {updates.map((update, index) => (
            <div key={index} className="update-item">
              <div className="update-header" onClick={() => toggleUpdate(index)}>
                <div className="update-meta">
                  <div className="update-date">{update.date}</div>
                  <div className="update-title">{update.title}</div>
                  <div className={`c-badge c-badge--${update.badgeType}`}>{update.badge}</div>
                </div>
                <svg 
                  className={`update-chevron ${expandedUpdate === index ? 'rotated' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div className={`update-content ${expandedUpdate === index ? 'expanded' : ''}`}>
                {update.content}
              </div>
            </div>
          ))}
        </section>

        {/* Platform Status */}
        <section>
          <h2 className="text-title-2 u-mb-lg">Platform Status</h2>
          <div className="c-card">
            <div className="u-flex u-items-center u-justify-between">
              <div>
                <div className="text-body-sm text-muted">Server Status</div>
                <div className="text-title-3 text-primary">Online & Healthy</div>
              </div>
              <div className="c-badge c-badge--teal">Live</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;