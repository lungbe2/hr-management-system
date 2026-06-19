const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper for handling responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || 'Request failed');
  }
  return response.json();
};

// API Service
export const api = {
  // ============ AUTH ============
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // ============ EMPLOYEES ============
  getEmployees: async (token) => {
    const response = await fetch(`${API_URL}/employees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getEmployeeById: async (id, token) => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  createEmployee: async (data, token) => {
    const response = await fetch(`${API_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateEmployee: async (id, data, token) => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteEmployee: async (id, token) => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // ============ ATTENDANCE ============
  clockIn: async (data, token) => {
    const response = await fetch(`${API_URL}/attendance/clock-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  clockOut: async (data, token) => {
    const response = await fetch(`${API_URL}/attendance/clock-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getAttendanceHistory: async (token) => {
    const response = await fetch(`${API_URL}/attendance/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // ============ LEAVE ============
  getLeaveRequests: async (token) => {
    const response = await fetch(`${API_URL}/leave/requests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  createLeaveRequest: async (data, token) => {
    const response = await fetch(`${API_URL}/leave/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  approveLeave: async (id, token) => {
    const response = await fetch(`${API_URL}/leave/requests/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  rejectLeave: async (id, token) => {
    const response = await fetch(`${API_URL}/leave/requests/${id}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getLeaveBalance: async (token) => {
    const response = await fetch(`${API_URL}/leave/balance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getHolidays: async () => {
    const response = await fetch(`${API_URL}/holidays`);
    return handleResponse(response);
  },

  // ============ PAYROLL ============
  getPayroll: async (token) => {
    const response = await fetch(`${API_URL}/payroll`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  generatePayslip: async (id, token) => {
    const response = await fetch(`${API_URL}/payroll/${id}/payslip`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  exportPayroll: async (data, token) => {
    const response = await fetch(`${API_URL}/payroll/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // ============ PERFORMANCE ============
  getPerformanceReviews: async (token) => {
    const response = await fetch(`${API_URL}/performance/reviews`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  createPerformanceReview: async (data, token) => {
    const response = await fetch(`${API_URL}/performance/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // ============ DOCUMENTS ============
  getDocuments: async (token) => {
    const response = await fetch(`${API_URL}/documents`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  uploadDocument: async (formData, token) => {
    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return handleResponse(response);
  },

  deleteDocument: async (id, token) => {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  getDocumentCategories: async (token) => {
    const response = await fetch(`${API_URL}/documents/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // ============ REPORTS ============
  getReports: async (type, token) => {
    const response = await fetch(`${API_URL}/reports/${type}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

export default api;
