const { Employee, User, Department, JobTitle } = require('../models');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email', 'phone'] },
        { model: Department, attributes: ['name', 'code'] },
        { model: JobTitle, attributes: ['name', 'level'] }
      ]
    });
    
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to get employees' });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'email', 'phone'] },
        { model: Department, attributes: ['name', 'code'] },
        { model: JobTitle, attributes: ['name', 'level'] }
      ]
    });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to get employee' });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      employeeCode, 
      departmentId, 
      jobTitleId, 
      hireDate, 
      salary 
    } = req.body;
    
    // Create user first
    const user = await User.create({
      email,
      password_hash: await require('bcryptjs').hash('Employee@123', 10),
      role: 'Employee',
      first_name: firstName,
      last_name: lastName,
      phone,
      is_active: true
    });
    
    // Create employee
    const employee = await Employee.create({
      user_id: user.id,
      employee_code: employeeCode,
      department_id: departmentId,
      job_title_id: jobTitleId,
      hire_date: hireDate,
      salary: salary,
      status: 'Active'
    });
    
    res.status(201).json({ 
      message: 'Employee created successfully',
      employee,
      user 
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    await employee.update(updates);
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Delete the associated user too
    await User.destroy({ where: { id: employee.user_id } });
    await employee.destroy();
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
