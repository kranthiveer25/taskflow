const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, deleteTask, searchTasks } = require('../controllers/taskController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validateInput');

// Milestone 27: validate task input before creation
router.post('/', protect, authorizeRoles('admin', 'teamleader'), validateTask, createTask);
router.get('/', protect, getTasks);
router.get('/search', protect, searchTasks);
router.patch('/:taskId/status', protect, updateTaskStatus);
router.delete('/:taskId', protect, authorizeRoles('admin', 'teamleader'), deleteTask);

module.exports = router;