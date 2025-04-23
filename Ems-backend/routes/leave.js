const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate(['employee']), leaveController.createLeaveRequest);
router.get('/', authenticate(), leaveController.getAllLeaveRequests);
router.get('/:id', authenticate(), leaveController.getLeaveRequestById);
router.put('/:id', authenticate(['admin', 'hr']), leaveController.updateLeaveRequest);
router.delete('/:id', authenticate(), leaveController.deleteLeaveRequest);

module.exports = router;
