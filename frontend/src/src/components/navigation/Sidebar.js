import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, userRole }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'employees', icon: '👥', label: 'Employees' },
    { id: 'attendance', icon: '⏰', label: 'Attendance' },
    { id: 'leave', icon: '✈️', label: 'Leave' },
    { id: 'payroll', icon: '💰', label: 'Payroll' },
    { id: 'performance', icon: '⭐', label: 'Performance' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'reports', icon: '📊', label: 'Reports' }
  ];

  // Filter menu items based on role
  const filteredItems = menuItems.filter(item => {
    if (item.id === 'reports' && userRole === 'Employee') return false;
    if (item.id === 'payroll' && userRole === 'Employee') return false;
    if (item.id === 'performance' && userRole === 'Employee') return false;
    return true;
  });

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">🏢</span>
        <span className="brand-text">HRMS</span>
      </div>
      <nav className="sidebar-nav">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
