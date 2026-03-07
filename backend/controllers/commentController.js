const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Add comment to task
// @route   POST /api/comments/:taskId
const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      text
    });


    await comment.populate('user', 'name email role');

    res.status(201).json({ message: 'Comment added successfully', comment });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addComment };