require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hrms_db',
  password: 'postgres123',
  port: 5432,
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📡 Connected to PostgreSQL...');
    
    await client.query('BEGIN');

    // First, check if tables exist and clear them safely
    console.log('🧹 Clearing existing data...');
    
    // Get all table names
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    const tableNames = tables.rows.map(r => r.tablename);
    console.log(`📋 Found tables: ${tableNames.join(', ')}`);
    
    // Clear tables in correct order
    if (tableNames.includes('attendances')) {
      await client.query('DELETE FROM attendances');
      console.log('   ✅ Cleared attendances');
    }
    if (tableNames.includes('leave_requests')) {
      await client.query('DELETE FROM leave_requests');
      console.log('   ✅ Cleared leave_requests');
    }
    if (tableNames.includes('performance_reviews')) {
      await client.query('DELETE FROM performance_reviews');
      console.log('   ✅ Cleared performance_reviews');
    }
    if (tableNames.includes('payrolls')) {
      await client.query('DELETE FROM payrolls');
      console.log('   ✅ Cleared payrolls');
    }
    if (tableNames.includes('documents')) {
      await client.query('DELETE FROM documents');
      console.log('   ✅ Cleared documents');
    }
    if (tableNames.includes('employees')) {
      await client.query('DELETE FROM employees');
      console.log('   ✅ Cleared employees');
    }
    if (tableNames.includes('users')) {
      await client.query('DELETE FROM users');
      console.log('   ✅ Cleared users');
    }
    if (tableNames.includes('departments')) {
      await client.query('DELETE FROM departments');
      console.log('   ✅ Cleared departments');
    }
    if (tableNames.includes('job_titles')) {
      await client.query('DELETE FROM job_titles');
      console.log('   ✅ Cleared job_titles');
    }

    const now = new Date();

    // Seed Departments with UUIDs and timestamps
    console.log('📋 Seeding departments...');
    const departmentMap = {};
    const departments = [
      { name: 'Engineering', code: 'ENG', description: 'Software Development' },
      { name: 'Human Resources', code: 'HR', description: 'HR Management' },
      { name: 'Finance', code: 'FIN', description: 'Finance & Accounting' }
    ];
    
    for (const dept of departments) {
      const id = uuidv4();
      const result = await client.query(
        'INSERT INTO departments (id, name, code, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [id, dept.name, dept.code, dept.description, now, now]
      );
      departmentMap[dept.name] = result.rows[0].id;
    }
    console.log('   ✅ Departments seeded');

    // Seed Job Titles with UUIDs and timestamps
    console.log('💼 Seeding job titles...');
    const jobTitleMap = {};
    const jobTitles = [
      { name: 'Software Engineer', level: 'Senior', department: 'Engineering' },
      { name: 'Team Lead', level: 'Lead', department: 'Engineering' },
      { name: 'HR Manager', level: 'Manager', department: 'Human Resources' },
      { name: 'HR Specialist', level: 'Specialist', department: 'Human Resources' },
      { name: 'Accountant', level: 'Senior', department: 'Finance' }
    ];
    
    for (const title of jobTitles) {
      const id = uuidv4();
      const deptId = departmentMap[title.department];
      const result = await client.query(
        'INSERT INTO job_titles (id, name, level, department_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [id, title.name, title.level, deptId, now, now]
      );
      jobTitleMap[`${title.name}-${title.department}`] = result.rows[0].id;
    }
    console.log('   ✅ Job titles seeded');

    // Seed Users with UUIDs and timestamps
    console.log('👤 Seeding users...');
    const userIdMap = {};
    const users = [
      { email: 'admin@company.com', password: 'Admin@123', role: 'Admin', firstName: 'System', lastName: 'Administrator', phone: '+1-555-000-0001' },
      { email: 'hrmanager@company.com', password: 'HR@123', role: 'Manager', firstName: 'Sarah', lastName: 'Johnson', phone: '+1-555-000-0002' },
      { email: 'employee1@company.com', password: 'Employee@123', role: 'Employee', firstName: 'David', lastName: 'Kumar', phone: '+1-555-000-0003' },
      { email: 'employee2@company.com', password: 'Employee@123', role: 'Employee', firstName: 'Maria', lastName: 'Garcia', phone: '+1-555-000-0004' }
    ];
    
    for (const user of users) {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await client.query(
        `INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_active, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [id, user.email, hashedPassword, user.role, user.firstName, user.lastName, user.phone, true, now, now]
      );
      userIdMap[user.email] = result.rows[0].id;
    }
    console.log('   ✅ Users seeded');

    // Seed Employees with UUIDs and timestamps
    console.log('👔 Seeding employees...');
    const employeeIdMap = {};
    const employees = [
      { userEmail: 'hrmanager@company.com', employeeCode: 'EMP-001', department: 'Human Resources', jobTitle: 'HR Manager', hireDate: '2020-01-15', salary: 85000 },
      { userEmail: 'employee1@company.com', employeeCode: 'EMP-002', department: 'Engineering', jobTitle: 'Software Engineer', hireDate: '2021-07-01', salary: 72000 },
      { userEmail: 'employee2@company.com', employeeCode: 'EMP-003', department: 'Human Resources', jobTitle: 'HR Specialist', hireDate: '2021-09-15', salary: 55000 }
    ];
    
    for (const emp of employees) {
      const id = uuidv4();
      const userId = userIdMap[emp.userEmail];
      const deptId = departmentMap[emp.department];
      const jobTitleId = jobTitleMap[`${emp.jobTitle}-${emp.department}`];
      
      const result = await client.query(
        `INSERT INTO employees 
         (id, user_id, employee_code, department_id, job_title_id, hire_date, salary, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [id, userId, emp.employeeCode, deptId, jobTitleId, emp.hireDate, emp.salary, 'Active', now, now]
      );
      employeeIdMap[emp.employeeCode] = result.rows[0].id;
    }
    console.log('   ✅ Employees seeded');

    // Seed some attendance records with UUIDs and timestamps
    console.log('⏰ Seeding attendance records...');
    const employeeIds = Object.values(employeeIdMap);
    
    for (const empId of employeeIds) {
      for (let i = 1; i <= 5; i++) {
        const id = uuidv4();
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        const clockIn = new Date(date);
        clockIn.setHours(8 + Math.floor(Math.random() * 1.5), Math.floor(Math.random() * 60), 0);
        
        const clockOut = new Date(date);
        clockOut.setHours(17 + Math.floor(Math.random() * 1.5), Math.floor(Math.random() * 60), 0);
        
        await client.query(
          `INSERT INTO attendances 
           (id, employee_id, date, clock_in, clock_out, location, status, latitude, longitude, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [id, empId, date, clockIn, clockOut, 'Main Office', 'Present', 40.7128, -74.0060, now, now]
        );
      }
    }
    console.log('   ✅ Attendance seeded');

    // Seed Leave Requests with UUIDs and timestamps
    console.log('✈️ Seeding leave requests...');
    const leaveRequests = [
      { empCode: 'EMP-002', type: 'Annual', start: '2026-07-15', end: '2026-07-20', reason: 'Family vacation', status: 'Approved' },
      { empCode: 'EMP-003', type: 'Sick', start: '2026-06-10', end: '2026-06-11', reason: "Doctor's appointment", status: 'Approved' }
    ];
    
    for (const leave of leaveRequests) {
      const id = uuidv4();
      const empId = employeeIdMap[leave.empCode];
      await client.query(
        `INSERT INTO leave_requests 
         (id, employee_id, leave_type, start_date, end_date, reason, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, empId, leave.type, leave.start, leave.end, leave.reason, leave.status, now, now]
      );
    }
    console.log('   ✅ Leave requests seeded');

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${Object.keys(userIdMap).length} users created`);
    console.log(`   - ${Object.keys(employeeIdMap).length} employees created`);
    console.log('   - Attendance records created');
    console.log('   - Leave requests created');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('   Admin:    admin@company.com / Admin@123');
    console.log('   HR Manager: hrmanager@company.com / HR@123');
    console.log('   Employee: employee1@company.com / Employee@123');
    console.log('   Employee: employee2@company.com / Employee@123');
    
    await client.query('COMMIT');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
