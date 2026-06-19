import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LeaveManagement = ({ token, user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [leaveBalance, setLeaveBalance] = useState({ annual: 20, sick: 10, casual: 5 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'Annual',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [message, setMessage] = useState('');

  const fetchLeaveRequests = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/leave/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeaveRequests(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error fetching leave:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/leave/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMessage('✅ Leave request submitted!');
        setShowForm(false);
        fetchLeaveRequests();
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>✈️ Leave Management</h2>
      
      <div className="leave-section">
        <h3>📊 Leave Balance</h3>
        <div className="leave-balance">
          <div className="balance-item">
            <div className="balance-value">{leaveBalance.annual}</div>
            <div className="balance-label">Annual Leave</div>
          </div>
          <div className="balance-item">
            <div className="balance-value">{leaveBalance.sick}</div>
            <div className="balance-label">Sick Leave</div>
          </div>
          <div className="balance-item">
            <div className="balance-value">{leaveBalance.casual}</div>
            <div className="balance-label">Casual Leave</div>
          </div>
        </div>
      </div>

      <div className="leave-section">
        <h3>📋 My Leave Requests</h3>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Request Leave
        </button>
        {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
        
        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Leave Type</label>
                <select 
                  value={formData.leave_type}
                  onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                  required
                >
                  <option>Annual</option>
                  <option>Sick</option>
                  <option>Casual</option>
                  <option>Maternity</option>
                  <option>Paternity</option>
                  <option>Unpaid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows="2"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="submit-btn">Submit</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '16px' }}>
          {leaveRequests.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No leave requests</p>
          ) : (
            leaveRequests.map((req) => (
              <div key={req.id} className="leave-card">
                <div className="leave-header">
                  <span className="leave-type">{req.leave_type}</span>
                  <span className={`status-badge ${req.status?.toLowerCase()}`}>{req.status}</span>
                </div>
                <div className="leave-dates">{req.start_date} → {req.end_date}</div>
                <div className="leave-reason">{req.reason}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
