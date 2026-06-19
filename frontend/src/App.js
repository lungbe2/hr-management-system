import React, { useState } from 'react';
import Layout from './components/Layout';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://hrms-backend-i5pv.onrender.com/api';

function App() {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('Admin@123');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        setMessage(`✅ Welcome ${data.user.firstName} ${data.user.lastName}!`);
        await fetchEmployees(data.token);
      } else {
        setMessage('❌ ' + (data.error || 'Login failed'));
      }
    } catch (error) {
      setMessage('❌ Connection error: ' + error.message);
    }
    setLoading(false);
  };

  // Fetch employees
  const fetchEmployees = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : (data.data || data.employees || []));
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setEmployees([]);
    setMessage('Logged out');
  };

  // Test accounts
  const setTestAccount = (role) => {
    const accounts = {
      admin: { email: 'admin@company.com', password: 'Admin@123' },
      hr: { email: 'hrmanager@company.com', password: 'HR@123' },
      employee: { email: 'employee1@company.com', password: 'Employee@123' }
    };
    const account = accounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setMessage('');
    }
  };

  // ========== RENDER CONTENT BASED ON TAB & ROLE ==========
  const renderContent = () => {
    const role = user?.role;
    const isAdmin = role === 'Admin';
    const isManager = role === 'Manager';
    const isEmployee = role === 'Employee';

    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="content">
            {/* Welcome Banner */}
            <div className={`welcome-banner ${role?.toLowerCase()}`}>
              <div className="welcome-content">
                <div className="welcome-icon">
                  {isAdmin && '👑'}
                  {isManager && '👔'}
                  {isEmployee && '👤'}
                </div>
                <div className="welcome-text">
                  <h2>Welcome back, {user?.firstName}!</h2>
                  <p>
                    {isAdmin && 'You have full system access. Manage employees, attendance, leave, payroll, and more.'}
                    {isManager && 'You can manage your team\'s attendance, leave requests, and performance.'}
                    {isEmployee && 'View your attendance, request leave, and manage your profile.'}
                  </p>
                </div>
              </div>
              <div className="role-badge-large">{role}</div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{employees.length}</span>
                  <span className="stat-label">Total Employees</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Today's Attendance</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✈️</div>
                <div className="stat-info">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Pending Leave</span>
                </div>
              </div>
              {isAdmin && (
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-value">$245K</span>
                    <span className="stat-label">Payroll This Month</span>
                  </div>
                </div>
              )}
              {isManager && (
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <span className="stat-value">4.5</span>
                    <span className="stat-label">Team Performance</span>
                  </div>
                </div>
              )}
              {isEmployee && (
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Leave Balance</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>⚡ Quick Actions</h3>
              <div className="action-grid">
                {(isAdmin || isManager) && (
                  <button className="action-btn" onClick={() => setActiveTab('employees')}>
                    <span>➕</span> Manage Employees
                  </button>
                )}
                {isManager && (
                  <button className="action-btn" onClick={() => setActiveTab('leave')}>
                    <span>✅</span> Approve Leave
                  </button>
                )}
                {isEmployee && (
                  <>
                    <button className="action-btn" onClick={() => setActiveTab('leave')}>
                      <span>✈️</span> Request Leave
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('attendance')}>
                      <span>⏰</span> Clock In
                    </button>
                  </>
                )}
                <button className="action-btn">
                  <span>👤</span> My Profile
                </button>
              </div>
            </div>

            {/* Employee Dashboard - Full Employee View */}
            {isEmployee && (
              <EmployeeDashboard user={user} token={token} />
            )}

            {/* Employee List - For Admin and Manager */}
            {(isAdmin || isManager) && (
              <div className="employee-section">
                <h3>📋 Recent Employees</h3>
                <div className="employee-grid">
                  {employees.slice(0, 4).map((emp) => (
                    <div key={emp.id} className="employee-card">
                      <div className="employee-header">
                        <div className="employee-avatar">
                          {emp.User?.first_name?.[0]}{emp.User?.last_name?.[0]}
                        </div>
                        <div className="employee-info">
                          <h4>{emp.User?.first_name} {emp.User?.last_name}</h4>
                          <span className="employee-role">{emp.JobTitle?.name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="employee-details">
                        <p>📧 {emp.User?.email}</p>
                        <p>🏢 {emp.Department?.name || 'N/A'}</p>
                        {isAdmin && <p>💲 ${emp.salary?.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'employees':
        // Employee view - limited access
        if (isEmployee) {
          return (
            <div className="content">
              <div className="page-header">
                <h2>👥 Employees</h2>
                <p className="page-subtitle">View team members</p>
              </div>
              <div className="employee-grid">
                {employees.map((emp) => (
                  <div key={emp.id} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-avatar">
                        {emp.User?.first_name?.[0]}{emp.User?.last_name?.[0]}
                      </div>
                      <div className="employee-info">
                        <h4>{emp.User?.first_name} {emp.User?.last_name}</h4>
                        <span className="employee-role">{emp.JobTitle?.name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="employee-details">
                      <p>📧 {emp.User?.email}</p>
                      <p>🏢 {emp.Department?.name || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        // Admin/Manager view with management features
        return (
          <div className="content">
            <div className="page-header">
              <h2>👥 Employees</h2>
              <p className="page-subtitle">Manage all employees in your organization</p>
              <button className="add-btn">+ Add Employee</button>
            </div>
            <div className="employee-grid">
              {employees.map((emp) => (
                <div key={emp.id} className="employee-card admin-card">
                  <div className="employee-header">
                    <div className="employee-avatar">
                      {emp.User?.first_name?.[0]}{emp.User?.last_name?.[0]}
                    </div>
                    <div className="employee-info">
                      <h4>{emp.User?.first_name} {emp.User?.last_name}</h4>
                      <span className="employee-role">{emp.JobTitle?.name || 'N/A'}</span>
                    </div>
                    {isAdmin && (
                      <div className="card-actions">
                        <button className="edit-btn">✏️</button>
                        <button className="delete-btn">🗑️</button>
                      </div>
                    )}
                  </div>
                  <div className="employee-details">
                    <p>📧 {emp.User?.email}</p>
                    <p>🏢 {emp.Department?.name || 'N/A'}</p>
                    <p>📅 Hired: {emp.hire_date}</p>
                    {isAdmin && <p>💲 ${emp.salary?.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="content">
            <div className="page-header">
              <h2>⏰ Attendance</h2>
              <p className="page-subtitle">
                {isAdmin ? 'Monitor all employee attendance' :
                 isManager ? 'Monitor your team\'s attendance' :
                 'View your attendance history'}
              </p>
            </div>
            <div className="attendance-section">
              <div className="attendance-summary">
                <div className="summary-card">
                  <span>✅ Present Today</span>
                  <strong>{isAdmin ? '8' : isManager ? '3' : '1'}</strong>
                </div>
                <div className="summary-card">
                  <span>❌ Absent Today</span>
                  <strong>{isAdmin ? '2' : isManager ? '1' : '0'}</strong>
                </div>
                <div className="summary-card">
                  <span>⏰ Late Today</span>
                  <strong>{isAdmin ? '1' : isManager ? '0' : '0'}</strong>
                </div>
              </div>
              <div className="attendance-list">
                <h4>📋 Today's Attendance</h4>
                <div className="attendance-item">
                  <span>David Kumar</span>
                  <span className="clock-in-time">🟢 08:15 AM</span>
                  <span className="attendance-status present">Present</span>
                </div>
                <div className="attendance-item">
                  <span>Sarah Johnson</span>
                  <span className="clock-in-time">🟢 08:30 AM</span>
                  <span className="attendance-status present">Present</span>
                </div>
                <div className="attendance-item">
                  <span>Maria Garcia</span>
                  <span className="clock-out-time">❌ Not clocked in</span>
                  <span className="attendance-status absent">Absent</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="content">
            <div className="page-header">
              <h2>✈️ Leave Management</h2>
              <p className="page-subtitle">
                {isAdmin ? 'Manage all leave requests' :
                 isManager ? 'Approve or reject team leave requests' :
                 'Request leave and view balance'}
              </p>
              {isEmployee && <button className="add-btn">+ Request Leave</button>}
            </div>
            <div className="leave-section">
              <div className="leave-balance-grid">
                <div className="balance-card">
                  <span>🏖️ Annual Leave</span>
                  <strong>15 days</strong>
                </div>
                <div className="balance-card">
                  <span>🤒 Sick Leave</span>
                  <strong>8 days</strong>
                </div>
                <div className="balance-card">
                  <span>📋 Casual Leave</span>
                  <strong>5 days</strong>
                </div>
              </div>
              <div className="leave-list">
                <h4>📋 Leave Requests</h4>
                {isManager && (
                  <>
                    <div className="leave-item">
                      <span>David Kumar - Annual Leave (Jul 15-20)</span>
                      <div className="request-actions">
                        <button className="approve-btn">✅ Approve</button>
                        <button className="reject-btn">❌ Reject</button>
                      </div>
                    </div>
                    <div className="leave-item">
                      <span>Maria Garcia - Sick Leave (Jun 10-11)</span>
                      <div className="request-actions">
                        <button className="approve-btn">✅ Approve</button>
                        <button className="reject-btn">❌ Reject</button>
                      </div>
                    </div>
                  </>
                )}
                {isEmployee && (
                  <>
                    <div className="leave-item">
                      <span>Annual Leave - July 15-20</span>
                      <span className="status-approved">✅ Approved</span>
                    </div>
                    <div className="leave-item">
                      <span>Sick Leave - June 10-11</span>
                      <span className="status-pending">⏳ Pending</span>
                    </div>
                  </>
                )}
                {isAdmin && (
                  <div className="leave-item">
                    <span>All leave requests will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'payroll':
        return (
          <div className="content">
            <div className="page-header">
              <h2>💰 Payroll Management</h2>
              <p className="page-subtitle">Manage salaries and payslips</p>
            </div>
            <div className="payroll-section">
              <div className="payroll-summary">
                <div className="summary-card">
                  <span>💰 Total Payroll</span>
                  <strong>$245,000</strong>
                </div>
                <div className="summary-card">
                  <span>📄 Payslips Generated</span>
                  <strong>3</strong>
                </div>
              </div>
              <div className="payroll-list">
                <h4>📋 Payroll Records</h4>
                <div className="payroll-item">
                  <span>David Kumar</span>
                  <span>$7,200</span>
                  <button className="view-btn">View</button>
                </div>
                <div className="payroll-item">
                  <span>Sarah Johnson</span>
                  <span>$8,500</span>
                  <button className="view-btn">View</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="content">
            <div className="page-header">
              <h2>⭐ Performance Management</h2>
              <p className="page-subtitle">Track employee performance and reviews</p>
            </div>
            <div className="performance-section">
              <div className="performance-grid">
                <div className="performance-card">
                  <h4>David Kumar</h4>
                  <p>⭐ Rating: 4.5/5</p>
                  <p>"Excellent performance this quarter"</p>
                  <span className="status-approved">✅ Completed</span>
                </div>
                <div className="performance-card">
                  <h4>Maria Garcia</h4>
                  <p>⭐ Rating: 4.0/5</p>
                  <p>"Great teamwork and dedication"</p>
                  <span className="status-approved">✅ Completed</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="content">
            <div className="page-header">
              <h2>📄 Documents</h2>
              <p className="page-subtitle">Manage company documents and policies</p>
            </div>
            <div className="documents-section">
              <div className="document-grid">
                <div className="document-card">
                  <span>📄</span>
                  <h4>Employee Handbook</h4>
                  <p>Version 2.0</p>
                  <button className="view-btn">Download</button>
                </div>
                <div className="document-card">
                  <span>📄</span>
                  <h4>Code of Conduct</h4>
                  <p>Version 1.5</p>
                  <button className="view-btn">Download</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="content">
            <div className="page-header">
              <h2>📊 Reports & Analytics</h2>
              <p className="page-subtitle">View HR analytics and reports</p>
            </div>
            <div className="reports-section">
              <div className="report-grid">
                <div className="report-card">
                  <span>📊</span>
                  <h4>Attendance Report</h4>
                  <p>Last 30 days</p>
                  <button className="view-btn">Generate</button>
                </div>
                <div className="report-card">
                  <span>📊</span>
                  <h4>Leave Report</h4>
                  <p>This month</p>
                  <button className="view-btn">Generate</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  // ========== LOGIN PAGE ==========
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
          {/* Left Side - Branding */}
          <div className="login-brand">
            <div className="logo">🏢</div>
            <h1>HR <span>Management</span></h1>
            <p>Complete HR solution for modern teams.</p>
            <div className="features">
              <div className="feature-item"><span>👥</span> Employee Management</div>
              <div className="feature-item"><span>⏰</span> Time & Attendance</div>
              <div className="feature-item"><span>✈️</span> Leave Management</div>
              <div className="feature-item"><span>💰</span> Payroll Processing</div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-container">
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to your account</p>
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="test-accounts">
              <span className="test-label">Quick Test Accounts</span>
              <div className="test-buttons">
                <button onClick={() => setTestAccount('admin')} className="test-btn admin">👑 Admin</button>
                <button onClick={() => setTestAccount('hr')} className="test-btn manager">👔 Manager</button>
                <button onClick={() => setTestAccount('employee')} className="test-btn employee">👤 Employee</button>
              </div>
            </div>
            
            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'} visible`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== DASHBOARD ==========
  return (
    <Layout 
      user={user} 
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
