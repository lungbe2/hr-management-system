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

  // ========== RENDER CONTENT ==========
  const renderContent = () => {
    const role = user?.role;
    const isAdmin = role === 'Admin';
    const isManager = role === 'Manager';
    const isEmployee = role === 'Employee';

    switch (activeTab) {
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
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>⚡ Quick Actions</h3>
              <div className="action-grid">
                {(isAdmin || isManager) && (
                  <button className="action-btn primary" onClick={() => setActiveTab('employees')}>
                    <span className="icon">➕</span> Manage Employees
                  </button>
                )}
                {isManager && (
                  <button className="action-btn" onClick={() => setActiveTab('leave')}>
                    <span className="icon">✅</span> Approve Leave
                  </button>
                )}
                {isEmployee && (
                  <>
                    <button className="action-btn" onClick={() => setActiveTab('leave')}>
                      <span className="icon">✈️</span> Request Leave
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('attendance')}>
                      <span className="icon">⏰</span> Clock In
                    </button>
                  </>
                )}
                <button className="action-btn">
                  <span className="icon">👤</span> My Profile
                </button>
              </div>
            </div>

            {/* Employee Dashboard */}
            {isEmployee && <EmployeeDashboard user={user} token={token} />}

            {/* Employee List */}
            {(isAdmin || isManager) && (
              <div className="employee-section">
                <div className="section-header">
                  <h3>📋 Recent Employees</h3>
                  <span className="view-all" onClick={() => setActiveTab('employees')}>View All →</span>
                </div>
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
                        <p><span className="label">📧</span> {emp.User?.email}</p>
                        <p><span className="label">🏢</span> {emp.Department?.name || 'N/A'}</p>
                        {isAdmin && <p><span className="label">💰</span> ${emp.salary?.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'employees':
        return (
          <div className="content">
            <div className="page-header">
              <div className="page-header-left">
                <h2>👥 <span>Employees</span></h2>
                <p>Manage all employees in your organization</p>
              </div>
              <div className="page-header-right">
                {isAdmin && <button className="add-btn">+ Add Employee</button>}
              </div>
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
                    <p><span className="label">📧</span> {emp.User?.email}</p>
                    <p><span className="label">🏢</span> {emp.Department?.name || 'N/A'}</p>
                    <p><span className="label">📅</span> Hired: {emp.hire_date}</p>
                    {isAdmin && <p><span className="label">💰</span> ${emp.salary?.toLocaleString()}</p>}
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
              <div className="page-header-left">
                <h2>⏰ <span>Attendance</span></h2>
                <p>Track employee attendance and clock-in/out</p>
              </div>
            </div>
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-value">{isAdmin ? '8' : '3'}</span>
                  <span className="stat-label">Present Today</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-info">
                  <span className="stat-value">{isAdmin ? '2' : '1'}</span>
                  <span className="stat-label">Absent Today</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <span className="stat-value">{isAdmin ? '1' : '0'}</span>
                  <span className="stat-label">Late Today</span>
                </div>
              </div>
            </div>
            <div className="employee-section">
              <div className="section-header">
                <h3>📋 Today's Attendance</h3>
              </div>
              <div className="employee-grid">
                {employees.slice(0, 5).map((emp) => (
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
                      <p><span className="label">🟢</span> 08:15 AM</p>
                      <p><span className="label" style={{ color: '#4caf50' }}>✅</span> Present</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="content">
            <div className="page-header">
              <div className="page-header-left">
                <h2>✈️ <span>Leave Management</span></h2>
                <p>{isAdmin ? 'Manage all leave requests' : isManager ? 'Approve or reject team leave requests' : 'Request leave and view balance'}</p>
              </div>
              {isEmployee && <button className="add-btn">+ Request Leave</button>}
            </div>
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon">🏖️</div>
                <div className="stat-info">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Annual Leave</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤒</div>
                <div className="stat-info">
                  <span className="stat-value">8</span>
                  <span className="stat-label">Sick Leave</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <span className="stat-value">5</span>
                  <span className="stat-label">Casual Leave</span>
                </div>
              </div>
            </div>
            <div className="employee-section">
              <div className="section-header">
                <h3>📋 Leave Requests</h3>
              </div>
              <div className="employee-grid">
                {isManager && (
                  <>
                    <div className="employee-card" style={{ borderColor: 'rgba(255, 217, 61, 0.2)' }}>
                      <div className="employee-header">
                        <div className="employee-avatar">DK</div>
                        <div className="employee-info">
                          <h4>David Kumar</h4>
                          <span className="employee-role">Annual Leave</span>
                        </div>
                      </div>
                      <div className="employee-details">
                        <p>📅 Jul 15-20, 2026</p>
                        <p>💬 Family vacation</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px' }}>✅ Approve</button>
                          <button className="logout-btn" style={{ padding: '6px 16px', fontSize: '12px' }}>❌ Reject</button>
                        </div>
                      </div>
                    </div>
                    <div className="employee-card" style={{ borderColor: 'rgba(255, 217, 61, 0.2)' }}>
                      <div className="employee-header">
                        <div className="employee-avatar">MG</div>
                        <div className="employee-info">
                          <h4>Maria Garcia</h4>
                          <span className="employee-role">Sick Leave</span>
                        </div>
                      </div>
                      <div className="employee-details">
                        <p>📅 Jun 10-11, 2026</p>
                        <p>💬 Doctor's appointment</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px' }}>✅ Approve</button>
                          <button className="logout-btn" style={{ padding: '6px 16px', fontSize: '12px' }}>❌ Reject</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {isEmployee && (
                  <>
                    <div className="employee-card">
                      <div className="employee-header">
                        <div className="employee-avatar">DK</div>
                        <div className="employee-info">
                          <h4>David Kumar</h4>
                          <span className="employee-role">Annual Leave</span>
                        </div>
                      </div>
                      <div className="employee-details">
                        <p>📅 Jul 15-20, 2026</p>
                        <p><span style={{ color: '#4caf50' }}>✅ Approved</span></p>
                      </div>
                    </div>
                    <div className="employee-card">
                      <div className="employee-header">
                        <div className="employee-avatar">DK</div>
                        <div className="employee-info">
                          <h4>David Kumar</h4>
                          <span className="employee-role">Sick Leave</span>
                        </div>
                      </div>
                      <div className="employee-details">
                        <p>📅 Jun 10-11, 2026</p>
                        <p><span style={{ color: '#ffd93d' }}>⏳ Pending</span></p>
                      </div>
                    </div>
                  </>
                )}
                {isAdmin && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                    📋 All leave requests will appear here
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
              <div className="page-header-left">
                <h2>💰 <span>Payroll Management</span></h2>
                <p>Manage salaries and payslips</p>
              </div>
            </div>
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <span className="stat-value">$245K</span>
                  <span className="stat-label">Total Payroll</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-info">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Payslips Generated</span>
                </div>
              </div>
            </div>
            <div className="employee-section">
              <div className="section-header">
                <h3>📋 Payroll Records</h3>
              </div>
              <div className="employee-grid">
                {employees.slice(0, 3).map((emp) => (
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
                      <p><span className="label">💰</span> ${emp.salary?.toLocaleString()}</p>
                      <p><span className="label">📅</span> {new Date().toLocaleString('default', { month: 'long' })} 2026</p>
                      <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px', marginTop: '8px' }}>📄 View Payslip</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="content">
            <div className="page-header">
              <div className="page-header-left">
                <h2>⭐ <span>Performance Management</span></h2>
                <p>Track employee performance and reviews</p>
              </div>
            </div>
            <div className="employee-grid">
              <div className="employee-card" style={{ borderColor: 'rgba(76, 175, 80, 0.2)' }}>
                <div className="employee-header">
                  <div className="employee-avatar">DK</div>
                  <div className="employee-info">
                    <h4>David Kumar</h4>
                    <span className="employee-role">Software Engineer</span>
                  </div>
                </div>
                <div className="employee-details">
                  <p><span className="label">⭐</span> Rating: 4.5/5</p>
                  <p>💬 "Excellent performance this quarter"</p>
                  <p style={{ color: '#4caf50' }}>✅ Completed</p>
                </div>
              </div>
              <div className="employee-card" style={{ borderColor: 'rgba(76, 175, 80, 0.2)' }}>
                <div className="employee-header">
                  <div className="employee-avatar">MG</div>
                  <div className="employee-info">
                    <h4>Maria Garcia</h4>
                    <span className="employee-role">HR Specialist</span>
                  </div>
                </div>
                <div className="employee-details">
                  <p><span className="label">⭐</span> Rating: 4.0/5</p>
                  <p>💬 "Great teamwork and dedication"</p>
                  <p style={{ color: '#4caf50' }}>✅ Completed</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="content">
            <div className="page-header">
              <div className="page-header-left">
                <h2>📄 <span>Documents</span></h2>
                <p>Manage company documents and policies</p>
              </div>
            </div>
            <div className="employee-grid">
              <div className="employee-card">
                <div className="employee-header">
                  <div style={{ fontSize: '32px' }}>📄</div>
                  <div className="employee-info">
                    <h4>Employee Handbook</h4>
                    <span className="employee-role">Version 2.0</span>
                  </div>
                </div>
                <div className="employee-details">
                  <p>📅 Updated: June 2026</p>
                  <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px', marginTop: '8px' }}>📥 Download</button>
                </div>
              </div>
              <div className="employee-card">
                <div className="employee-header">
                  <div style={{ fontSize: '32px' }}>📄</div>
                  <div className="employee-info">
                    <h4>Code of Conduct</h4>
                    <span className="employee-role">Version 1.5</span>
                  </div>
                </div>
                <div className="employee-details">
                  <p>📅 Updated: March 2026</p>
                  <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px', marginTop: '8px' }}>📥 Download</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="content">
            <div className="page-header">
              <div className="page-header-left">
                <h2>📊 <span>Reports & Analytics</span></h2>
                <p>View HR analytics and reports</p>
              </div>
            </div>
            <div className="employee-grid">
              <div className="employee-card">
                <div className="employee-header">
                  <div style={{ fontSize: '32px' }}>📊</div>
                  <div className="employee-info">
                    <h4>Attendance Report</h4>
                    <span className="employee-role">Last 30 days</span>
                  </div>
                </div>
                <div className="employee-details">
                  <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px', marginTop: '8px' }}>📥 Generate</button>
                </div>
              </div>
              <div className="employee-card">
                <div className="employee-header">
                  <div style={{ fontSize: '32px' }}>📊</div>
                  <div className="employee-info">
                    <h4>Leave Report</h4>
                    <span className="employee-role">This month</span>
                  </div>
                </div>
                <div className="employee-details">
                  <button className="add-btn" style={{ padding: '6px 16px', fontSize: '12px', marginTop: '8px' }}>📥 Generate</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="content"><p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '60px' }}>Page not found</p></div>;
    }
  };

  // ========== LOGIN PAGE ==========
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
          {/* Left Panel - Branding */}
          <div className="login-brand">
            <span className="brand-badge">✨ HR MANAGEMENT</span>
            <div className="logo-wrapper">
              <div className="logo-icon">🏢</div>
              <h1>HR <span>Management</span></h1>
            </div>
            <p className="tagline">Complete HR solution for modern teams. Manage employees, attendance, leave, and payroll in one place.</p>
            <div className="features-grid">
              <div className="feature-item"><span className="icon">👥</span> Employee Management</div>
              <div className="feature-item"><span className="icon">⏰</span> Time & Attendance</div>
              <div className="feature-item"><span className="icon">✈️</span> Leave Management</div>
              <div className="feature-item"><span className="icon">💰</span> Payroll Processing</div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p className="subtitle">Sign in to your account to continue</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
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
