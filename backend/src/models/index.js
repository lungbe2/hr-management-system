const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrms_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Define Models
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('Admin', 'Manager', 'Employee'), allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: { type: DataTypes.DATE }
});

const Department = sequelize.define('Department', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
});

const JobTitle = sequelize.define('JobTitle', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING },
  department_id: { type: DataTypes.UUID, allowNull: false }
});

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
  employee_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  department_id: { type: DataTypes.UUID, allowNull: false },
  job_title_id: { type: DataTypes.UUID, allowNull: false },
  hire_date: { type: DataTypes.DATEONLY, allowNull: false },
  salary: { type: DataTypes.DECIMAL(10, 2) },
  bank_details: { type: DataTypes.TEXT },
  emergency_contact: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('Active', 'On Leave', 'Terminated'), defaultValue: 'Active' }
});

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employee_id: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  clock_in: { type: DataTypes.DATE },
  clock_out: { type: DataTypes.DATE },
  location: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DECIMAL(10, 8) },
  longitude: { type: DataTypes.DECIMAL(11, 8) },
  status: { type: DataTypes.ENUM('Present', 'Absent', 'Leave', 'Late'), defaultValue: 'Present' },
  overtime_hours: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 }
});

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employee_id: { type: DataTypes.UUID, allowNull: false },
  leave_type: { type: DataTypes.ENUM('Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid'), allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Cancelled'), defaultValue: 'Pending' },
  approved_by: { type: DataTypes.UUID },
  approved_at: { type: DataTypes.DATE }
});

const Payroll = sequelize.define('Payroll', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employee_id: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  basic_salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  allowances: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  deductions: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  overtime: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  net_pay: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payslip_generated: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const PerformanceReview = sequelize.define('PerformanceReview', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employee_id: { type: DataTypes.UUID, allowNull: false },
  reviewer_id: { type: DataTypes.UUID, allowNull: false },
  review_date: { type: DataTypes.DATEONLY, allowNull: false },
  rating: { type: DataTypes.INTEGER },
  feedback: { type: DataTypes.TEXT },
  goals_achieved: { type: DataTypes.TEXT }
});

const Document = sequelize.define('Document', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category_id: { type: DataTypes.UUID, allowNull: false },
  description: { type: DataTypes.TEXT },
  file_path: { type: DataTypes.STRING, allowNull: false },
  version: { type: DataTypes.STRING },
  uploaded_by: { type: DataTypes.UUID, allowNull: false },
  upload_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const DocumentCategory = sequelize.define('DocumentCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
});

const Premise = sequelize.define('Premise', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  radius: { type: DataTypes.INTEGER, defaultValue: 100 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Holiday = sequelize.define('Holiday', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  type: { type: DataTypes.STRING }
});

// Define Relationships
User.hasOne(Employee, { foreignKey: 'user_id' });
Employee.belongsTo(User, { foreignKey: 'user_id' });

Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

JobTitle.hasMany(Employee, { foreignKey: 'job_title_id' });
Employee.belongsTo(JobTitle, { foreignKey: 'job_title_id' });

Employee.hasMany(Attendance, { foreignKey: 'employee_id' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id' });

Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id' });

Employee.hasMany(Payroll, { foreignKey: 'employee_id' });
Payroll.belongsTo(Employee, { foreignKey: 'employee_id' });

Employee.hasMany(PerformanceReview, { foreignKey: 'employee_id' });
PerformanceReview.belongsTo(Employee, { foreignKey: 'employee_id' });

User.hasMany(PerformanceReview, { foreignKey: 'reviewer_id' });
PerformanceReview.belongsTo(User, { foreignKey: 'reviewer_id' });

DocumentCategory.hasMany(Document, { foreignKey: 'category_id' });
Document.belongsTo(DocumentCategory, { foreignKey: 'category_id' });

User.hasMany(Document, { foreignKey: 'uploaded_by' });
Document.belongsTo(User, { foreignKey: 'uploaded_by' });

module.exports = {
  sequelize,
  User,
  Department,
  JobTitle,
  Employee,
  Attendance,
  LeaveRequest,
  Payroll,
  PerformanceReview,
  Document,
  DocumentCategory,
  Premise,
  Holiday
};
