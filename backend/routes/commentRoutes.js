const express = require('express');
const router = express.Router();
const { addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Any logged in user can comment
router.post('/:taskId', protect, addComment);

module.exports = router;