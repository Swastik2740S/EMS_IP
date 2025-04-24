const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middlewares/auth');

router.get('/admin', authenticate(['admin', 'hr']), dashboardController.getAdminDashboard);
router.get('/employee', authenticate(['employee']), dashboardController.getEmployeeDashboard);

module.exports = router;
