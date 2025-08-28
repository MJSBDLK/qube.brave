// app/page.js
'use client'
import React, { useState, useEffect } from 'react';
import Update from '../components/Update';

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
			date: 'Aug 26, 2025',
			title: 'Gradient Ramps Tool',
			badge: 'New Tool',
			badgeType: 'teal',
			content: (
				<>
					<p className="text-body text-secondary u-m-sm">
						Gradient Ramps tool available at qube.brave/ramps
					</p>
					<div className="u-flex u-gap-sm">
						<a href="/tools/ramps" className="c-button c-button--primary">Try It Out</a>
						{/* <a href="#" className="c-button c-button--ghost">View Source</a> */}
					</div>
				</>
			)
		}
	];

  return (
    <div style={{
      // fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      // color: '#f8f9fa',
      // backgroundColor: '#0a0e1a',
      minHeight: '100vh',
      display: 'flex'
    }}>

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
        <div className="nav-brand">qube.brave</div>
        
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
              <a href="/ramps" className="nav-link">Gradient Ramps</a>
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
					<header className="hero-header u-mb-xl" style={{ textAlign: 'left' }}>
						<div className="superheader text-caption text-teal u-mb-sm">Stellar and Baller</div>
						<h1 className="text-display u-mb-lg">Quinn Davis</h1>
						<p className="text-body text-secondary">
							Description goes here
						</p>
					</header>

					{/* Updates Section */}
        <section className="updates-section">
          <h2 className="text-title-2 u-mb-lg">Latest Updates</h2>
          
          {updates.map((update, index) => (
            <Update key={index} content={update} />
          ))}
        </section>

        {/* Platform Status
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
        </section> */}
      </main>
    </div>
  );
};

export default HomePage;