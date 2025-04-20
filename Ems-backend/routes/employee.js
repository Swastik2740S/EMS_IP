const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authenticate = require('../middlewares/auth');

// Employee routes
router.post('/', authenticate(['admin', 'hr']), employeeController.createEmployee);
router.get('/', authenticate(['admin', 'hr']), employeeController.getAllEmployees);
router.get('/:id', authenticate(), employeeController.getEmployeeById);
router.put('/:id', authenticate(['admin', 'hr']), employeeController.updateEmployee);
router.delete('/:id', authenticate(['admin', 'hr']), employeeController.deleteEmployee);

module.exports = router;
