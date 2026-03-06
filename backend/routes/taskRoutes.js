const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('admin', 'teamleader'), createTask);
router.get('/', protect, getTasks);

module.exports = router;