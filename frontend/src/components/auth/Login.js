import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, loading: parentLoading, error: parentError }) => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('Admin@123');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const result = await onLogin(email, password);
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  const quickLogin = (role) => {
    const accounts = {
      admin: { email: 'admin@company.com', password: 'Admin@123' },
      hr: { email: 'hrmanager@company.com', password: 'HR@123' },
      employee: { email: 'employee1@company.com', password: 'Employee@123' }
    };
    const account = accounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏢 HRMS</h1>
          <p>Human Resource Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
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
          
          {(localError || parentError) && (
            <div className="error-message">
              ❌ {localError || parentError}
            </div>
          )}
          
          <button type="submit" disabled={parentLoading} className="login-btn">
            {parentLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="quick-login">
          <p>Quick Access</p>
          <div className="quick-buttons">
            <button onClick={() => quickLogin('admin')} className="quick-btn admin">
              Admin
            </button>
            <button onClick={() => quickLogin('hr')} className="quick-btn manager">
              HR
            </button>
            <button onClick={() => quickLogin('employee')} className="quick-btn employee">
              Employee
            </button>
          </div>
        </div>
        
        <div className="login-footer">
          <p>Demo Credentials:</p>
          <small>admin@company.com / Admin@123</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
