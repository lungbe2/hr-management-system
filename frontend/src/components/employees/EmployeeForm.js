import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeForm = ({ employee, onSave, onCancel, token }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_code: '',
    department_id: '',
    job_title_id: '',
    hire_date: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.User?.first_name || '',
        last_name: employee.User?.last_name || '',
        email: employee.User?.email || '',
        phone: employee.User?.phone || '',
        employee_code: employee.employee_code || '',
        department_id: employee.department_id || '',
        job_title_id: employee.job_title_id || '',
        hire_date: employee.hire_date || '',
        salary: employee.salary || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = employee ? `${API_URL}/employees/${employee.id}` : `${API_URL}/employees`;
      const method = employee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Employee ${employee ? 'updated' : 'created'} successfully!`);
        setTimeout(() => onSave(), 1000);
      } else {
        setMessage('❌ Failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal">
        <h2>{employee ? '✏️ Edit Employee' : '➕ Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Employee Code *</label>
              <input type="text" name="employee_code" value={formData.employee_code} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department ID</label>
              <input type="text" name="department_id" value={formData.department_id} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Job Title ID</label>
              <input type="text" name="job_title_id" value={formData.job_title_id} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Hire Date</label>
              <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
            </div>
          </div>
          {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
