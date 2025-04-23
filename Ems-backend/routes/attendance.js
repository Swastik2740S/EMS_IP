const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate(['admin', 'hr']), attendanceController.createAttendance);
router.get('/', authenticate(), attendanceController.getAllAttendance);
router.get('/:id', authenticate(), attendanceController.getAttendanceById);
router.put('/:id', authenticate(['admin', 'hr']), attendanceController.updateAttendance);
router.delete('/:id', authenticate(['admin', 'hr']), attendanceController.deleteAttendance);

module.exports = router;
