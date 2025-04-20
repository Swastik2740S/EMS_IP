const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middlewares/auth');

// Create department (Admin/HR only)
router.post('/', 
  authenticate(['admin', 'hr']), 
  departmentController.createDepartment
);

// Get all departments (Authenticated users)
router.get('/', 
  authenticate(), 
  departmentController.getAllDepartments
);

// Get single department (Authenticated users)
router.get('/:id', 
  authenticate(), 
  departmentController.getDepartmentById
);

// Update department (Admin/HR only)
router.put('/:id', 
  authenticate(['admin', 'hr']), 
  departmentController.updateDepartment
);

// Delete department (Admin/HR only)
router.delete('/:id', 
  authenticate(['admin', 'hr']), 
  departmentController.deleteDepartment
);

module.exports = router;
