const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middlewares/auth');

router.post('/check-in', authenticate(['employee']), attendanceController.checkIn);
router.post('/check-out', authenticate(['employee']), attendanceController.checkOut);
router.get('/', authenticate(), attendanceController.getAttendance);

module.exports = router;
