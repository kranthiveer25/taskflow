const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect } = require('../middleware/authMiddleware');
const TaskFile = require('../models/TaskFile');

// Upload file to a task
router.post('/:taskId', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const taskFile = await TaskFile.create({
      task: req.params.taskId,
      uploadedBy: req.user._id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
    res.status(200).json({ message: 'File uploaded successfully', file: taskFile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all files for a task
router.get('/:taskId', protect, async (req, res) => {
  try {
    const files = await TaskFile.find({ task: req.params.taskId })
      .populate('uploadedBy', 'name');
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;