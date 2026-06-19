import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://hrms-backend-i5pv.onrender.com/api';

const EmployeeDashboard = ({ user, token }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({ annual: 15, sick: 8, casual: 5 });
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    leave_type: 'Annual',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clockInLocation, setClockInLocation] = useState(null);

  // Get location for clock in
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // Clock In
  const handleClockIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      const location = await getLocation();
      setClockInLocation(location);

      const response = await fetch(`${API_URL}/attendance/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employee_id: user.id,
          latitude: location.lat,
          longitude: location.lng,
          location: 'Main Office'
        })
      });

      const data = await response.json();

      if (response.ok) {
        const now = new Date();
        setIsClockedIn(true);
        setClockInTime(now);
        setMessage(`✅ Clocked in at ${now.toLocaleTimeString()}`);
        await fetchAttendanceHistory();
      } else {
        setMessage('❌ Clock in failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      if (error.code === 1) {
        setMessage('❌ Location access denied. Please allow location access.');
      } else {
        setMessage('❌ Error: ' + error.message);
      }
    }
    setLoading(false);
  };

  // Clock Out
  const handleClockOut = async () => {
    setLoading(true);
    setMessage('');

    try {
      const location = await getLocation();

      const response = await fetch(`${API_URL}/attendance/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employee_id: user.id,
          latitude: location.lat,
          longitude: location.lng,
          location: 'Main Office'
        })
      });

      const data = await response.json();

      if (response.ok) {
        const now = new Date();
        setIsClockedIn(false);
        setMessage(`✅ Clocked out at ${now.toLocaleTimeString()}`);
        await fetchAttendanceHistory();
      } else {
        setMessage('❌ Clock out failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      if (error.code === 1) {
        setMessage('❌ Location access denied. Please allow location access.');
      } else {
        setMessage('❌ Error: ' + error.message);
      }
    }
    setLoading(false);
  };

  // Fetch attendance history
  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAttendanceHistory(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/leave/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeaveRequests(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error('Error fetching leave:', error);
    }
  };

  // Submit leave request
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/leave/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leaveFormData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Leave request submitted!');
        setShowLeaveForm(false);
        setLeaveFormData({
          leave_type: 'Annual',
          start_date: '',
          end_date: '',
          reason: ''
        });
        await fetchLeaveRequests();
      } else {
        setMessage('❌ Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendanceHistory();
    fetchLeaveRequests();
  }, []);

  return (
    <div className="employee-dashboard-container">
      {/* Welcome Section */}
      <div className="emp-welcome-section">
        <div className="emp-welcome-content">
          <div className="emp-welcome-icon">👋</div>
          <div>
            <h2>Welcome back, {user?.firstName}!</h2>
            <p>Here's your work summary for today</p>
          </div>
        </div>
        <div className="emp-date-badge">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Clock In/Out Card */}
      <div className="emp-clock-card">
        <div className="emp-clock-left">
          <div className={`emp-clock-status ${isClockedIn ? 'clocked-in' : 'clocked-out'}`}>
            <span className="emp-clock-dot"></span>
            <span className="emp-clock-label">{isClockedIn ? 'Clocked In' : 'Ready to Clock In'}</span>
          </div>
          <div className="emp-clock-time">
            {isClockedIn ? `Since ${clockInTime?.toLocaleTimeString()}` : 'Start your work day'}
          </div>
        </div>
        <button
          onClick={isClockedIn ? handleClockOut : handleClockIn}
          disabled={loading}
          className={`emp-clock-btn ${isClockedIn ? 'clock-out' : 'clock-in'}`}
        >
          {loading ? '⏳ Processing...' : (isClockedIn ? '🔴 Clock Out' : '🟢 Clock In')}
        </button>
      </div>

      {message && (
        <div className={`emp-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {clockInLocation && (
        <div className="emp-location">
          📍 Location verified: {clockInLocation.lat.toFixed(6)}, {clockInLocation.lng.toFixed(6)}
        </div>
      )}

      {/* Stats Grid */}
      <div className="emp-stats-grid">
        <div className="emp-stat-item">
          <div className="emp-stat-icon">📅</div>
          <div>
            <div className="emp-stat-value">{isClockedIn ? 'Clocked In ✓' : 'Not clocked in'}</div>
            <div className="emp-stat-label">Today's Status</div>
          </div>
        </div>
        <div className="emp-stat-item">
          <div className="emp-stat-icon">⏱️</div>
          <div>
            <div className="emp-stat-value">8h 15m</div>
            <div className="emp-stat-label">Hours Today</div>
          </div>
        </div>
        <div className="emp-stat-item">
          <div className="emp-stat-icon">✅</div>
          <div>
            <div className="emp-stat-value">22</div>
            <div className="emp-stat-label">Days Present</div>
          </div>
        </div>
        <div className="emp-stat-item">
          <div className="emp-stat-icon">📊</div>
          <div>
            <div className="emp-stat-value">95%</div>
            <div className="emp-stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="emp-two-col">
        {/* Leave Management */}
        <div className="emp-card">
          <div className="emp-card-header">
            <h3>✈️ Leave Management</h3>
            <button className="emp-small-btn" onClick={() => setShowLeaveForm(!showLeaveForm)}>
              {showLeaveForm ? '✕' : '+ Request'}
            </button>
          </div>

          <div className="emp-leave-balance">
            <div className="emp-balance-item">
              <span>🏖️ Annual</span>
              <strong>{leaveBalance.annual} days</strong>
            </div>
            <div className="emp-balance-item">
              <span>🤒 Sick</span>
              <strong>{leaveBalance.sick} days</strong>
            </div>
            <div className="emp-balance-item">
              <span>📋 Casual</span>
              <strong>{leaveBalance.casual} days</strong>
            </div>
          </div>

          {showLeaveForm && (
            <form className="emp-leave-form" onSubmit={handleLeaveSubmit}>
              <div className="emp-form-group">
                <label>Leave Type</label>
                <select
                  value={leaveFormData.leave_type}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, leave_type: e.target.value })}
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
              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label>Start</label>
                  <input
                    type="date"
                    value={leaveFormData.start_date}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="emp-form-group">
                  <label>End</label>
                  <input
                    type="date"
                    value={leaveFormData.end_date}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="emp-form-group">
                <label>Reason</label>
                <textarea
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  rows="2"
                  placeholder="Optional reason"
                />
              </div>
              <button type="submit" disabled={loading} className="emp-submit-btn">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          <div className="emp-recent-list">
            <h4>Recent Requests</h4>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((req, index) => (
                <div key={index} className="emp-list-item">
                  <div>
                    <span className="emp-list-type">{req.leave_type}</span>
                    <span className={`emp-list-status ${req.status?.toLowerCase()}`}>
                      {req.status || 'Pending'}
                    </span>
                  </div>
                  <div className="emp-list-date">
                    {req.start_date} → {req.end_date}
                  </div>
                </div>
              ))
            ) : (
              <p className="emp-empty">No leave requests yet</p>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="emp-card">
          <div className="emp-card-header">
            <h3>⏰ Recent Attendance</h3>
          </div>
          <div className="emp-attendance-list">
            {attendanceHistory.length > 0 ? (
              attendanceHistory.map((record, index) => (
                <div key={index} className="emp-attendance-item">
                  <div className="emp-attendance-date">{record.date}</div>
                  <div className="emp-attendance-times">
                    <span className="emp-clock-in">🟢 {record.clock_in || '--:--'}</span>
                    <span className="emp-clock-out">🔴 {record.clock_out || '--:--'}</span>
                  </div>
                  <span className={`emp-attendance-status ${record.status?.toLowerCase()}`}>
                    {record.status || 'Present'}
                  </span>
                </div>
              ))
            ) : (
              <p className="emp-empty">No attendance records yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
