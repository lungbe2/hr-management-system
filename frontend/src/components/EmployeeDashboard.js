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
      <div className="employee-welcome">
        <h2>👋 Welcome, {user?.firstName}!</h2>
        <p>Here's your dashboard for today</p>
      </div>

      {/* Clock Section */}
      <div className="clock-section">
        <div className="clock-card">
          <div className="clock-icon">
            {isClockedIn ? '🟢' : '⏰'}
          </div>
          <div className="clock-info">
            <h3>{isClockedIn ? 'Clocked In' : 'Ready to Clock In'}</h3>
            <p>{isClockedIn ? `Since ${clockInTime?.toLocaleTimeString()}` : 'Start your work day'}</p>
          </div>
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            disabled={loading}
            className={isClockedIn ? 'clock-out-btn' : 'clock-in-btn'}
          >
            {loading ? 'Processing...' : (isClockedIn ? '🔴 Clock Out' : '🟢 Clock In')}
          </button>
        </div>

        {message && (
          <div className={`clock-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {clockInLocation && (
          <div className="location-indicator">
            📍 Location verified: {clockInLocation.lat.toFixed(6)}, {clockInLocation.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="employee-stats-grid">
        <div className="emp-stat-card">
          <span className="emp-stat-icon">📅</span>
          <div>
            <div className="emp-stat-value">Today</div>
            <div className="emp-stat-label">{isClockedIn ? 'Clocked In ✓' : 'Not clocked in'}</div>
          </div>
        </div>
        <div className="emp-stat-card">
          <span className="emp-stat-icon">⏱️</span>
          <div>
            <div className="emp-stat-value">8h 15m</div>
            <div className="emp-stat-label">Hours Today</div>
          </div>
        </div>
        <div className="emp-stat-card">
          <span className="emp-stat-icon">✅</span>
          <div>
            <div className="emp-stat-value">22</div>
            <div className="emp-stat-label">Days Present</div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Leave Management */}
        <div className="dashboard-card leave-card">
          <div className="card-header">
            <h3>✈️ Leave Management</h3>
            <button className="small-btn" onClick={() => setShowLeaveForm(!showLeaveForm)}>
              {showLeaveForm ? '✕' : '+ Request'}
            </button>
          </div>

          <div className="leave-balance-mini">
            <div className="balance-mini-item">
              <span>Annual</span>
              <strong>{leaveBalance.annual} days</strong>
            </div>
            <div className="balance-mini-item">
              <span>Sick</span>
              <strong>{leaveBalance.sick} days</strong>
            </div>
            <div className="balance-mini-item">
              <span>Casual</span>
              <strong>{leaveBalance.casual} days</strong>
            </div>
          </div>

          {showLeaveForm && (
            <form className="leave-form-mini" onSubmit={handleLeaveSubmit}>
              <div className="form-group">
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
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={leaveFormData.start_date}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={leaveFormData.end_date}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, end_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  rows="2"
                  placeholder="Optional reason for leave"
                />
              </div>
              <button type="submit" disabled={loading} className="submit-leave-btn">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          <div className="recent-leave">
            <h4>Recent Requests</h4>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((req, index) => (
                <div key={index} className="leave-item">
                  <div>
                    <span className="leave-type">{req.leave_type}</span>
                    <span className={`leave-status ${req.status?.toLowerCase()}`}>
                      {req.status || 'Pending'}
                    </span>
                  </div>
                  <div className="leave-dates">
                    {req.start_date} → {req.end_date}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No leave requests yet</p>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="dashboard-card attendance-card">
          <div className="card-header">
            <h3>⏰ Recent Attendance</h3>
          </div>
          <div className="attendance-list">
            {attendanceHistory.length > 0 ? (
              attendanceHistory.map((record, index) => (
                <div key={index} className="attendance-item">
                  <div className="attendance-date">{record.date}</div>
                  <div className="attendance-times">
                    <span className="clock-in-time">🟢 {record.clock_in || '--:--'}</span>
                    <span className="clock-out-time">🔴 {record.clock_out || '--:--'}</span>
                  </div>
                  <span className={`attendance-status ${record.status?.toLowerCase()}`}>
                    {record.status || 'Present'}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-items">No attendance records yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
