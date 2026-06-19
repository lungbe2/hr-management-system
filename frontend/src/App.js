import React, { useState } from 'react';
import Layout from './components/Layout';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

// Use environment variable or fallback to production URL
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
      console.log('🔐 Attempting login to:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        setMessage(`✅ Welcome ${data.user.firstName} ${data.user.lastName}!`);
        await fetchEmployees(data.token);
      } else {
        setMessage('❌ ' + (data.error || 'Login failed. Please check your credentials.'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Connection error: ' + error.message);
    }
    setLoading(false);
  };

  // Fetch employees
  const fetchEmployees = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
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
            <div className={`welcome-banner ${role?.toLowerCase() || ''}`}>
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

            <div className="quick-actions">
              <h3>⚡ Quick Actions</h3>
              <div className="action-grid">
                {(isAdmin || isManager) && (
                  <button className="action-btn"><span>➕</span> Add Employee</button>
                )}
                {isEmployee && (
                  <>
                    <button className="action-btn"><span>✈️</span> Request Leave</button>
                    <button className="action-btn"><span>⏰</span> Clock In</button>
                  </>
                )}
                <button className="action-btn"><span>👤</span> My Profile</button>
              </div>
            </div>

            {isEmployee && (
              <EmployeeDashboard user={user} token={token} />
            )}

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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Page coming soon</div>;
    }
  };

  // ========== LOGIN PAGE ==========
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
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
