const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const authenticate = require('../middlewares/auth');

// Only admin/hr can manage salaries
router.post('/', authenticate(['admin', 'hr']), salaryController.createSalary);
router.get('/', authenticate(['admin', 'hr']), salaryController.getAllSalaries);
router.get('/:id', authenticate(['admin', 'hr']), salaryController.getSalaryById);
router.put('/:id', authenticate(['admin', 'hr']), salaryController.updateSalary);
router.delete('/:id', authenticate(['admin', 'hr']), salaryController.deleteSalary);

module.exports = router;
