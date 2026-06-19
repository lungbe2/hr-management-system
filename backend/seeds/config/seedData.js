module.exports = {
  departments: [
    { name: 'Engineering', code: 'ENG', description: 'Software Development' },
    { name: 'Human Resources', code: 'HR', description: 'HR Management' },
    { name: 'Finance', code: 'FIN', description: 'Finance & Accounting' }
  ],

  users: [
    {
      email: 'admin@company.com',
      password: 'Admin@123',
      role: 'Admin',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1-555-000-0001'
    },
    {
      email: 'hrmanager@company.com',
      password: 'HR@123',
      role: 'Manager',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-000-0002'
    },
    {
      email: 'employee1@company.com',
      password: 'Employee@123',
      role: 'Employee',
      firstName: 'David',
      lastName: 'Kumar',
      phone: '+1-555-000-0003'
    },
    {
      email: 'employee2@company.com',
      password: 'Employee@123',
      role: 'Employee',
      firstName: 'Maria',
      lastName: 'Garcia',
      phone: '+1-555-000-0004'
    }
  ],

  employees: [
    {
      userId: 2,
      employeeCode: 'EMP-001',
      department: 'Human Resources',
      jobTitle: 'HR Manager',
      hireDate: '2020-01-15',
      salary: 85000,
      bankDetails: 'CHASE-001-12345678',
      emergencyContact: 'John Johnson, +1-555-999-0001'
    },
    {
      userId: 3,
      employeeCode: 'EMP-002',
      department: 'Engineering',
      jobTitle: 'Software Engineer',
      hireDate: '2021-07-01',
      salary: 72000,
      bankDetails: 'CITI-004-55667788',
      emergencyContact: 'Anita Kumar, +1-555-999-0004'
    },
    {
      userId: 4,
      employeeCode: 'EMP-003',
      department: 'Human Resources',
      jobTitle: 'HR Specialist',
      hireDate: '2021-09-15',
      salary: 55000,
      bankDetails: 'CHASE-005-99887766',
      emergencyContact: 'Carlos Garcia, +1-555-999-0005'
    }
  ],

  jobTitles: [
    { name: 'Software Engineer', level: 'Senior', department: 'Engineering' },
    { name: 'HR Manager', level: 'Manager', department: 'Human Resources' },
    { name: 'HR Specialist', level: 'Specialist', department: 'Human Resources' },
    { name: 'Accountant', level: 'Senior', department: 'Finance' }
  ],

  premises: [
    {
      name: 'Main Office',
      address: '123 Business Park, New York, NY 10001',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
      isActive: true
    }
  ],

  holidays: [
    { name: "New Year's Day", date: '2026-01-01', type: 'Public' },
    { name: 'Independence Day', date: '2026-07-04', type: 'Public' },
    { name: 'Christmas Day', date: '2026-12-25', type: 'Public' }
  ],

  generateAttendance: (employeeIds, days = 7) => {
    const attendance = [];
    const now = new Date();
    
    employeeIds.forEach(empId => {
      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        if (Math.random() < 0.8) {
          const clockIn = new Date(date);
          clockIn.setHours(8 + Math.floor(Math.random() * 1.5), Math.floor(Math.random() * 60), 0);
          
          const clockOut = new Date(date);
          clockOut.setHours(17 + Math.floor(Math.random() * 1.5), Math.floor(Math.random() * 60), 0);
          
          attendance.push({
            employeeId: empId,
            date: date,
            clockIn: clockIn,
            clockOut: clockOut,
            location: 'Main Office',
            status: 'Present',
            latitude: 40.7128 + (Math.random() - 0.5) * 0.001,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.001
          });
        }
      }
    });
    
    return attendance;
  },

  leaveRequests: [
    {
      employeeId: 3,
      leaveType: 'Annual',
      startDate: '2026-07-15',
      endDate: '2026-07-20',
      reason: 'Family vacation',
      status: 'Approved',
      approvedBy: 2
    }
  ],

  generatePayroll: (employeeIds, months = 2) => {
    const payroll = [];
    const currentDate = new Date();
    
    employeeIds.forEach(empId => {
      for (let i = 0; i < months; i++) {
        const month = currentDate.getMonth() - i;
        const year = currentDate.getFullYear();
        if (month < 0) continue;
        
        const basicSalary = 50000 + Math.floor(Math.random() * 50000);
        const allowances = Math.floor(basicSalary * 0.15);
        const deductions = Math.floor(basicSalary * 0.08);
        const overtime = Math.floor(Math.random() * 1000);
        const netPay = basicSalary + allowances + overtime - deductions;
        
        payroll.push({
          employeeId: empId,
          month: month + 1,
          year: year,
          basicSalary: basicSalary,
          allowances: allowances,
          deductions: deductions,
          overtime: overtime,
          netPay: netPay,
          payslipGenerated: true
        });
      }
    });
    
    return payroll;
  },

  performanceReviews: [
    {
      employeeId: 3,
      reviewerId: 2,
      reviewDate: '2026-06-01',
      rating: 4,
      feedback: 'Excellent performance this quarter.',
      goalsAchieved: 'Completed all major projects'
    }
  ],

  documentCategories: [
    { name: 'Policies', description: 'Company policies' },
    { name: 'Contracts', description: 'Employment contracts' },
    { name: 'Forms', description: 'HR forms' }
  ],

  documents: [
    {
      title: 'Employee Handbook',
      category: 'Policies',
      description: 'Complete employee handbook',
      filePath: '/documents/handbook.pdf',
      version: '1.0'
    }
  ]
};
