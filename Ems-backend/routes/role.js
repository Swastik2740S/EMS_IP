const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate(['admin', 'hr']), roleController.createRole);
router.get('/', authenticate(), roleController.getAllRoles);
router.put('/:id', authenticate(['admin', 'hr']), roleController.updateRole);
router.delete('/:id', authenticate(['admin', 'hr']), roleController.deleteRole);

module.exports = router;
