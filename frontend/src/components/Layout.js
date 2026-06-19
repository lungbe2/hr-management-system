import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import './Layout.css';

const Layout = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1>🏢 HRMS</h1>
        <div className="mobile-user-info">
          <span className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">🏢</span>
            <h2>HRMS</h2>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>✕</button>
        </div>
        
        <Navigation 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar large">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className={`user-role ${user?.role?.toLowerCase()}`}>{user?.role}</span>
            </div>
          </div>
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {window.innerWidth <= 768 && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
