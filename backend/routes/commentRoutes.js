const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validateInput');

// Milestone 27: validate comment input
router.post('/:taskId', protect, validateComment, addComment);
router.get('/:taskId', protect, getComments);

module.exports = router;