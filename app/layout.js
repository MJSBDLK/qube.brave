// app/layout.js
'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close sidebar when navigating to non-home routes
  useEffect(() => {
    if (!isHomepage) {
      closeSidebar();
    }
  }, [isHomepage]);

  // Set sidebar open by default on homepage for desktop
  useEffect(() => {
    if (isHomepage && typeof window !== 'undefined' && window.innerWidth >= 960) {
      setSidebarOpen(true);
    }
  }, [isHomepage]);

  return (
    <html lang="en">
      <body>
        <div className={`app-layout ${isHomepage ? 'homepage' : 'subpage'}`}>
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          {/* Main Content */}
          <main className={`main-content ${isHomepage ? 'homepage' : 'subpage'}`}>
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  )
}