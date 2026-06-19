import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeList = ({ token, user }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('📋 API Response:', data);
      setEmployees(Array.isArray(data) ? data : (data.data || data.employees || []));
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage('❌ Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter(emp => {
    const search = searchTerm.toLowerCase();
    return (
      (emp.User?.first_name?.toLowerCase() || '').includes(search) ||
      (emp.User?.last_name?.toLowerCase() || '').includes(search) ||
      (emp.User?.email?.toLowerCase() || '').includes(search) ||
      (emp.employee_code?.toLowerCase() || '').includes(search)
    );
  });

  return (
    <div className="dashboard-container">
      <div className="employee-header-actions">
        <h2>👥 Employee Management</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

      {loading ? (
        <div className="loading-screen"><div className="loader"></div><p>Loading employees...</p></div>
      ) : (
        <div className="employee-grid">
          {filteredEmployees.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
              {searchTerm ? 'No employees match your search' : 'No employees found'}
            </p>
          ) : (
            filteredEmployees.map((emp) => (
              <div key={emp.id} className="employee-card">
                <div className="employee-header">
                  <div className="employee-avatar">
                    {(emp.User?.first_name?.[0] || '') + (emp.User?.last_name?.[0] || '')}
                  </div>
                  <div>
                    <div className="employee-name">{emp.User?.first_name} {emp.User?.last_name}</div>
                    <span className="employee-code">{emp.employee_code}</span>
                  </div>
                </div>
                <div className="employee-details">
                  <p>📧 {emp.User?.email}</p>
                  <p>💼 {emp.Department?.name || 'N/A'}</p>
                  <p>🎯 {emp.JobTitle?.name || 'N/A'}</p>
                  <p>📅 Hired: {emp.hire_date}</p>
                  <p>💰 ${emp.salary?.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
