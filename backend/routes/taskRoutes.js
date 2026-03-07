const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('admin', 'teamleader'), createTask);
router.get('/', protect, getTasks);
router.patch('/:taskId/status', protect, updateTaskStatus);
router.delete('/:taskId', protect, authorizeRoles('admin', 'teamleader'), deleteTask);

module.exports = router;