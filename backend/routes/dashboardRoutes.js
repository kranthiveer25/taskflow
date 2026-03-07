const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.get('/user', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: 'inprogress' });

    // Overdue tasks = pending/inprogress tasks whose deadline has passed
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $in: ['pending', 'inprogress'] },
      deadline: { $lt: new Date() }
    });

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
const User = require('../models/User');
const Team = require('../models/Team');
const ActivityLog = require('../models/ActivityLog');
const { authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorizeRoles('admin', 'teamleader'), async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'inprogress' });

    // Recent 5 activities
    const recentActivity = await ActivityLog.find()
      .populate('user', 'name role')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalTeams,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      recentActivity
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;