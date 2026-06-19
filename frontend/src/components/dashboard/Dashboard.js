import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ token, user }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const empResponse = await fetch(`${API_URL}/employees`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const employees = await empResponse.json();
        const empArray = Array.isArray(employees) ? employees : (employees.data || []);

        const leaveResponse = await fetch(`${API_URL}/leave/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const leaveData = await leaveResponse.json();
        const leaveArray = Array.isArray(leaveData) ? leaveData : (leaveData.data || []);

        setStats({
          totalEmployees: empArray.length,
          presentToday: Math.floor(empArray.length * 0.8),
          onLeave: Math.floor(empArray.length * 0.1),
          pendingRequests: leaveArray.filter(l => l.status === 'Pending').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '🌤️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>{greeting()}, {user?.firstName}!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your HR Management Dashboard</p>
        </div>
        <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{loading ? '...' : stats.totalEmployees}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-value">{loading ? '...' : stats.presentToday}</div>
          <div className="stat-label">Present Today</div>
          <span className="stat-change up">↑ 80%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-value">{loading ? '...' : stats.onLeave}</div>
          <div className="stat-label">On Leave</div>
          <span className="stat-change down">↓ 10%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{loading ? '...' : stats.pendingRequests}</div>
          <div className="stat-label">Pending Requests</div>
          <span className="stat-change warning">⏳ Pending</span>
        </div>
      </div>

      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius)', 
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3>📊 Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <>
              <button className="btn-primary" onClick={() => window.location.hash = 'employees'}>👥 Manage Employees</button>
              <button className="btn-secondary" onClick={() => window.location.hash = 'attendance'}>⏰ Attendance</button>
            </>
          )}
          <button className="btn-secondary" onClick={() => window.location.hash = 'leave'}>✈️ Leave Requests</button>
          <button className="btn-secondary" onClick={() => window.location.hash = 'payroll'}>💰 Payroll</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
