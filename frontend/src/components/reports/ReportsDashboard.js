import React from 'react';

const ReportsDashboard = ({ token, user }) => {
  return (
    <div className="dashboard-container">
      <h2>📊 Reports & Analytics</h2>
      <div className="attendance-section">
        <p style={{ color: 'var(--text-secondary)' }}>Reports feature coming soon...</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You'll be able to generate attendance, leave, payroll, and employee reports.</p>
      </div>
    </div>
  );
};

export default ReportsDashboard;
