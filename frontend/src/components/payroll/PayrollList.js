import React from 'react';

const PayrollList = ({ token, user }) => {
  return (
    <div className="dashboard-container">
      <h2>💰 Payroll Management</h2>
      <div className="attendance-section">
        <p style={{ color: 'var(--text-secondary)' }}>Payroll feature coming soon...</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You'll be able to view payslips, export payroll data, and manage salary information.</p>
      </div>
    </div>
  );
};

export default PayrollList;
