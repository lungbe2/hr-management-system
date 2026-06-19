import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AttendanceClock = ({ token, user }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const historyArray = Array.isArray(data) ? data : (data.data || []);
      setHistory(historyArray);
      
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = historyArray.find(h => h.date === today && !h.clock_out);
      if (todayRecord) {
        setClockedIn(true);
        setClockInTime(todayRecord.clock_in);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClockIn = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_URL}/attendance/clock-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employee_id: user?.id,
          latitude: 40.7128,
          longitude: -74.0060,
          location: 'Main Office'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Clocked in at ${new Date().toLocaleTimeString()}`);
        setClockedIn(true);
        setClockInTime(new Date());
        fetchHistory();
      } else {
        setMessage('❌ Clock in failed: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/attendance/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employee_id: user?.id
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Clocked out at ${new Date().toLocaleTimeString()}`);
        setClockedIn(false);
        setClockInTime(null);
        fetchHistory();
      } else {
        setMessage('❌ Clock out failed: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h2>⏰ Attendance Tracking</h2>
      
      <div className="attendance-section">
        <h3>📍 Clock In/Out</h3>
        <div className="attendance-actions">
          <button 
            className="clock-btn clock-in-btn"
            onClick={handleClockIn}
            disabled={clockedIn || loading}
          >
            📥 Clock In
          </button>
          <button 
            className="clock-btn clock-out-btn"
            onClick={handleClockOut}
            disabled={!clockedIn || loading}
          >
            📤 Clock Out
          </button>
        </div>

        {clockedIn && (
          <div style={{ color: 'var(--success)', margin: '8px 0' }}>
            🟢 Currently clocked in since {clockInTime ? new Date(clockInTime).toLocaleTimeString() : '...'}
          </div>
        )}

        {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      </div>

      <div className="attendance-section">
        <h3>📊 Recent Attendance</h3>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No attendance records</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Clock In</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Clock Out</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{record.date}</td>
                    <td style={{ padding: '10px' }}>{record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : '-'}</td>
                    <td style={{ padding: '10px' }}>{record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : '-'}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`status-badge ${record.status?.toLowerCase() || 'present'}`}>
                        {record.status || 'Present'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceClock;
