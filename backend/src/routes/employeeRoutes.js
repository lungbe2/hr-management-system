const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Routes accessible by Admin and Manager
router.get('/', checkRole(['Admin', 'Manager']), employeeController.getAllEmployees);
router.get('/:id', checkRole(['Admin', 'Manager']), employeeController.getEmployeeById);

// Admin only routes
router.post('/', checkRole(['Admin']), employeeController.createEmployee);
router.put('/:id', checkRole(['Admin']), employeeController.updateEmployee);
router.delete('/:id', checkRole(['Admin']), employeeController.deleteEmployee);

module.exports = router;
