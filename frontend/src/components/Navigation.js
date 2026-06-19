import React from 'react';
import './Navigation.css';

const Navigation = ({ user, activeTab, setActiveTab }) => {
  // Define all nav items with their tabs
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '⏰' },
    { id: 'leave', label: 'Leave', icon: '✈️' },
    { id: 'payroll', label: 'Payroll', icon: '💰' },
    { id: 'performance', label: 'Performance', icon: '⭐' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'reports', label: 'Reports', icon: '📊' }
  ];

  // Filter for Employee role
  const getVisibleItems = () => {
    if (user?.role === 'Employee') {
      return navItems.filter(item => 
        ['dashboard', 'attendance', 'leave', 'documents'].includes(item.id)
      );
    }
    return navItems;
  };

  const visibleItems = getVisibleItems();

  return (
    <nav className="navigation">
      <ul className="nav-list">
        {visibleItems.map(item => (
          <li key={item.id} className="nav-item">
            <button 
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
