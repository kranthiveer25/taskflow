const mongoose = require('mongoose');

const taskFileSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  size: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('TaskFile', taskFileSchema);