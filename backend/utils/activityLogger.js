const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, taskId, action) => {
  try {
    await ActivityLog.create({
      user: userId,
      task: taskId,
      action
    });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

module.exports = logActivity;