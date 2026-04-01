const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Indexes for performance optimization
teamSchema.index({ name: 1 });         // search teams by name
teamSchema.index({ leader: 1 });       // quickly find teams owned by a leader
teamSchema.index({ createdAt: -1 });   // sort by newest

module.exports = mongoose.model('Team', teamSchema);