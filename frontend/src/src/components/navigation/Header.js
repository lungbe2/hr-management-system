import React from 'react';

const Header = ({ user, onLogout, toggleSidebar, sidebarOpen }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
        <span className="header-title">HR Management System</span>
      </div>
      <div className="header-right">
        <div className="header-user">
          <span className="user-avatar">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </span>
          <span className="user-name-header">{user?.firstName} {user?.lastName}</span>
          <span className={`role-badge ${user?.role?.toLowerCase()}`}>
            {user?.role}
          </span>
        </div>
        <button className="logout-btn-header" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
